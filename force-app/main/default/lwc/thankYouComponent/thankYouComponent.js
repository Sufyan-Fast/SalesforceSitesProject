import { LightningElement } from 'lwc';
import IMAGES from '@salesforce/resourceUrl/NewPic';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import jquery from '@salesforce/resourceUrl/jquery';
import bootstrap from '@salesforce/resourceUrl/bootstrap';

export default class ThankYouComponent extends LightningElement {

    TickImage = IMAGES + '/NewPic/chekimg.png';

    renderedCallback() {
        Promise.all([
            loadStyle(this, bootstrap + '/bootstrap/css/bootstrap.css'),
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