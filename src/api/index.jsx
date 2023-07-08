import axios from "axios";
const API = 'http://103.175.219.241/crud/public';
export const JsonList = async ({ url, param, token, page = 0 }) => {
    try {
        let pages;
        pages = '';
        if(page){
            pages = `?page=${page}`
        }
        const options = {
            url: `${API}${url}${pages}`,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify(param)
        };
        const res = await axios(options).then(res => res.data);
        return res;
    } catch(error){
        return error.response.data;
    }
}

export const JsonSearch = async ({ url, token }) => {
    try {
        let options = {
            headers : {
                "Content-Type" : "application/json",
                "Accept" : "application/json",
                "Authorization" : `Bearer ${token}`
            },
            method : 'GET',
            url : `${API}${url}`
        }
        const res = await axios(options).then(response => response.data);
        return res;
    } catch (error) {
        return error.response.data;
    }
}

export const JsonLogin = async ({ url, param }) => {
    try {
        let options = {
            headers : {
                "Content-Type" : "application/json",
                "Accept" : "application/json",
            },
            method : 'POST',
            url : `${API}${url}`,
            data : JSON.stringify(param)
        }
        const res = await axios(options).then(response => response.data);
        return res;
    } catch (error) {
        return error.response.data;
    }
}

export const JsonDelete = async ({ url, param, token }) => {
    try {
        let options = {
            headers : {
                "Content-Type" : "application/json",
                "Accept" : "application/json",
                "Authorization" : `Bearer ${token}`
            },
            method : 'POST',
            url : `${API}${url}`,
            data : JSON.stringify(param)
        }
        const res = await axios(options).then(response => response.data);
        return res;
    } catch (error) {
        return error.response.data;
    }
}

export const FormDataCreateUpdate = async ({ url, formData, token }) => {
    try {
        const res = await axios({
            headers : {
                "Content-Type" : "multipart/form-data",
                "Authorization" : `Bearer ${token}`
            },
            method : 'POST',
            url : `${API}${url}`,
            data : formData
        });
        return res.data;
    } catch (error) {
        return error.response.data
    }
}