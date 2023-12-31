//EDIT TASK START
function openEditOverlay(i){
    loadTaskData(i);
    loadContacts();
}


function loadTaskData(i){
    let title = tasks[i]['title'];
    let description = tasks[i]['description'];
    let duedate = tasks[i]['duedate'];
    document.getElementById('overlay').innerHTML = generateEditTaskOverlay(i, title, description, duedate);
    showEditPrio(i);
    renderAssignedToEdit(i);
    renderEditSubtasks(i);
}


function clearAssignedTo(index){
    document.getElementById('show-assigned-editors-edit-container').innerHTML = '';
    tasks[index]['assignedto'].splice(0, tasks[index]['assignedto'].length);
}


function renderAssignedToEdit(index){
    let showAssignedEditors = document.getElementById(`show-assigned-editors-edit-container`);
  
    for (let i = 0; i < tasks[index]['assignedto'].length; i++) {
        const checkedEditor = tasks[index]['assignedto'][i]['initials'];
        let randomColor = tasks[index]['assignedto'][i]['randomColor'];
        showAssignedEditors.innerHTML += generateAssignedTo(i, randomColor, checkedEditor);
    }
}


function saveTask(i){
    refreshTasks();
    tasks[i]['title'] = document.getElementById('edit-task-title-input').value;
    tasks[i]['description'] = document.getElementById('edit-task-description-input').value;
    tasks[i]['duedate'] = document.getElementById('edit-task-form-input').value;
    tasks[i]['prio'];
    tasks[i]['assignedTo'];
    tasks[i]['subtasks'];
    createSubtasksDoneArrayEditOverlay(i);
    tasks.push();
    setItem('tasks', JSON.stringify(tasks));
    loadTasksfromStorage();
    closeEditOverlay();
    openTaskDetails(i);
}


function closeEditOverlay(){
    document.getElementById('overlay').style.display = "none";
}
//EDIT TASK END


//PRIO START
function showEditPrio(i){
    let prio = tasks[i]['prio'];
    if(prio == 'urgent'){
       document.getElementById(prio).style.backgroundColor = "#FF3D00";
       document.getElementById(`${prio}-text`).style.color = "#FFFFFF";
       document.getElementById(`${prio}-img-edit`).src = `/assets/img/prio_${prio}_white_icon.png`;
       }else if(prio == 'medium'){
       document.getElementById(prio).style.backgroundColor = "#FFA800";
       document.getElementById(`${prio}-text`).style.color = "#FFFFFF";
       document.getElementById(`${prio}-img-edit`).src = `/assets/img/prio_${prio}_white_icon.png`;
       }else if(prio == 'low'){
       document.getElementById(prio).style.backgroundColor = "#7AE229";
       document.getElementById(`${prio}-text`).style.color = "#FFFFFF";
       document.getElementById(`${prio}-img-edit`).src = `/assets/img/prio_${prio}_white_icon.png`;
       assets/img/prio_low_white_icon.png
     }
   }

function setPrio(i, newPrio, buttonColor){
    resetColors();
    tasks[i]['prio'] = newPrio;
    document.getElementById(newPrio).style.backgroundColor = buttonColor;
    document.getElementById(`${newPrio}-text`).style.color = "#FFFFFF";
    document.getElementById(`${newPrio}-img-edit`).src = `/assets/img/prio_${newPrio}_white_icon.png`;
}
  

function resetColors() {
    ['urgent', 'medium', 'low'].forEach(priority => {
        document.getElementById(priority).style.backgroundColor = "";
        document.getElementById(`${priority}-text`).style.color = "";
        document.getElementById(`${priority}-img-edit`).src = `/assets/img/prio_${priority}_icon.png`;
    });
}
//PRIO END


//SUBTASKS START
function renderEditSubtasks(index){
        let subtasksContainer = document.getElementById('edit-task-subtasks-container');
        subtasksContainer.innerHTML = '';
        for (let i = 0; i < tasks[index]['subtasks'].length; i++) {
          const subtask = tasks[index]['subtasks'][i];
          subtasksContainer.innerHTML += `
        <div class="edit-subtask">
        
            <div onclick="editSubtask(${i})" class="subtask-list-item" id="editable-subtask${i}" onMouseOver="showIcons(${i})" onMouseOut="hideIcons(${i})">
                <span>• ${subtask}</span>            
                <div id="edit-task-active-subtask-icon-box${i}" class="edit-task-active-subtask-icon-box" style="opacity:0;" >                
                <img src="assets/img/subtask_edit_icon.png" alt="Check" onclick="changeSubtaskEditOverlay(${i}, ${index})" />
                <div class="sub-divider"></div>
                <img src="assets/img/subtask_delete_icon.png" alt="Delete" onclick="deleteSubtaskEditOverlay(${i}, ${index})" />
            </div>
       

        </div>
            <div id="editSubtaskContainer${i}"  style="display: none" class="edit-task-subtask-input-container">
              <input id="editSubtaskInput${i}" value="${subtask}" class="edit-subtask-input">    
                <div class="edit-task-active-subtask-icon-box">                
                    <img src="assets/img/subtask_delete_icon.png" alt="Delete" onclick="deleteSubtaskEditOverlay(${i}, ${index})" />
                    <div class="sub-divider"></div>
                    <img src="assets/img/subtask_check_icon.png" alt="Check" onclick="changeSubtaskEditOverlay(${i}, ${index})" />
                </div>
            </div>
        </div>
          `
        }
}


function addSubtaskEditOverlay(i){
    let subtask = document.getElementById('add-task-subtask-input').value;
    tasks[i]['subtasks'].push(subtask);
    setItem('tasks', JSON.stringify(tasks));
    renderEditSubtasks(i);
    clearSubtaskInput(i);
}


function editSubtask(i){
    document.getElementById(`editable-subtask${i}`).style.display = "none";
    document.getElementById(`editSubtaskContainer${i}`).style.display ="flex";
}

  
function deleteSubtaskEditOverlay(i, index){
    tasks[index]['subtasks'].splice(i, 1);
    tasks[index]['subTasksDone'].splice(i, 1);
    setItem('tasks', JSON.stringify(tasks));
    renderEditSubtasks(index);
    clearSubtaskInput();
    refreshTasks();
}

  
function changeSubtaskEditOverlay(i, index){
    tasks[index]['subtasks'][i] = document.getElementById(`editSubtaskInput${i}`).value;
    tasks[index]['subTasksDone'][i]['subname'] = document.getElementById(`editSubtaskInput${i}`).value;
    setItem('tasks', JSON.stringify(tasks));
    renderEditSubtasks(index);
    clearSubtaskInput();
}


function createSubtasksDoneArrayEditOverlay(index){
    tasks[index]['subTasksDone'].splice(0, tasks[index]['subTasksDone'].length)
    for (let i = 0; i < tasks[index]['subtasks'].length; i++) {
      const subtask = tasks[index]['subtasks'][i];
      let subtaskDoneJson = {
        subname: subtask, 
        checked: false
      }
      tasks[index]['subTasksDone'].push(subtaskDoneJson);
    }
}


function showIcons(i){
 document.getElementById(`edit-task-active-subtask-icon-box${i}`).style.opacity = 1;
}

function hideIcons(i){
    document.getElementById(`edit-task-active-subtask-icon-box${i}`).style.opacity = 0;
}
//SUBTASKS START