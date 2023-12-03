    //TO-DOs:
    //prio img at card + detail card
    //assigned to linking
    //subtasks add task and detail card
    // css animations

let currentDraggedElement;

async function init(){
    loadContactsFromStorage();
    renderTasks();
}

//LOAD Storage
async function loadContactsFromStorage(){
  try{
      contacts = JSON.parse(await getItem('contacts'));
  }catch(e){
    console.warn('loading error:', e)
  }
  sortContacts();
}

//SORT Contacts
function sortContacts(){
  contacts.sort((a, b) => {
    if (a.name.toUpperCase() < b.name.toUpperCase()) {
     return -1;
    } else if (a.name.toUpperCase() > b.name.toUpperCase()) {
     return 1;
    } else {
     return 0;
    }
   });
}

//LOAD Contacts
function loadContacts(){
  let contactList = document.getElementById('assigned-editors');
  for (let i = 0; i < contacts.length; i++) {
      let initials = contacts[i]['name'].split(" ").map((n)=>n[0]).join("");
      let randomColor = '#' + contacts[i]['randomColor'];
      let name = contacts[i]['name'];
      contactList.innerHTML += `
     <label for="checkbox${i}">
      <li id="assigned-contact${i}" onclick="checkIfAssigned(${i})">
      <input style="display: none" type="checkbox" id="checkbox${i}">
        <div class="drop-name-initials">
          <div class="drop-initials" style="background-color: ${randomColor}">${initials}</div>
          <span> ${name}</span>
        </div>
          <img id="checked${i}" src="/assets/img/icons/check_button.png" alt="">
      </li>
     </label>
  `;
  }
    sortContacts();
}

function checkIfAssigned(i){
  let checkbox = document.getElementById(`checkbox${i}`).checked;
 
  if(checkbox == false){
    setUnAssigned(i); 
  }

  if(checkbox == true){
    setAssigned(i);
  }
}

function setAssigned(i){
  let assignedContact = document.getElementById(`assigned-contact${i}`);
  let checkImg = document.getElementById(`checked${i}`);
  assignedContact.style = "background-color: #2A3647; color: white"
  checkImg.src ="/assets/img/icons/check_button_checked.png";
}

function showDropdownContacts(){
  let dropdown = document.getElementById('assigned-editors');
  if(dropdown.style.display == 'none'){
    dropdown.style.display = 'block';
    clearAssignedTo();
  }else{
    dropdown.style.display = 'none';
    addAssignedEditors();
  } 
}

function addAssignedEditors(){
  let showAssignedEditors = document.getElementById('show-assigned-editors-container');
  for (let i = 0; i < contacts.length; i++) {
    const checkedEditor = contacts[i];
    let randomColor = '#' + checkedEditor['randomColor'];
    let initials = checkedEditor['name'].split(" ").map((n)=>n[0]).join("");
    let checkbox = document.getElementById(`checkbox${i}`).checked;
    if(checkbox == true){
      showAssignedEditors.innerHTML += `
      <div id="editor${i}" class="drop-initials" style="background-color: ${randomColor}">${initials}</div>
      `;
    }
  }
}

function clearAssignedTo(){
  document.getElementById('show-assigned-editors-container').innerHTML = '';
}

function setUnAssigned(i){
  let assignedContact = document.getElementById(`assigned-contact${i}`);
  let checkImg = document.getElementById(`checked${i}`);
  assignedContact.style = "color: black";
  checkImg.src ="/assets/img/icons/check_button.png";
}

function renderTasks(subTasksDone) {
  for (let i = 0; i < tasks.length; i++) {
    let status = tasks[i]["status"];
    if (status == status) {
      document.getElementById(`${status}`).innerHTML += generateTask(i, subTasksDone);
      updateDoneSubs(i);
      generateSubtasks(i);
      checkCategory(i);
      renderAssignedTo(i);
    }
  }
  checkIfBoardEmpty();
}

function checkIfBoardEmpty(){
  checkOpen('open');
  checkOpen('in-progress');
  checkOpen('await-feedback');
  checkOpen('done');
}

function checkOpen(id){
let board = document.getElementById(`${id}`);
    if(board.innerHTML == ''){
      document.getElementById(`${id}-empty`).style.display = "flex";
     }else{
      document.getElementById(`${id}-empty`).style.display = "none";
     }
}

function checkCategory(i){
  let category = tasks[i]["category"];
  if(category == 'User Story'){
    document.getElementById(`category${i}`).style.backgroundColor = "rgb(0,56,255)";
  }
  if(category == 'Technical Task'){
    document.getElementById(`category${i}`).style.backgroundColor = "rgb(31,215,193)";
  }
}

function renderAssignedTo(i){
  let assignedTo = document.getElementById(`todo-assigned-to${i}`);
  assignedTo.innerHTML = '';

  for (let index = 0; index < tasks[i]['assignedto'].length; index++) {
    const editor = tasks[i]['assignedto'][index];
    assignedTo.innerHTML += `
    <div id="mini-logo${editor[i]}" class="mini-logo">${editor}</div>
    `;
  }
}

function refreshTasks(){
  document.getElementById("open").innerHTML = '';
  document.getElementById("in-progress").innerHTML = '';
  document.getElementById("await-feedback").innerHTML = '';
  document.getElementById("done").innerHTML = '';
}

function generateTask(i){
    return `
    <div id="todo-card${i}" draggable="true" class="todo-card" ondragstart="startDragging(${i})" onclick="openTaskDetails(${i})">
      <span id="category${i}" class="category">${tasks[i]["category"]}</span>
      <div class="title-description">
        <span class="todo-title">${tasks[i]["title"]}</span>
        <span class="todo-description">${tasks[i]["description"]}</span>
      </div>
      <div class="sub-progress-container">
        <div class="subtasks-progress-bar-container">
          <div class="subtasks-progress-bar" id="subtasks-progress${i}"></div>
        </div>
        <span><span id="subsDoneOfAll${i}"></span> / ${tasks[i]["subtasks"].length} Subtasks</span>
      </div>
      <div class="assigned-prio">
        <div class="todo-assigned-to" id="todo-assigned-to${i}"></div>
        <img src="assets/img/icons/Prio media.png" alt="">
      </div>
    </div>
    `;
}

function generateSubtasks(i){
  let subProgressBar = document.getElementById(`subtasks-progress${i}`);
  subProgressBar.innerHTML = '';
  let openSubTasks = tasks[i]['subtasks'].length;
  let subTasksDone = tasks[i]['subTasksDone'].length;
  let percent = subTasksDone / openSubTasks * 100;
  subProgressBar.style.width = percent + '%';
}

function updateDoneSubs(i){
  let subTasksDone = tasks[i].subTasksDone.length;
  if(subTasksDone == 0){
    document.getElementById(`subsDoneOfAll${i}`).innerHTML = '0';
  }else{
    document.getElementById(`subsDoneOfAll${i}`).innerHTML =`${subTasksDone}`;
  }
  
}

//drag&drop
function startDragging(i){
 currentDraggedElement = i;
}

function allowDrop(ev){
  ev.preventDefault();
}

function moveTo(status){
 tasks[currentDraggedElement]['status'] = status;
  refreshTasks();
  renderTasks();
  checkIfBoardEmpty();
}

//Detail-Todo
function openTaskDetails(i){
  document.getElementById('overlay').style.display = "flex"; 
  document.getElementById('overlay').innerHTML = generateOverlay(i);
  checkOverlayCategory(i);
  generateDetailSubtasks(i);
  checkIfSubsDone(i);
}

function checkOverlayCategory(i){
  let category = tasks[i]["category"];
  if(category == 'User Story'){
    document.getElementById(`overlay-category${i}`).style.backgroundColor = "rgb(0,56,255)";
  }
  if(category == 'Technical Task'){
    document.getElementById(`overlay-category${i}`).style.backgroundColor = "rgb(31,215,193)";
  }
}

function closeDetailCard(){
  document.getElementById('overlay').style.display = "none";
}

function generateDetailSubtasks(i){
  let detailSub = document.getElementById(`checklistSubDetail`);
  detailSub.innerHTML = '';

    for (let j = 0; j < tasks[i]["subtasks"].length; j++) {
      let subtask = tasks[i]["subtasks"][j];
      detailSub.innerHTML += `
      <div class="detailSub" onclick="setChecked(${j}, ${i})">
        <img id="detailSub${j}"  src="/assets/img/icons/check_button.png">
        <span>${subtask}</span>
      </div>`;
    } //besser mit >label> <input type="checkbox" display="none"> und .checked Abfrage???
}

function setChecked(j, i){
  let subtask = tasks[i]['subtasks'][j];
  let subtaskDone = tasks[i]['subTasksDone'][j];
  if(subtask == subtaskDone){
    document.getElementById(`detailSub${j}`).src = '/assets/img/icons/check_button.png';
    tasks[i]['subTasksDone'].splice(j, 1);
  }else{
    tasks[i]['subTasksDone'].push(subtask);
    document.getElementById(`detailSub${j}`).src = '/assets/img/icons/check_button_checked_bl.png';
  }
  generateSubtasks(i);
  updateDoneSubs(i);
}

function checkIfSubsDone(i){
  let subtasks = tasks[i]['subtasks'];
  let subtasksDone = tasks[i]['subTasksDone'];
  for (let j = 0; j < tasks[i]['subtasks'].length; j++) {
    const subtask = subtasks[j];
    const subtaskDone = subtasksDone[j];
    if(subtask == subtaskDone){
      document.getElementById(`detailSub${j}`).src = '/assets/img/icons/check_button_checked_bl.png'
    }
  }
}

function generateOverlay(i){
  return `<div id="todo-card${i}" class="detail-todo-card" onclick="doNotClose(event)">
  <div class="detail-card-top">  
    <p id="overlay-category${i}" class="category">${tasks[i]["category"]}</p>
    <button class="close-button" onclick="closeDetailCard()"><img src="assets/img/icons/close.png" alt="close"></button>
  </div>
    <span class="detail-title">${tasks[i]["title"]}</span><br>
    <span class="f-s20-w400">${tasks[i]["description"]}</span><br>
    <span class="f-s20-w400">Due date:  ${tasks[i]["duedate"]}</span><br>
    <span class="f-s20-w400">Priority:  ${tasks[i]["prio"]}</span><br>
    <span class="f-s20-w400">Assigned to:<br>${tasks[i]["assignedto"]}</span><br>
    <span class="f-s20-w400">Subtasks<div id="checklistSubDetail"></div></span>
    </div>
    `;
}

//SEARCH
function filterTasks() {
  let search = document.getElementById("search").value.toLowerCase();
  refreshTasks();
  if (search == "") {
    //document.getElementById('notfound').style.display = "none";
    renderTasks();
  }else{
    FilteredTasks(search);
  }
}

function hover(id){
  document.getElementById(id).setAttribute('src', '/assets/img/icons/plus_button_hover.png');
}

function unhover(id){
  document.getElementById(id).setAttribute('src', '/assets/img/icons/plus_button.png');
}

function FilteredTasks(search){ 
  refreshTasks();
  for (let i = 0; i < tasks.length; i++) {
    let title = tasks[i]['title'].toLowerCase();
    let description = tasks[i]['description'].toLowerCase();
    if (title.toLowerCase().includes(search)||description.toLowerCase().includes(search)) {
      renderFilteredTasks(i);
    }else{
      //?checkIfEmpty();
    }
  }
}

function renderFilteredTasks(i){
  let status = tasks[i]["status"];
  if (status == status) {
    document.getElementById(`${status}`).innerHTML += generateTask(i);
    checkCategory(i);
  }
}

function openAddTaskCard(){
  document.getElementById('add-task-overlay').style.display = 'flex';
  loadContacts();
}

function closeAddTaskCard(){
  document.getElementById('assigned-editors').innerHTML = '';
  document.getElementById('add-task-overlay').style.display = 'none';
}

function doNotClose(event){
  event.stopPropagation();
}