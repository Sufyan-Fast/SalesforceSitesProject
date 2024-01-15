import { LightningElement,api,wire} from 'lwc';
import Get_JOB_DATA from '@salesforce/apex/LWCSItesController.getJobData';
export default class JobDetailComponent extends LightningElement {
   // recordId;
    JobData;
    error;
    // dumyData = {
    //     Name : 'Dummy job',
    //     formattedPostedDate : 'January 27, 2024',
    //     applyURL : '#',
    //     Job_Description__c : 'Dummy Data',
    //     Job_Requirements__c : 'Dummy Data',
    //     Qualifications__c : 'Dummy Data',
    //     Job_Responsibilities__c : 'Dummy Data',
    //     Required_Skills__c : 'Dummy Data',
    //     Job_Number__c : 'job-0000',
    //     Experience_Required__c : 'test',
    //     formattedTargetDate : 'January 27, 2024'

    // };

    async connectedCallback() {
        let params = {};
        params = await this.getQueryParameters();
        console.log('params=>' ,JSON.stringify(params));
        const obj = Object.assign({}, params);
        console.log('obj=>', obj);
        let recordId = obj.id;
        // this.JobData = (recordId ===null ||  recordId === '')? this.dumyData : '';
        console.log('Id=>' ,recordId);
        await this.getJobData(recordId);
    }
    getQueryParameters() {
        let params = {};
        let search = location.search.substring(1);
        if (search) {
            params = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', (key, value) => {
                return key === "" ? value : decodeURIComponent(value)
            });
        }
        return params;
    }

    async getJobData(recordId)
    {
        console.log('getjobdatarecordId=>',recordId );
        try {
            const result = await Get_JOB_DATA({
                recordId: recordId,
            });
            console.log('result' , result);
            this.JobData = result;
            //this.JobData[Date_Posted__c] = format(this.JobData[Date_Posted__c],'%B %d,%Y');
            console.log('this.JobData' , this.JobData);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            let jobData = {
                ...this.JobData,
                formattedPostedDate : new Date(result.Date_Posted__c).toLocaleDateString('en-US', options),
                formattedTargetDate : new Date(result.Target_Hire_Date__c).toLocaleDateString('en-US', options),
                applyURL : 'https://hawklogixpakistan3-dev-ed.develop.my.site.com/jobs/apply?id=' + result.Id
            };
            this.JobData = jobData;
            console.log('jobdata' , jobData);
            this.error = undefined;
          } catch (error) {
            this.error = error;
            this.JobData = undefined;
          }
    }





}