import { LightningElement, wire } from 'lwc';
import getProductItems from '@salesforce/apex/ProductController.getProductItems';
import updateRequestedQuantity from '@salesforce/apex/ProductController.updateRequestedQuantity';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ProductRequestComponent extends LightningElement {
    locationId = '1315g000000lQpvAAE';
    productItems;
    searchTerm = '';
    refreshTable = false; // Flag to trigger table refresh

    wiredProductItemsResult; // Hold the wired result for refreshApex

    @wire(getProductItems, { locationId: '$locationId' })
    wiredProductItems(result) {
        this.wiredProductItemsResult = result;
        const { error, data } = result;
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
                    this.showToast('Error', 'Failed to update quantities.', 'error');
                });
        });

        // Optionally, refresh the product items after updating all quantities
        Promise.all(promises)
            .then(() => {
                this.refreshTable = true; // Set flag to refresh table
                // Refresh the data from wire
                refreshApex(this.wiredProductItemsResult);
            })
            .catch(error => {
                console.error('Error updating quantities:', error);
            });
    }

    handleSearch(event) {
        this.searchTerm = event.target.value.toLowerCase();
    }

    get filteredProductItems() {
        return this.productItems ? this.productItems.filter(
            item => item.Product2.Name.toLowerCase().includes(this.searchTerm) || item.Product2.ProductCode.toLowerCase().includes(this.searchTerm)
        ) : [];
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
}



.search-wrapper {
    margin-bottom: 1rem;
}

.search-wrapper lightning-input {
    width: 100%;
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid #d8dde6;
}

/* Optional: Add styles for focus state */
.search-wrapper lightning-input:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 3px rgba(74, 144, 226, 0.5);
}
