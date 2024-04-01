// assetOnboardingScreen.js
import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import makeCalloutAppliances from '@salesforce/apex/RecordCallerController.makeCalloutAppliances';
import makeCalloutLocks from '@salesforce/apex/QrScanner.makeMockApiCall';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';

export default class AssetOnboardingScreen extends LightningElement {
    @track selectedOption = 'Appliances';
    @track itemCode;
    barcodeScanner;

    get radioOptions() {
        return [
            { label: 'Appliances', value: 'Appliances' },
            { label: 'Locks', value: 'Locks' },
        ];
    }

    connectedCallback() {
        this.barcodeScanner = getBarcodeScanner();
    }

    handleOptionChange(event) {
        this.selectedOption = event.detail.value;
    }

    handleInputChange(event) {
        this.itemCode = event.target.value;
    }

    handleScan() {
        if (this.barcodeScanner.isAvailable()) {
            let scanningOptions = {
                "barcodeTypes": ["code128","code39", "code93", "ean13", "ean8", "upca", "upce", "qr", "datamatrix", "itf", "pdf417"], 
                "instructionText":"Position barcode in the scanner view.\nPress x to stop.",
                "successText":"Successful Scan!"
            };
            this.barcodeScanner.scan(scanningOptions)
                .then((results) => {
                    // Do something with the results of the scan
                    this.itemCode = results[0].value;
                })
                .catch((error) => {
                    // Handle cancellation and scanning errors here
                    this.showToast('Error', error.body.message, 'error');
                })
                .finally(() => {
                    this.barcodeScanner.dismiss();
                });
        } else {
            // Scanner not available
            // Not running on hardware with a scanner
            // Handle with message, error, beep, and so on
            this.showToast('Error', 'Barcode scanner is not available', 'error');
        }
    }

    handleCallout() {
        if (this.selectedOption === 'Appliances') {
            this.makeCalloutAppliances();
        } else if (this.selectedOption === 'Locks') {
            this.makeCalloutLocks();
        }
    }

    makeCalloutAppliances() {
        makeCalloutAppliances({ itemCode: this.itemCode })
            .then(result => {
                this.showToast('Success', result, 'success');
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    makeCalloutLocks() {
        makeCalloutLocks({ itemCode: this.itemCode })
            .then(result => {
                this.showToast('Success', result, 'success');
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
}
