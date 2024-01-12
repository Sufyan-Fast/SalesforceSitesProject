import { LightningElement } from 'lwc';
import Save_Job from '@salesforce/apex/LWCSItesController.saveJobApplication';

export default class ApplyPage extends LightningElement {

    backUrl;
    jobId;
    Name;
    Email;
    Phone;
    Address;
    ReferBy;
    acceptedFormats = ['.pdf', '.doc', '.docx'];
    resumeId;
    coverId;
    fileContents;
    fileName;
    fileCoverContents;
    coverFileName;
    isfile=false;
    isName = false;
    isEmail = false;
    isPhone = false;

    async connectedCallback() {
        let params = {};
        params = await this.getQueryParameters();
        console.log('params=>' ,JSON.stringify(params));
        const obj = Object.assign({}, params);
        console.log('obj=>', obj);
        let recordId = obj.id;
        this.jobId = recordId;
        this.backUrl = 'https://hawklogixpakistan3-dev-ed.develop.my.site.com/jobs/jobdetail?id=' + recordId;
        console.log('Id=>' ,recordId);
        // await this.getJobData(recordId);
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

    getName(event)
    {
        this.Name = event.target.value;
        if(this.Name)
        {
            this.isName = true;
        }
    }
    getEmail(event)
    {
        this.Email = event.target.value;
        if( this.Email)
        {
            this.isEmail = true;
        }
    }
    getPhone(event)
    {
        this.Phone = event.target.value;
        if(this.Phone)
        {
            this.isPhone = true;
        }
    }
    getAddress(event)
    {
        this.Address = event.target.value;
    }
    getReferBy(event)
    {
        this.ReferBy = event.target.value;
    }

    handleFileChange(event) {
        const file = event.target.files[0];
        this.isfile = true;
        console.log('file=>',file);
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileContents = {
                'filename': file.name,
                'base64': base64,
                'recordId': this.jobId
            }
            console.log('this.fileContents=>' ,this.fileContents);
        }
        reader.readAsDataURL(file);
    }

    handleCoverFileChange(event) {
        const file = event.target.files[0]
        console.log('file=>',file);
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileCoverContents = {
                'filename': file.name,
                'base64': base64,
                'recordId': this.jobId
            }
            console.log('this.fileCoverContents=>' ,this.fileCoverContents);
        }
        reader.readAsDataURL(file);
    }


    // handleUploadFinished(event) {
    //     // Get the uploaded file's ContentDocumentId
    //     console.log('handleUploadFinished');
    //     const uploadedFiles = event.detail.files;
    //     if (uploadedFiles.length > 0) {
    //         this.resumeId = uploadedFiles[0].documentId;
    //         console.log(this.resumeId);
    //     }
    // }
    // handleUploadCoverFinished(event) {
    //     // Get the uploaded file's ContentDocumentId
    //     const uploadedFile = event.detail.files;
    //     if (uploadedFile.length > 0) {
    //         this.coverId = uploadedFile[0].documentId;
    //     }
    // }

    handleSubmit()
    {
        console.log('In submit');
        
        // const {base64Cover, filenameCover, recordId1} = this.fileCoverContents;
        if(this.isName && this.isEmail && this.isPhone && this.isfile)
        {
        console.log('In handle submit if');
        const {base64, filename, recordId} = this.fileContents;
        Save_Job({applicantName: this.Name, jobId : this.jobId,Email: this.Email, phone: this.Phone ,Address: this.Address, 
            referredby: this.ReferBy,
             fileContents: base64, fileName: filename
            // ,fileCoverContents : base64Cover,
            // filenameCover : filenameCover
               })
        .then( result =>{
            console.log('Succesfully Added');
            window.open("https://hawklogixpakistan3-dev-ed.develop.my.site.com/jobs/thankyou","_self")
        })
        .catch ( error => {
            console.log(error);
        });
 
    }
}
}