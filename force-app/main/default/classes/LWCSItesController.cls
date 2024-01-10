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

}