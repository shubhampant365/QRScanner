import { LightningElement, track } from 'lwc';

export default class AssetForm extends LightningElement {
    @track brandName;
    @track assetType;
    @track assetName;
    @track capacity;
    @track ageOfProduct;
    @track manufacturingDate;
    @track files = [];

    handleBrandNameChange(event) {
        this.brandName = event.target.value;
    }

    handleAssetTypeChange(event) {
        this.assetType = event.target.value;
    }

    handleAssetNameChange(event) {
        this.assetName = event.target.value;
    }

    handleCapacityChange(event) {
        this.capacity = event.target.value;
    }

    handleAgeOfProductChange(event) {
        this.ageOfProduct = event.target.value;
    }

    handleManufacturingDateChange(event) {
        this.manufacturingDate = event.target.value;
    }

    handleFileChange(event) {
        this.files = event.target.files;
        // Handle file upload logic here
    }
}
