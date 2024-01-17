import { LightningElement } from 'lwc';

export default class CustomSettingTabComponent extends LightningElement {

    fileName;
    disabled = true;

    get acceptedFormats() {
        return ['.jpeg', '.png','.jpg'];
    }
    handleUploadFinished(event)
    {
        const uploadedFiles = event.detail.files[0];
        if(uploadedFiles)
        {
        this.disabled = false;
        this.fileName = uploadedFiles.name;
        console.log('uploadedFiles=>',uploadedFiles);
        }
    }

    handleSave()
    {
        
    }

}