import { LightningElement,api,wire} from 'lwc';
import Get_JOB_DATA from '@salesforce/apex/LWCSItesController.getJobData';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import jquery from '@salesforce/resourceUrl/jquery';
import bootstrap from '@salesforce/resourceUrl/bootstrap';
import Get_Site_URL from '@salesforce/apex/LWCSItesController.getLWCSitesURL';
export default class JobDetailComponent extends LightningElement {
   // recordId;
    JobData;
    error;
    siteURL;
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

    renderedCallback() {
        Promise.all([
            loadStyle(this, bootstrap + '/bootstrap/css/bootstrap.css'),
            // loadStyle(this, bootstrap + '/bootstrap/css/bootstrap.min.css'),
            loadScript(this, bootstrap + '/bootstrap/js/bootstrap.js'),
            loadScript(this, jquery)     
        ])
            .then(() => {
                console.log('Bootstrap Loaded');
            })
            .catch(error => {
                console.log('Bootstrap Not Loaded');
            });
    }

    // @wire(Get_Site_URL) 
    // wiredJobs ({ error, data }) {
    //     if (data) {
    //         console.log('data=>' , data);         
    //         this.siteURL = data;
    //         this.error = undefined;
    //    } else if (error) { 
    //        this.error = error; 
    //        this.siteURL = undefined;
    //   }   }

    async connectedCallback() {
        let params = {};
        params = await this.getQueryParameters();
        console.log('params=>' ,JSON.stringify(params));
        const obj = Object.assign({}, params);
        console.log('obj=>', obj);
        let recordId = obj.id;
        // this.JobData = (recordId ===null ||  recordId === '')? this.dumyData : '';
        console.log('Id=>' ,recordId);
        await this.getSiteURL();
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

    async getSiteURL()
    {
        await Get_Site_URL()
        .then(result=>{
            console.log('urlresult=>' ,  result);
            this.siteURL = result;
            this.error = undefined;
        })
        .catch(error => {
            this.error = error;
            this.siteURL = undefined;
        });
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
            console.log('this.JobData' , this.JobData);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            let site = this.siteURL;
            let jobData = {
                ...this.JobData,
                formattedPostedDate : new Date(result.Date_Posted__c).toLocaleDateString('en-US', options),
                formattedTargetDate : new Date(result.Target_Hire_Date__c).toLocaleDateString('en-US', options),
                applyURL : site + 'apply?id=' + result.Id
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