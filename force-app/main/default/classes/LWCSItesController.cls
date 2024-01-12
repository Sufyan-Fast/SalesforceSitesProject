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
        String fileName
    ){
        Job_Application__c jobApp = new Job_Application__c();
        jobApp.Name = applicantName;
        jobApp.Job__c = jobId;
        jobApp.Email__c = Email;
        jobApp.Preferred_Phone__c = phone;
        jobApp.Address__c = Addresses;
        jobApp.Referred_By__c = referredby; 
        insert jobApp;

        ContentVersion cv1 = new ContentVersion();
        cv1.VersionData = EncodingUtil.base64Decode(fileContents);
        cv1.Title = fileName;
        cv1.PathOnClient = fileName;
        insert cv1;
        System.debug('cv1=>' + cv1);

        // ContentVersion cv2 = new ContentVersion();
        // cv2.VersionData = EncodingUtil.base64Decode(fileCoverContents);
        // cv2.Title = filenameCover;
        // cv2.PathOnClient = filenameCover;
        // insert cv2;
        // System.debug('cv1=>' + cv2);
        

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

            // ContentDocumentLink cdl1 = new ContentDocumentLink();
            // cdl.ContentDocumentId = [
            //   SELECT ContentDocumentId 
            //   FROM ContentVersion 
            //   WHERE Id =: cv2.Id
            // ].ContentDocumentId;
            // cdl1.LinkedEntityId = jobApp.Id;
            // cdl1.ShareType = 'V';
            //   insert cdl1;
            //   System.debug('cdl=>' + cdl1);
        
        // Attachment newAttachment = new Attachment();
        // newAttachment.Name = fileName;
        // newAttachment.Body = EncodingUtil.base64Decode(fileContents);
        // newAttachment.ParentId = jobApp.Id; // Set the ParentId to associate the Attachment with a record

        // // Insert the Attachment record
        // insert newAttachment;

        // ContentVersion newContentVersion = new ContentVersion();
        // newContentVersion.Title = fileName;
        // newContentVersion.VersionData = EncodingUtil.base64Decode(fileContents);
        // newContentVersion.PathOnClient = fileName;
        // // Insert the ContentVersion record
        // insert newContentVersion;
        // // if (String.isNotBlank(resumeDocumentId)) {
        //     // Attach the uploaded file to the newly created record
        //     ContentDocumentLink contentLink = new ContentDocumentLink();
        //     contentLink.LinkedEntityId = jobApp.Id;
        //     contentLink.ContentDocumentId = resumeDocumentId;
        //     contentLink.ShareType = 'V';
        //     contentLink.Visibility = 'AllUsers';
        //     insert contentLink;
        // // }
        // // if (String.isNotBlank(resumeDocumentId)) {
        //     // Attach the uploaded file to the newly created record
        //     ContentDocumentLink CoverLink = new ContentDocumentLink();
        //     CoverLink.LinkedEntityId = jobApp.Id;
        //     CoverLink.ContentDocumentId = coverDocumentId;
        //     CoverLink.ShareType = 'V';
        //     CoverLink.Visibility = 'AllUsers'; 
        //     insert CoverLink;
        // }
    }


}