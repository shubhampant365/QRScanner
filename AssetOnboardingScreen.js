import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import makeCallout from '@salesforce/apex/RecordCallerController.makeCallout';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';

export default class AssetOnboardingScreen extends LightningElement {
    @track itemCode;
    barcodeScanner;

    connectedCallback() {
        this.barcodeScanner = getBarcodeScanner();
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
        makeCallout({ itemCode: this.itemCode })
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
