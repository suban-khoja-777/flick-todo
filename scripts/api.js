const API_TOKEN = 'xuxd4BbvBd4CKzsJK0GaLIkyMtHb0B1PmQTz3IQBKAFAw1mBWGRT49SbXPNSICdEhvQsaiwEUEuUA0SGrELI2CMITu0oCcVzustCuItFPFW_pPt1TG5iKR-8QxuAlIMb';

let PERSONAL_FILE_ID = '';
let WORK_FILE_ID = '';

const ENDPOINTS = {

    getAllTask : "https://dynalist.io/api/v1/doc/read",
    updateTask : "https://dynalist.io/api/v1/doc/edit",
    getAllLists : "https://dynalist.io/api/v1/file/list"
}

const GET_ALL_TASK_REQUEST = (file_id) => {
    return{
        token : API_TOKEN,
        file_id : file_id
    }
}

const CREATE_USER_FOLDER = (title) => {
    return {
        token: API_TOKEN,
        "changes": [
            {
                "action": "create",
                "type": "folder",
                "parent_id": "_voNX6BtpV5IQj3OIwnFxHQ3",
                "index":0,
                title
            }
        ]
    }
}

const CREATE_TASK_REQUEST = (content,file_id) => {
    return {
        token : API_TOKEN,
        file_id : file_id,
        changes: [
            {
                action: "insert",
                parent_id: "root",
                index: -1,
                content,
                checked: false
            }
        ]
    }
}



const UPDATE_TASK_STATUS_REQUEST = (checked,node_id,file_id) => {
    return {
        token : API_TOKEN,
        file_id,
        changes: [
            {
                action: "edit",
                node_id,
                checked
            }
        ]
    }
}

const UPDATE_TASK_LABEL_REQUEST = (content,node_id,file_id) => {
    return {
        token : API_TOKEN,
        file_id,
        changes: [
            {
                action: "edit",
                node_id,
                content
            }
        ]
    }
}

const DELETE_TASK_REQUEST = (node_id,file_id) => {
    return {
        token : API_TOKEN,
        file_id,
        changes: [{
            action: "delete",
            node_id,
        }
        ]
    }
}

const API_CALL = (endpoint,request) => {
    return fetch(
        endpoint,{
            body : JSON.stringify(request),
            method : 'POST'
        }
    ).then(res => res.json()).catch(err => err);
}
