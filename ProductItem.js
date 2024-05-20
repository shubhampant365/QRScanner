import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProductItems from '@salesforce/apex/ProductController.getProductItems';
import updateRequestedQuantity from '@salesforce/apex/ProductController.updateRequestedQuantity';
import { refreshApex } from '@salesforce/apex';

export default class ProductRequestComponent extends LightningElement {
    locationId = '1315g000000lQpvAAE';
    productItems;
    refreshTable = false; // Flag to trigger table refresh

    @wire(getProductItems, { locationId: '$locationId' })
    wiredProductItems(value) {
        this.refreshTable = false; // Reset flag when data is refreshed
        const { error, data } = value;
        if (data) {
            this.productItems = data.map(item => ({
                ...item,
                requestedQuantity: '' // Initialize requested quantity as empty string
            }));
        } else if (error) {
            console.error(error);
        }
    }

    handleQuantityChange(event) {
        const productId = event.target.dataset.id;
        const newQuantity = event.target.value;
        // Update the requested quantity for the specific product
        this.productItems = this.productItems.map(item => ({
            ...item,
            requestedQuantity: item.Id === productId ? parseInt(newQuantity) : item.requestedQuantity
        }));
    }

    handleRequestAll() {
        // Loop through all product items and update quantities
        const promises = this.productItems.map(product => {
            // If nothing is entered in the request quantity, skip
            if (isNaN(product.requestedQuantity) || product.requestedQuantity === '') {
                return Promise.resolve();
            }
            // Calculate updated quantity on hand
            const updatedQuantity = product.QuantityOnHand - parseInt(product.requestedQuantity);
            // Call Apex method to update requested quantity
            return updateRequestedQuantity({ productId: product.Id, requestedQuantity: updatedQuantity })
                .then(() => {
                    // Handle success response
                    console.log('Quantity updated successfully for product:', product.Id);
                    this.showToast('Success', 'Quantities updated successfully.', 'success');
                })
                .catch(error => {
                    // Handle error response
                    console.error('Error updating quantity for product:', product.Id, error);
                });
        });

        // Optionally, refresh the product items after updating all quantities
        Promise.all(promises)
            .then(() => {
                this.refreshTable = true; // Set flag to refresh table
            })
            .catch(error => {
                console.error('Error updating quantities:', error);
            });
    }

    showToast(title, message, variant) {
        const toastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(toastEvent);
    }

    get showToastButtonDisabled() {
        // Disable the show toast button if the table is not refreshed
        return !this.refreshTable;
    }

    handleRefreshTable() {
        // Refresh the table by resetting the flag
        this.refreshTable = false;
        // Refresh the table data
        return refreshApex(this.productItems);
    }
}
