import { LightningElement,wire } from 'lwc';
import fonts from '@salesforce/resourceUrl/fonts';
import IMAGES from '@salesforce/resourceUrl/images';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import jquery from '@salesforce/resourceUrl/jquery';
import bootstrap from '@salesforce/resourceUrl/bootstrap';
import Get_Site_URL from '@salesforce/apex/LWCSItesController.getLWCSitesURL';

export default class SalesforceSiteHeader extends LightningElement {


    hawklogixImage = IMAGES + '/images/logo.png';
    siteURL;
    error;

    @wire(Get_Site_URL) 
    wiredJobs ({ error, data }) {
        if (data) {
            console.log('data=>' , data);         
            this.siteURL = data;
            this.error = undefined;
       } else if (error) { 
           this.error = error; 
           this.siteURL = undefined;
      }   }

    renderedCallback() {
        Promise.all([
            loadStyle(this, bootstrap + '/bootstrap/css/bootstrap.min.css'),
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

   

}