import axios from 'axios'

const API_BASE_URL = 'https://expert-acorn-5pjjw9wwprg3vpgr-3000.app.github.dev';

export async function uploadInternalCSV(file){
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/upload/internal`, formData);
    return response.data;
}

export async function uploadBankCSV(file){
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/upload/bank`, formData);
    return response.data;
}

export async function runReconciliation(){
    const response = await axios.post(`${API_BASE_URL}/reconcile/run`);
    return response.data;
}