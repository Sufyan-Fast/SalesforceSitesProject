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


}