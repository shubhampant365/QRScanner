// LeadController.cls
public with sharing class LeadController {
    
    @AuraEnabled
    public static String createLead(String selectedProductId, String productName, Decimal quantity, Decimal discount, Decimal finalSalePrice, String preferredTime,
                                    String billToLocation, String shipToLocation, Boolean externalMaterialPurchase, String invoiceNumber, Date invoiceDate,
                                    String existingSecurityStrength, String proposedSecurityStrength, String entryPoint, String competitionReplaced) {
        try {
            Id recordTypeId = getLeadRecordTypeId('Lead_From_FSL');
            
            Lead newLead = new Lead();
            newLead.Product__c = selectedProductId;
            newLead.Name = productName;
            newLead.Quantity__c = quantity;
            newLead.Discount__c = discount;
            newLead.Final_Sale_Price__c = finalSalePrice;
            newLead.Preferred_Time_to_Call__c = preferredTime;
            newLead.Bill_to_Location__c = billToLocation;
            newLead.Ship_to_Location__c = shipToLocation;
            newLead.External_Material_Purchase__c = externalMaterialPurchase;
            newLead.Invoice_Number__c = invoiceNumber;
            newLead.Invoice_Date__c = invoiceDate;
            newLead.Existing_Security_Strength__c = existingSecurityStrength;
            newLead.Proposed_Security_Strength__c = proposedSecurityStrength;
            newLead.Entry_Point__c = entryPoint;
            newLead.Competition_Replaced__c = competitionReplaced;
            newLead.RecordTypeId = recordTypeId; // Assigning the record type Id
            
            insert newLead;
            
            return 'Lead created successfully.';
        } catch (Exception e) {
            return 'Error creating lead: ' + e.getMessage();
        }
    }
    
    // Method to retrieve the Record Type Id for the given Developer Name
    private static Id getLeadRecordTypeId(String developerName) {
        Map<String, Schema.RecordTypeInfo> rtMap = Lead.sObjectType.getDescribe().getRecordTypeInfosByDeveloperName();
        Id recordTypeId = rtMap.get(developerName).getRecordTypeId();
        return recordTypeId;
    }
}
