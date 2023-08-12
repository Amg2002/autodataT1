import axios from 'axios';
import { apiHost } from '../config';

const getOptions = () => {
    let user = JSON.parse(localStorage.getItem('current_account'));
    let token = user['token'];
    let options = {
        headers:{
            Authorization: 'Token '+token,
        }
    }
    return options;
}

export const signIn = async (username, password) => {
    const apiEndpoint = apiHost + '/auth/';
    const payload = {
        operation: 'login',
        username: username,
        password: password,
    };

    let response = await axios.post(apiEndpoint,  payload);
    response = response.data;
    let accessToken = response['token'];
    axios.defaults.headers.common['Authorization'] = `Token ${accessToken}`;
    return response;
}

export const resetPassword = async (password) => {
    const apiEndpoint = `http://197.210.166.58:8080/resetpassword/`,
    options = getOptions(),
    payload = {
        password: password,
    };

    let response = await axios.post(apiEndpoint, payload, options );
    response = response.data;

    return response;

}

export const adminPasswordReset = async (username, password) => {
    const apiEndpoint = `http://197.210.166.58:8080/adminreset/`,
    options = getOptions(),
    payload = {
        username: username,
        password: password,
    };

    let response = await axios.post(apiEndpoint, payload, options );
    response = response.data;
    return response;
}

//Accounts
export const getCurrentAccountDetails = async () => {
    let currentAccount = JSON.parse(localStorage.getItem('current_account'));
    let id = currentAccount['id'];

    const apiEndpoint = apiHost + `/accounts/${id}/`;
    const options = getOptions();
    const response = await axios.get(apiEndpoint, options);
    return response.data;
}

export const getUsers = async () => {
    const apiEndpoint = apiHost + '/accounts/',
    options = getOptions();
    let response = await axios.get(apiEndpoint, options);
    return response.data;
}

export const deleteAccount = async (id) => {
    let apiEndpoint = apiHost + `/accounts/${id}/`;
    let response = await axios.delete(apiEndpoint, getOptions());
    return response.data;
}

export const createAccount = async (payload) => {
    const apiEndpoint = apiHost+'/accounts/';
    const options = getOptions();
    let response = await axios.post(apiEndpoint, payload, options);
    return response.data;
}

export const editAccount = async(id, payload) => {
    const apiEndpoint = apiHost+`/accounts/${id}/`;
    const options = getOptions();
    let response = await axios.put(apiEndpoint, payload, options);
    return response.data;
}

export const getGroups = async () => {
    const apiEndpoint = apiHost + '/groups/',
    options = getOptions();
    let response = await axios.get(apiEndpoint, options);
    return response.data;
}

//Departments
export const getDepartments = async () => {
    const apiEndpoint = apiHost + '/departments/',
    options = getOptions();
    let response = await axios.get(apiEndpoint, options);
    return response.data;
}

export const createDepartment = async (payload) => {
    const apiEndpoint = apiHost + `/departments/`,
    options = getOptions();

    let response = await axios.post(apiEndpoint, payload, options);
    return response.data;
}

export const editDepartment = async (id, payload) => {
    const apiEndpoint = apiHost + `/departments/${id}/`,
    options = getOptions();

    let response = await axios.patch(apiEndpoint, payload, options);
    return response.data;
}

export const deleteDepartment = async (id) => {
    const apiEndpoint = apiHost + '/departments/' + id + '/', 
    options = getOptions();
    let response = await axios.delete(apiEndpoint, options);
    return response.data;
}

//Cases
export const getAllCases = async ( accountId=null ) => {
    let apiEndpoint = apiHost + '/cases/',
    options = getOptions();

    if(accountId) apiEndpoint += '?accounts='+accountId;

    let response = await axios.get(apiEndpoint, options);
    response = response.data;
    return response;
}

export const addCase = async (payload) => {
    const apiEndpoint = apiHost + `/cases/`,
    options = getOptions();

    let response = await axios.post(apiEndpoint, payload, options);
    return response.data;
}

export const editCase = async (id, payload) => {
    const apiEndpoint = apiHost + `/cases/${id}/`,
    options = getOptions();

    let response = await axios.put(apiEndpoint, payload, options);
    return response.data;
}

export const deleteCase = async (id) => {
    const apiEndpoint = apiHost + `/cases/${id}/`,
    options = getOptions();

    let response = axios.delete(apiEndpoint, options);
    return response.data;
}

export const getJobs = async (caseId) => {
    const apiEndpoint = apiHost + '/jobs/?case='+caseId,
    options = getOptions();
    let response = await axios.get(apiEndpoint, options);
    response = response.data;
    return response;
}

export const addJob = async (payload) => {
    const apiEndpoint = apiHost + `/jobs/`,
    options = getOptions();
    
    let response = await axios.post(apiEndpoint, payload, options);
    response = response.data;
    return response;
}

export const editJob = async (id, payload) => {
    let apiEndpoint = apiHost + `/jobs/${id}/`,
    options = getOptions();

    let response = await axios.put(apiEndpoint, payload, options);
    response = response.data;
    return response;
}

export const deleteJob = async (id) => {
    const apiEndpoint = apiHost + `/jobs/${id}/`,
    options = getOptions();
    let response = await axios.delete(apiEndpoint, options);
    response = response.data;
    return response;
}

export const getZones = async () => {
    const apiEndpoint = apiHost + '/zones/',
    options = getOptions();
    let response = await axios.get(apiEndpoint, options);
    response = response.data;
    return response;
}

export const addZone = async (payload) => {
    let apiEndpoint = apiHost + '/zones/',
    options = getOptions();

    let response = await axios.post(apiEndpoint, payload, options);
    response = response.data;
    
    return response;
}

export const editZone = async (id, payload) => {
    let apiEndpoint = apiHost + `/zones/${id}/`,
    options = getOptions();

    let response = await axios.put(apiEndpoint, payload, options);
    response = response.data;
    return response;
}

export const deleteZone = async (id) => {
    const apiEndpoint = apiHost + `/zones/${id}/`,
    options = getOptions();

    let response = await axios.delete(apiEndpoint, options);
    response = response.data;
    return response;
}

export const getPois = async () => {
    const apiEndpoint = apiHost + '/poi/',
    options = getOptions();
    let response = await axios.get(apiEndpoint, options);
    response = response.data;
    return response;
}

export const addPoi = async (payload) => {
    let apiEndpoint = apiHost + `/poi/`,
    options = getOptions();
    let response = await axios.post(apiEndpoint, payload, options);
    response = response.data;
    return response;
}

export const editPoi = async (id, payload) => {
    let apiEndpoint = apiHost + `/poi/${id}/`,
    options = getOptions();
    let response = await axios.put(apiEndpoint, payload, options);
    response = response.data;
    return response;
}

export const deletePoi = async (id) => {
    let apiEndpoint = apiHost + '/poi/' +id + '/';
    let options = getOptions();
    let response = await axios.delete(apiEndpoint, options);
    response = response.data;
    return response;
    
}

//CheckOT / FenceOT
export const getCdrComparision = async (job1_id, job2_id) => {
    const apiEndpoint = apiHost + '/cdr_comparision/',
    options = getOptions(),
    payload = {
        "job1_id": job1_id,
	    "job2_id": job2_id
    };

    let response = await axios.post(apiEndpoint, payload, options);
    response = response.data;

    return response;
}

export const getClusterData = async (type, locationData) => {
    const apiEndpoint = apiHost + '/clusters/',
    options = getOptions(),
    payload = {
        "type": type,
        "locations": locationData
    };

    let response = await axios.post(apiEndpoint, payload, options);
    response = response.data;

    return response;
}

export const getCdrForLocation = async (id, page = null) => {
    let apiEndpoint = apiHost + '/cdr/?job=' + id,
    options = getOptions();

    if(page) apiEndpoint += `&page=${page}`;
    
    let response = await axios.get(apiEndpoint, options);
    response = response.data;
    return response;
}

export const getCdrForJob = async (id, page=null) => {
    let apiEndpoint = apiHost + '/cdr/?job=' + id,
    options = getOptions();

    if(page) apiEndpoint += `&page=${page}`;

    let response = await axios.get(apiEndpoint, options);
    response = response.data;
    return response;
}

export const getCdrColumns = async () => {
    const apiEndpoint = apiHost + '/cdr/columns/',
    options = getOptions();
    let response = await axios.get(apiEndpoint, options);
    response = response.data;
    return response;
}

export const getHandsetHistory = async (id) => {
    const apiEndpoint = apiHost + `/handset_history/?job=${id}`,
    options = getOptions();

    let response = await axios.get(apiEndpoint, options);
    response = response.data;

    return response;

}

export const getLinkTreeData = async (id) => {
    const apiEndpoint = apiHost + `/linktree/?job=${id}`,
    options = getOptions();

    let response = await axios.get(apiEndpoint, options);
    response = response.data;

    return response;
}

export const getLinkTreeExtentionData = async(msisdn, startTime, endTime) => {
    // let proxyTarget = 'https://cors-anywhere.herokuapp.com/',
    // actualTarget = "http://197.210.166.58:8010/ontrack-webservice/links_async?type=msisdn&number="+msisdn+
    // "&startTime="+startTime+
    // "&endTime="+endTime,
    // options = getOptions();
    //let apiEndpoint = actualTarget;
    //let response = await axios.get(apiEndpoint, options);
    
    let apiEndpoint = apiHost + '/linktreexpand/',
    options = getOptions(),
    payload={
        'type': "msisdn",
        'number': msisdn,
        'startTime': startTime,
        'endTime': endTime
    };
    
    let response = await axios.post(apiEndpoint, payload, options)
    response = response.data;
    return response;
}

export const getCellSites = async(operator, lat1, lat2, lon1, lon2) => {
    
    let apiEndpoint = 'http://197.210.166.58:8080/towers/',
    options = getOptions(),
    payload = {
        'lat1': lat1,
        'lat2': lat2,
        'lon1': lon1,
        'lon2': lon2,
    }
    let response = await axios.post(apiEndpoint, payload, options);
    response = response.data;
    return response;
}