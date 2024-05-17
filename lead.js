import { LightningElement, track } from 'lwc';
import createLead from '@salesforce/apex/LeadController.createLead';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class HelloWorld extends LightningElement {
    @track selectedProductId;
    @track productName;
    @track finalSalePrice;
    @track preferredTime;
    @track billToLocation;
    @track shipToLocation;
    @track externalMaterialPurchase;
    @track invoiceNumber;
    @track invoiceDate;
    @track existingSecurityStrength;
    @track proposedSecurityStrength;
    @track entryPoint;
    @track competitionReplaced;

    @track preferredTimeOptions = [
        { label: 'Morning', value: 'Morning' },
        { label: 'Afternoon', value: 'Afternoon' },
        { label: 'Evening', value: 'Evening' }
    ];
    @track billToLocationOptions = [
        { label: 'Customer', value: 'Customer' },
        { label: 'ASP', value: 'ASP' }
    ];
    @track shipToLocationOptions = [...this.billToLocationOptions];
    @track existingSecurityStrengthOptions = [
        { label: 'Level 1', value: 'Level 1' },
        { label: 'Level 2', value: 'Level 2' },
        { label: 'Level 3', value: 'Level 3' },
        { label: 'Level 4', value: 'Level 4' },
        { label: 'Level 5', value: 'Level 5' }
    ];
    @track proposedSecurityStrengthOptions = [...this.existingSecurityStrengthOptions];
    @track entryPointOptions = [
        { label: 'Main Door', value: 'Main Door' },
        { label: 'Inner Door', value: 'Inner Door' }
    ];
    @track competitionReplacedOptions = [
        { label: 'Europa', value: 'Europa' },
        { label: 'Yale', value: 'Yale' },
        { label: 'Dorset', value: 'Dorset' },
        { label: 'Link', value: 'Link' },
        { label: 'Qubo', value: 'Qubo' },
        { label: 'Quba', value: 'Quba' },
        { label: 'Lavna', value: 'Lavna' },
        { label: 'Others', value: 'Others' }
    ];

    handleProductSelect(event) {
        this.selectedProductId = event.detail.recordId;
    }

    handleChange(event) {
        const field = event.target.name;
        this[field] = event.target.value;
    }

    createLead() {
        const leadData = {
            productName: this.productName,
            finalSalePrice: this.finalSalePrice,
            preferredTime: this.preferredTime,
            billToLocation: this.billToLocation,
            shipToLocation: this.shipToLocation,
            externalMaterialPurchase: this.externalMaterialPurchase,
            invoiceNumber: this.invoiceNumber,
            invoiceDate: this.invoiceDate,
            existingSecurityStrength: this.existingSecurityStrength,
            proposedSecurityStrength: this.proposedSecurityStrength,
            entryPoint: this.entryPoint,
            competitionReplaced: this.competitionReplaced
        };

        createLead({ leadData: leadData })
            .then(leadId => {
                this.showToast('Success', 'Lead created successfully', 'success');
                console.log('Lead created with Id: ' + leadId);
                // Optionally, perform any
