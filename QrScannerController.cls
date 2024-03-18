public with sharing class QrScannerController {
    @AuraEnabled
    public static String makeMockApiCall(String scannedValue) {
        String mockApiEndpoint = 'https://tedt23.free.beeceptor.com';
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint(mockApiEndpoint);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setBody('{"barcode":"' + scannedValue + '"}');
        
        Http http = new Http();
        HttpResponse res = http.send(req);
        
        if (res.getStatusCode() == 200) {
            return res.getBody();
        } else {
            throw new AuraHandledException('Failed to make mock API call: ' + res.getStatus() + ' ' + res.getBody());
        }
    }
}
