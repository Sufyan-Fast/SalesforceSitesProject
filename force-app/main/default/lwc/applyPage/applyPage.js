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
    isCover = false;
    fileReq=false;
    NameReq = false;
    EmailReq = false;
    PhoneReq = false;
    isFileSize = false;
    isCoverFileSize = false;
    validEmail = false;
    isLoaded = false;
    isError = false;

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
        this.isError = false;
        if(this.Name)
        {
            this.isName = true;
            this.NameReq = false;
         
        }
    }
    getEmail(event)
    {
        this.Email = event.target.value;
        this.isError = false;
        if( this.Email)
        {
            this.isEmail = true;
            this.EmailReq = false;
            this.validEmail = false;
         
        }
    }
    getPhone(event)
    {
        this.Phone = event.target.value;
        this.isError = false;
        if(this.Phone)
        {
            this.isPhone = true;
            this.PhoneReq = false;
          
        }
    }
    getAddress(event)
    {
        this.Address = event.target.value;
        this.isError = false;
    }
    getReferBy(event)
    {
        this.ReferBy = event.target.value;
        this.isError = false;
    }

    validateEmail(email) {
        let re = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        return re.test(email);
      }

    handleFileChange(event) {
        const file = event.target.files[0];
        this.isError = false;
        const fileSize = file.size;
        const fileMb = fileSize / 1024 ** 2;  //convert bytes into megabytes MB
        console.log('fileMb=>',fileMb);
        if(fileMb <= 2) // 2mb is the max file size;
        {
        this.isFileSize = false;
        this.isfile = true;
        this.fileReq = false;
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
    else
        {
            this.fileReq = false;
            this.isFileSize = true;
            console.log('File size limit exceeds');
        }
    }

    handleCoverFileChange(event) {
        const file = event.target.files[0];
        this.isError = false;
        const fileSize = file.size;
        const fileMb = fileSize / 1024 ** 2;  //convert bytes into megabytes MB
        console.log('fileMb=>',fileMb);
        if(fileMb <= 2) // 2mb is the max file size;
        {
        this.isCover = true;
        this.isCoverFileSize = false;
        console.log('file=>',file);
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileCoverContents = {
                'filenameCover': file.name,
                'base64Cover': base64,
                'recordId1': this.jobId
            }
            console.log('this.fileCoverContents=>' ,this.fileCoverContents);
        }
        reader.readAsDataURL(file);
    }
    else
    {
        this.isCoverFileSize = true;
        console.log('File size limit exceeds');
    }
    }


 


    handleSubmit()
    {
    console.log('In submit');
    this.fileReq= this.isfile? false:true;
    this.NameReq = this.isName?false:true;
    this.EmailReq = this.isEmail?false:true;
    this.PhoneReq = this.isPhone?false:true;

    if(this.isEmail)
    {
        //this.validEmail = this.validateEmail(this.Email)?false:true;
        if(this.validateEmail(this.Email))
        {
            this.validEmail = false;
        }
        else
        {
            this.validEmail = true;
            this.isEmail = false;
            this.EmailReq = false;
        }
    }

        // const {base64Cover, filenameCover, recordId1} = this.fileCoverContents;
        if(this.isName && this.isEmail && this.isPhone && this.isfile)
        {
        console.log('In handle submit if');
        const {base64, filename, recordId} = this.fileContents;
        if(this.isCover)
        {
            var {base64Cover, filenameCover, recordId1} = this.fileCoverContents;
        }
        this.isLoaded = true;
        Save_Job({applicantName: this.Name, jobId : this.jobId,Email: this.Email, phone: this.Phone ,Address: this.Address, 
            referredby: this.ReferBy,
             fileContents: base64, fileName: filename
            ,fileCoverContents : base64Cover,
            filenameCover : filenameCover
               })
        .then( result =>{
            console.log('Succesfully Added');
            this.isLoaded = false;
            window.open("https://hawklogixpakistan3-dev-ed.develop.my.site.com/jobs/thankyou","_self")
        })
        .catch ( error => {
            console.log(error);
            this.isLoaded = false;
            this.isError = true;
        });
 
    }
}
}