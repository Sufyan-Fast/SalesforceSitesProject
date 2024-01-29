import { LightningElement ,wire} from 'lwc';
import IMAGES from '@salesforce/resourceUrl/NewPic';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import jquery from '@salesforce/resourceUrl/jquery';
import bootstrap from '@salesforce/resourceUrl/bootstrap';
import fontawesome from '@salesforce/resourceUrl/fontawesome';
import Get_All_Jobs from '@salesforce/apex/LWCSItesController.getAllJobs';
import Get_View_All_Jobs from '@salesforce/apex/LWCSItesController.getViewAllJobs';
import Get_Search_Jobs from '@salesforce/apex/LWCSItesController.searchJobs';
import Get_Site_URL from '@salesforce/apex/LWCSItesController.getLWCSitesURL';

export default class JobListComponent extends LightningElement {

    allJobs;
    error;
    teamsImage = IMAGES + '/NewPic/homebanner.png';
    isLoaded = false;
    searchText;
    siteURL;

    renderedCallback() {
        Promise.all([
            loadStyle(this, bootstrap + '/bootstrap/css/bootstrap.css'),
            loadScript(this, bootstrap + '/bootstrap/js/bootstrap.js'),
            // loadStyle(this, fontawesome + '/fontawesome/fontawesome/css/fontawesome.min.css'),
            // loadScript(this, fontawesome + '/fontawesome/fontawesome/js/fontawesome.min.js'),
            loadScript(this, jquery)     
        ])
            .then(() => {
                console.log('Bootstrap Loaded');
            })
            .catch(error => {
                console.log('Bootstrap Not Loaded');
            });
    }

    @wire(Get_Site_URL) 
    wiredJobs ({ error, data }) {
        if (data) {
            console.log('data=>' , data);         
            this.siteURL = data;
            this.error = undefined;
            Get_All_Jobs()
            .then(result =>{
                console.log('result=>' , result);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            result = result.map(function(obj) {
                return { ...obj, 
                    formattedPostedDate : obj.Date_Posted__c? new Date(obj.Date_Posted__c).toLocaleDateString('en-US', options):'',
                    Url : data + 'jobdetail?id=' + obj.Id };
              });
              console.log('result=>' , result);
            this.allJobs = result;
            this.error = undefined;
            })
            .catch(error => {
                this.error = error;
                this.allJobs = undefined;
            })


       } else if (error) { 
           this.error = error; 
           this.siteURL = undefined;
      }   }
        
        
        
        
        
        


      getAllJobs()
      {
        console.log('In all jobs functions');
        this.isLoaded = true;
        let site = this.siteURL;
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        Get_View_All_Jobs()
		.then(result => {
            console.log('result=>',result );
            result = result.map(function(obj) {
                return { ...obj, 
                    formattedPostedDate : obj.Date_Posted__c? new Date(obj.Date_Posted__c).toLocaleDateString('en-US', options):'',
                    Url : site + 'jobdetail?id=' + obj.Id };
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
           let site = this.siteURL;
            this.isLoaded = true;
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            Get_Search_Jobs({ searchQuery: searchString })
		    .then(result => {
            console.log('Searchresult=>',result );
            result = result.map(function(obj) {
                return { ...obj, 
                    formattedPostedDate : obj.Date_Posted__c? new Date(obj.Date_Posted__c).toLocaleDateString('en-US', options):'',
                    Url : site + 'jobdetail?id=' + obj.Id };
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