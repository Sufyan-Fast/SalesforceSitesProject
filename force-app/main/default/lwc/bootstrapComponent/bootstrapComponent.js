import { LightningElement } from 'lwc';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import jquery from '@salesforce/resourceUrl/jquery';
import bootstrap from '@salesforce/resourceUrl/bootstrap';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import popper from '@salesforce/resourceUrl/popper';

export default class BootstrapComponent extends LightningElement {

    renderedCallback() {
        Promise.all([
            loadStyle(this, bootstrap + '/bootstrap/css/bootstrap.css'),
            loadScript(this, bootstrap + '/bootstrap/js/bootstrap.js'),
            loadScript(this, jquery)     
        ])
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Third-Party Libraries Loaded',
                        variant: 'success',
                    }),
                );
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error Loading Third-Party Libraries',
                        message: error.message,
                        variant: 'error',
                    }),
                );
            });
    }
}