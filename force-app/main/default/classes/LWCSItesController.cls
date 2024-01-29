public without sharing class LWCSItesController {
    @AuraEnabled(cacheable=true)
    public static Job__c getJobData(Id recordId){
        try {
            return [Select Id, Name, Job_Number__c,Target_Hire_Date__c,Job_Description__c,Date_Posted__c,
            Job_Requirements__c, Qualifications__c,Job_Responsibilities__c, Required_Skills__c,
            Experience_Required__c from Job__c where Id =: recordId];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Job__c> getAllJobs(){
        try {
            return [Select Id, Name, Job_Number__c,Target_Hire_Date__c,Job_Description__c,Date_Posted__c,
            Job_Requirements__c, Qualifications__c,Job_Responsibilities__c, Required_Skills__c,
            Experience_Required__c from Job__c Order by CreatedDate DESC LIMIT 6];           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Job__c> getViewAllJobs(){
        try {
            return [Select Id, Name, Job_Number__c,Target_Hire_Date__c,Job_Description__c,Date_Posted__c,
            Job_Requirements__c, Qualifications__c,Job_Responsibilities__c, Required_Skills__c,
            Experience_Required__c from Job__c Order by CreatedDate DESC];           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Job__c> searchJobs(String searchQuery){
        try {
            String searchrecord = '%' + searchQuery + '%';
            return (!String.isBlank(searchQuery))?[Select Id, Name, Job_Number__c,Target_Hire_Date__c,Job_Description__c,Date_Posted__c,
            Job_Requirements__c, Qualifications__c,Job_Responsibilities__c, Required_Skills__c,
            Experience_Required__c from Job__c where Name like :searchrecord Order by CreatedDate DESC] :
            [Select Id, Name, Job_Number__c,Target_Hire_Date__c,Job_Description__c,Date_Posted__c,
            Job_Requirements__c, Qualifications__c,Job_Responsibilities__c, Required_Skills__c,
            Experience_Required__c from Job__c Order by CreatedDate DESC LIMIT 6];           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static void saveJobApplication(
        String applicantName,
        Id jobId,
        String Email, 
        String phone, 
        String Addresses,
        String referredby,
        String fileContents,
        String fileName,
        String fileCoverContents,
        String filenameCover
    ){
        Job_Application__c jobApp = new Job_Application__c();
        jobApp.Name = applicantName;
        jobApp.Job__c = jobId;
        jobApp.Email__c = Email;
        jobApp.Preferred_Phone__c = phone;
        jobApp.Address__c = Addresses;
        jobApp.Referred_By__c = referredby; 
        insert jobApp;

        if (String.isNotBlank(fileName) && String.isNotBlank(fileContents)) {
        ContentVersion cv1 = new ContentVersion();
        cv1.VersionData = EncodingUtil.base64Decode(fileContents);
        cv1.Title = fileName;
        cv1.PathOnClient = fileName;
        insert cv1;
        System.debug('cv1=>' + cv1);

        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = [
          SELECT ContentDocumentId 
          FROM ContentVersion 
          WHERE Id =: cv1.Id
        ].ContentDocumentId;
        cdl.LinkedEntityId = jobApp.Id;
        cdl.ShareType = 'V';
          insert cdl;
          System.debug('cdl=>' + cdl);

        }

        if (String.isNotBlank(filenameCover) && String.isNotBlank(fileCoverContents)) {
        ContentVersion cv2 = new ContentVersion();
        cv2.VersionData = EncodingUtil.base64Decode(fileCoverContents);
        cv2.Title = filenameCover;
        cv2.PathOnClient = filenameCover;
        insert cv2;
        System.debug('cv1=>' + cv2);

        ContentDocumentLink cdl1 = new ContentDocumentLink();
        cdl1.ContentDocumentId = [
          SELECT ContentDocumentId 
          FROM ContentVersion 
          WHERE Id =: cv2.Id
        ].ContentDocumentId;
        cdl1.LinkedEntityId = jobApp.Id;
        cdl1.ShareType = 'V';
          insert cdl1;
          System.debug('cdl=>' + cdl1);
        }
        
    }
    
    @AuraEnabled(cacheable=true)
    public static String getLWCSitesURL(){
         LWC_Site_URL__c url= LWC_Site_URL__c.getInstance();
        String lwcSiteUrl= url.LWC_URL__c;
        return lwcSiteUrl;
        
    }


}