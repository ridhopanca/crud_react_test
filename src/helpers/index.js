import { EncryptStorage } from "encrypt-storage";
import { toast } from "react-hot-toast";

const key = import.meta.env.VITE_KEY_STORAGE;

const handleErrorFromApi = ({
    response,
    alert
}) => {
    let message;
    message = '';
    if(!response?.response_desc){ // kondisi jika response status dari api 200 atau tidak mendapatkan response_desc dari api
        let status = response?.response_code?.toString();
        
        if(!status){ // kondisi jika tidak terdapat response_code dari api
            message = 'Oops! There is no response from server';
            if(alert){
                toast.error(message)
            }
            return true
        }

        let desc = response?.response_desc;
        if(parseInt(status.charAt(0)) !== 2){ // kondisi jika response_code dari api ternyata tidak 200 walaupun response status 200
            
            if(response?.response_data){ // konsisi terdapat response data
                return false;
            } 

            if(alert){
                toast.error(desc)
            }
            return true
        } 
    }

    message = response?.response_desc; // kondisi jika response dari api tidak 200
    if(message){
        let status = response?.response_code?.toString();
        if(response?.response_data){ // konsisi terdapat response data,
            return false;
        }

        if(parseInt(status.charAt(0)) !== 2){ // kondisi jika response_code dari api ternyata tidak 200 walaupun response status 200
            
            if(response?.response_data){ // konsisi terdapat response data
                return false;
            } 

            if(alert){
                toast.error(message)
            }
            return true
        }
    }
    
    return false
}

const globalStorage = new EncryptStorage(key, {
    storageType     : 'sessionStorage',
    encAlgorithm    : 'Rabbit'
})

const numberWithCommas = (number) => {
    return number?.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

export {
    handleErrorFromApi,
    globalStorage,
    numberWithCommas
}