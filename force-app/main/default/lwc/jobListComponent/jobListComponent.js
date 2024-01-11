import { LightningElement ,wire} from 'lwc';
import IMAGES from '@salesforce/resourceUrl/NewPic';
import Get_All_Jobs from '@salesforce/apex/LWCSItesController.getAllJobs';
import Get_View_All_Jobs from '@salesforce/apex/LWCSItesController.getViewAllJobs';
import Get_Search_Jobs from '@salesforce/apex/LWCSItesController.searchJobs';

export default class JobListComponent extends LightningElement {

    allJobs;
    error;
    teamsImage = IMAGES + '/NewPic/microsoft.png';
    isLoaded = false;
    searchText;

    @wire(Get_All_Jobs) 
    wiredJobs ({ error, data }) {
        if (data) {
            console.log('data=>' , data);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            data = data.map(function(obj) {
                return { ...obj, 
                    formattedPostedDate : obj.Date_Posted__c? new Date(obj.Date_Posted__c).toLocaleDateString('en-US', options):'',
                    Url : 'https://hawklogixpakistan3-dev-ed.develop.my.site.com/jobs/jobdetail?id=' + obj.Id };
              });
              console.log('data=>' , data);
            this.allJobs = data;
            this.error = undefined;
       } else if (error) { 
           this.error = error; 
           this.allJobs = undefined;
      }   }

      getAllJobs()
      {
        console.log('In all jobs functions');
        this.isLoaded = true;
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        Get_View_All_Jobs()
		.then(result => {
            console.log('result=>',result );
            result = result.map(function(obj) {
                return { ...obj, 
                    formattedPostedDate : obj.Date_Posted__c? new Date(obj.Date_Posted__c).toLocaleDateString('en-US', options):'',
                    Url : 'https://hawklogixpakistan3-dev-ed.develop.my.site.com/jobs/jobdetail?id=' + obj.Id };
              });
            console.log('result=>',result );
            this.isLoaded = false;
			this.allJobs = result;
           
			this.error = undefined;
		})
		.catch(error => {
			this.error = error;
			this.allJobs = undefined;
		})
      }

      handleInput(Event)
      {
         this.searchText =    Event.target.value ;
         if(this.searchText===null || this.searchText ==='')
         {
            this.searchJobs();
         }
      }
 
      searchJobs()
      {
           let searchString = this.searchText;
            this.isLoaded = true;
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            Get_Search_Jobs({ searchQuery: searchString })
		    .then(result => {
            console.log('Searchresult=>',result );
            result = result.map(function(obj) {
                return { ...obj, 
                    formattedPostedDate : obj.Date_Posted__c? new Date(obj.Date_Posted__c).toLocaleDateString('en-US', options):'',
                    Url : 'https://hawklogixpakistan3-dev-ed.develop.my.site.com/jobs/jobdetail?id=' + obj.Id };
              });
            console.log('Searchresult=>',result );
            this.isLoaded = false;
			this.allJobs = result;           
			this.error = undefined;
		})
		.catch(error => {
			this.error = error;
			this.allJobs = undefined;
		})
      }

}