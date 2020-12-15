// DOM Element Reference
const TASK_CONTAINER = document.querySelector('div.task-container > ul');
const NEW_TASK_INPUT = document.querySelector('input.new-task-input');



let STORE = {
    PERSONAL_TASK : [],
    WORK_TASK : [],
};
let filteredTaskList = [];
let currentTaskFilter = 'ALL';
let currentListFilter = 'WORK_TASK';
const getDataFromDatabase = () =>  {
    showSpinner();
    API_CALL(ENDPOINTS.getAllLists,{
        token : API_TOKEN
    }).then(res => {
        let children = res.files.filter(file => file.type==="folder" && file.title == firebase.auth().currentUser.uid)[0].children;
        PERSONAL_FILE_ID = res.files.filter(file => file.type==="document" && children.includes(file.id) && file.title ==='personal')[0].id;
        WORK_FILE_ID = res.files.filter(file => file.type==="document" && children.includes(file.id) && file.title ==='work')[0].id;
        
        Promise.all([
            API_CALL(ENDPOINTS.getAllTask,GET_ALL_TASK_REQUEST(PERSONAL_FILE_ID)),
            API_CALL(ENDPOINTS.getAllTask,GET_ALL_TASK_REQUEST(WORK_FILE_ID))]
        ).then(res => {
            STORE.PERSONAL_TASK = res[0].nodes.filter(node => node.id !== 'root');
            STORE.WORK_TASK = res[1].nodes.filter(node => node.id !== 'root');
            document.querySelector('input[type=radio][value="ALL"]').checked = true;
            document.querySelector('input[type=radio][value="WORK_TASK"]').checked = true;
            //document.querySelector('input[type=radio][value="PERSONAL"]').checked = true;
            applyFilter(currentTaskFilter,currentListFilter);
            createTaskOnUI(filteredTaskList);
            hideSpinner();
        });

    }).catch(err => {
        hideSpinner();
        alert('Something went wrong!');
    });
    
}


const initilizeApp = () => {
    
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            showSpinner();
            document.querySelector('.current-user-name').textContent = user.displayName;
            getDataFromDatabase();
        } else {
            window.open('../auth.html',"_self");
        }
      });
}

const createTaskOnUI = (TaskList) => {
    if(!TaskList) return;

    TASK_CONTAINER.innerHTML = '';
    TaskList.forEach(task => {
        let task_ele = TASK_TEMP.content.cloneNode(true);
        task_ele.querySelector('li').setAttribute('task-id',task.id);
        task_ele.querySelector('li > .task-label').textContent = task.content;
        (task.checked) ? 
            task_ele.querySelector('li > .task-actions > .toggl').textContent = '❌' :
            task_ele.querySelector('li > .task-actions > .toggl').textContent = '✔️';
        
            TASK_CONTAINER.appendChild(task_ele);
        
        (task.checked) ? 
            TASK_CONTAINER.querySelector(`li[task-id="${task.id}"] > .task-label`).classList.add('completed'):
            TASK_CONTAINER.querySelector(`li[task-id="${task.id}"] > .task-label`).classList.add('not-completed');
    });
}

const getTaskId = (btnEle) => {
    let li_ele = btnEle.parentElement.parentElement;
    return li_ele.getAttribute('task-id');
}

const deleteTask = (e) => {
    let task_id = getTaskId(e.currentTarget);
    STORE[currentListFilter] = STORE[currentListFilter].filter(task => task.id !== task_id);
    filteredTaskList = filteredTaskList.filter(task => task.id !== task_id);
    createTaskOnUI(filteredTaskList);
    let File_Id = (currentListFilter === 'WORK_TASK')?WORK_FILE_ID:PERSONAL_FILE_ID;
    API_CALL(ENDPOINTS.updateTask,DELETE_TASK_REQUEST(task_id,File_Id));
}

const togglTaskStatus = (e) => {
    let task_id = getTaskId(e.currentTarget);
    let newTaskStatus;
    STORE[currentListFilter] = STORE[currentListFilter].map(task => {
        if(task.id === task_id)
            newTaskStatus = task.checked = !task.checked;  
        return task;
    });
    createTaskOnUI(filteredTaskList);

    let File_Id = (currentListFilter === 'WORK_TASK')?WORK_FILE_ID:PERSONAL_FILE_ID;

    API_CALL(ENDPOINTS.updateTask,UPDATE_TASK_STATUS_REQUEST(newTaskStatus,task_id,File_Id));

}

const applyFilter = (currentTaskFilter,currentListFilter) => {
    if(currentTaskFilter === 'ALL'){
        filteredTaskList = STORE[currentListFilter].filter(task => task.id !== '');
    }else if(currentTaskFilter === 'NC'){
        filteredTaskList = STORE[currentListFilter].filter(task => task.checked !== true);
    }
    createTaskOnUI(filteredTaskList);
}

const doFilter = (filterType,filterVal) => {
    if(filterType === 'TASK'){
        currentTaskFilter = filterVal;
    }else if(filterType === 'LIST'){
        currentListFilter = filterVal;
    }
    applyFilter(currentTaskFilter,currentListFilter);
}

const createNewTask = (e) => {
    
    if(e.key === 'Enter'){
        let task_content = e.currentTarget.value;
        e.currentTarget.value = null;
        showSpinner();
        let File_Id = (currentListFilter === 'WORK_TASK')?WORK_FILE_ID:PERSONAL_FILE_ID;
        let response = API_CALL(ENDPOINTS.updateTask,CREATE_TASK_REQUEST(task_content,File_Id));
        response.then(res => {
            hideSpinner()
            STORE[currentListFilter] = [
                ...STORE[currentListFilter],
                {
                    id : res.new_node_ids[0],
                    content : task_content,
                    checked : false
                }
            ];
            applyFilter(currentTaskFilter,currentListFilter);
            createTaskOnUI(filteredTaskList);
            
        })
    }
} 

const updateTaskContent = (e) => {
    let task_content = e.currentTarget.querySelector('span.task-label').textContent;
    if(task_content){
        let File_Id = (currentListFilter === 'WORK_TASK')?WORK_FILE_ID:PERSONAL_FILE_ID;
        API_CALL(ENDPOINTS.updateTask,UPDATE_TASK_LABEL_REQUEST(task_content,e.currentTarget.getAttribute('task-id'),File_Id));
    }
}

/* AUTH PAGE FUNCTIONALITY */

const signOut = () => {
    showSpinner();
    firebase.auth().signOut().then(function() {
    hideSpinner();
        // Sign-out successful.
    }).catch(function(error) {
        alert('Something went wrong!');
    });
}


