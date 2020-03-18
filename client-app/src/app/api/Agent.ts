import axios, { AxiosResponse } from 'axios';
import { IActivity } from "../models/activity";
import { resolve } from 'dns';
axios.defaults.baseURL='http://localhost:5000/api';

const responseBody= (response: AxiosResponse) =>response.data;

const sleep=(ms:number)=>(response:AxiosResponse)=>
new Promise<AxiosResponse> (resolve=>setTimeout(() => resolve(response),ms));

const request={
    get: (url:string)=> axios.get(url).then(sleep(1)).then(responseBody),
    post: (url:string, body:{})=> axios.post(url,body).then(sleep(1)).then(responseBody),
    put: (url:string, body:{})=> axios.put(url, body).then(sleep(1)).then(responseBody),
    delete: (url:string)=> axios.delete(url).then(sleep(1)).then(responseBody)
};

const Activities ={
    list:() :Promise<IActivity[]> => request.get('/activities'), 
    details:(id:string)=> request.get('/activities/'.concat(id)),
    create:(activity:IActivity) =>request.post('/activities',activity), 
    update:(activity:IActivity) =>request.put('/activities/'.concat(activity.id),activity),
    delete:(id:string)=> request.delete('/activities/'.concat(id))
};
export default {
    Activities
};