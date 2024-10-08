
import {formDataRequest, getRequest, postRequest} from '../libs/AxiosService.util';

export async function serviceCreateProviderUser(params) {
    return await formDataRequest('profile/create', params);
}

export async function serviceUpdateProviderUser(params) {
    return await formDataRequest('profile/update', params);
}

export async function serviceDeleteProviderUser(params) {
    return await formDataRequest('provider/users/delete', params);
}
export async function serviceGetProviderUser(params) {
    return await postRequest('profile', params);
}

export async function serviceGetProviderUserDetail(params) {
    return await postRequest('profile/details', params);
}

export async function serviceProviderUserCheck(params) {
    return await postRequest('provider/users/check', params); //profile/user/lookup
}

export async function serviceProviderUserManager(params) {
    return await postRequest('profile/user/lookup', params); //user/assign/manager
}

export async function serviceProviderAssignManager(params) {
    return await postRequest('user/assign/manager', params); //profile/get/keyword
}
export async function serviceProviderIsExist(params) {
    return await postRequest('profile/isexist', params); 
}

export async function serviceProviderProfileGetKeyword(params) {
    return await postRequest('keywords', params); 
}
export async function serviceProfileDetail(params) {
    return await postRequest('profile/details', params); 
}

export async function serviceTaskManagementCreate(params) {
    return await postRequest('task/management/create', params); 
}

export async function serviceTaskManagementDetail(params) {
    return await postRequest('task/management/details', params); 
}

export async function serviceTaskManagementUpdate(params) {
    return await postRequest('task/management/update', params); // task/management/search/task
}

export async function serviceSearchTask(params) {
    return await postRequest('task/management/search/task', params); // task/management/search/task
}

export async function serviceSearchUser(params) {
    return await postRequest('task/management/search/user', params); // task/management/search/task
}

export async function serviceSearchAssignto(params) {
    return await postRequest('task/management/search/admin', params); // task/management/search/task
}

export async function serviceTaskMnagment(params) {
    return await postRequest('task/management', params); // task/management/by/user
}

export async function serviceTaskMnagmentByUser(params) {
    return await postRequest('task/management/by/user', params); // task/management/filter/task
}

export async function serviceTaskFilterByUser(params) {
    return await postRequest('task/management/filter/task', params); // task/management/filter/task
}
export async function serviceProfileManager(params) {
    return await postRequest('profile/manager', params); // task/management/filter/task
}