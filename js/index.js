/* 
    a- function showModal()
        1- Add d-flex class
        2- remove d-none class
    
    b- function hideModal()
        1- Add d-none class
        2- remove d-flex class
    
    c- function addTask() 
        if Add Button
            1- make task object with values of inputs
            2- push task object in array (tasks)
            3- save tasks array in local storage
            4- display last task
            5- reset inputs
            6- hide modal
        else if updatebutton
            1- call update function [it needs index]

    d- function saveTasksToLocalStorage()
        1- save tasks array in local storage
    
    e- function displayTask(index)
        1- set details of task of given index
        2- add task html to its section
    
    f- function setHTMLocation(status)
        1- check status then add HTML to right section
        2- increase section counter by 1

    g- function updateTask(index)
        1- take input value and modify task of index
        2- save tasks array in Local Storage
        3- delete all tasks
        4- reset sections counter
        5- display all tasks after update
        5- reset all inputs

    h- function deleteTask(index)
        1- remove task of this index from array
        2- save tasks array in local storage
        3- delete all tasks
        4- reset sections counter
        5- display all tasks after delete

    i- function searchTask()
        1- delete all tasks
        2- reset sections counter
        3- display tasks matched search

*/
// ! HTML Elements
let root = document.querySelector(':root');
let body = document.body;

let modal = document.getElementById('modal');
let addNewTask = document.getElementById('newTask');

let taskStatusInput = document.getElementById('status');
let taskCategoryInput = document.getElementById('category');
let taskTitleInput = document.getElementById('title');
let taskDescriptionInput = document.getElementById('description');

let addTaskBtn = document.getElementById('addBtn');

let nextUpContainer = document.getElementById('toDo');
let inProgressContainer = document.getElementById('inProgress');
let doneContainer = document.getElementById('done');

let searchInput = document.getElementById('searchInput')

let nextUpCounterElmenet = document.getElementById('nextUpCount');
let inProgressCounterElmenet = document.getElementById('inProgressCount');
let doneCounterElmenet = document.getElementById('doneCount');

let gridBtn = document.getElementById('gridBtn');
let barsBtn = document.getElementById('barsBtn');

let sections = document.querySelectorAll("section");
let tasksContainer = document.querySelectorAll(".tasks");

let modeBtn = document.getElementById("mode");


// @ =========> app Variables
let tasksArr = [];
let taskHTML = '';
let updateIndex;

let nextUpCounter = 0;
let inProgressCounter = 0;
let doneCounter = 0;

if (localStorage.getItem('tasks')) {
    tasksArr = JSON.parse(localStorage.getItem('tasks'));
    for (let i = 0; i < tasksArr.length; i++) {
        displayTask(i);
    }
}


// ! functions

function showModal() {
    modal.classList.replace('d-none', 'd-flex');
    body.style.overflow = 'hidden';
    scroll(0, 0);
}

function hideModal() {
    modal.classList.replace('d-flex', 'd-none');
    body.style.overflow = 'auto';
}

function addTask() {
    if (validate(titleRegex, taskTitleInput) && validate(descriptionRegex, taskDescriptionInput)) {
        if (addTaskBtn.innerHTML.trim() === 'Add Task') {
            let task = {
                status: taskStatusInput.value,
                category: taskCategoryInput.value,
                title: taskTitleInput.value,
                description: taskDescriptionInput.value
            }
            tasksArr.push(task);
            displayTask(tasksArr.length - 1);
            saveTasksToLocalStorage();
            hideModal();
        } else if (addTaskBtn.innerHTML === 'Update Task') {
            updateTask(updateIndex);
            addTaskBtn.classList.replace('btn-update', 'btn-new-task');
        }
    }
}

function updateTask(index) {
    tasksArr[index].status = taskStatusInput.value;
    tasksArr[index].category = taskCategoryInput.value;
    tasksArr[index].title = taskTitleInput.value;
    tasksArr[index].description = taskDescriptionInput.value;

    saveTasksToLocalStorage();
    resetContainers();
    resetCounter();

    for (let i = 0; i < tasksArr.length; i++) {
        displayTask(i);
    }

    hideModal();
    addTaskBtn.innerHTML = "Add Task";
}

function displayTask(index) {
    taskHTML = `
        <div class="task">
            <h3 class="text-capitalize">${tasksArr[index].title
        }</h3>
            <p class="description text-capitalize">${tasksArr[index].description
        }</p>
            <h4 class="category ${tasksArr[index].category
        } text-capitalize">${tasksArr[index].category
        }</h4>
            <ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
            <li><i class="bi bi-pencil-square" onclick="getTaskInfo(${index})"></i></li>
            <li><i class="bi bi-trash-fill" onclick="deleteTask(${index})"></i></li>
            <li><i class="bi bi-palette-fill" onclick="changeColor(event)"></i></li>
        </ul>
        </div>
    `;
    setHTMLocation(tasksArr[index]?.status);
}

function setHTMLocation(status) {
    switch (status) {
        case "nextUp": nextUpContainer.innerHTML += taskHTML;
            nextUpCounter++
            nextUpCounterElmenet.innerHTML = nextUpCounter;
            break;
        case "inProgress": inProgressContainer.innerHTML += taskHTML;
            inProgressCounter++
            inProgressCounterElmenet.innerHTML = inProgressCounter;
            break;
        case "done": doneContainer.innerHTML += taskHTML;
            doneCounter++
            doneCounterElmenet.innerHTML = doneCounter;
            break;
    }
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasksArr));
}

function deleteTask(index) {
    tasksArr.splice(index, 1);
    saveTasksToLocalStorage();
    resetContainers();
    resetCounter();
    for (let i = 0; i < tasksArr.length; i++) {
        displayTask(i);
    }
}

function getTaskInfo(index) {
    showModal();
    taskStatusInput.value = tasksArr[index].status;
    taskCategoryInput.value = tasksArr[index].category;
    taskTitleInput.value = tasksArr[index].title;
    taskDescriptionInput.value = tasksArr[index].description;

    addTaskBtn.innerHTML = 'Update Task';
    addTaskBtn.classList.replace('btn-new-task', 'btn-update');
    updateIndex = index;
}

function resetContainers() {
    nextUpContainer.innerHTML = '';
    doneContainer.innerHTML = '';
    inProgressContainer.innerHTML = '';
}

function searchTask() {
    resetContainers();
    resetCounter();
    let searchKey = searchInput.value;
    for (let i = 0; i < tasksArr.length; i++) {
        if (tasksArr[i].title.toLowerCase().includes(searchKey.toLowerCase()) || tasksArr[i].category.toLowerCase().includes(searchKey.toLowerCase())) {
            displayTask(i);
        }
    }
}

function resetCounter() {
    nextUpCounter = 0;
    inProgressCounter = 0;
    doneCounter = 0;

    nextUpCounterElmenet.innerHTML = nextUpCounter;
    inProgressCounterElmenet.innerHTML = inProgressCounter;
    doneCounterElmenet.innerHTML = doneCounter;
}

function generateColor() {
    let color = '#';
    let char = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
    for (let i = 1; i <= 6; i++) {
        let randomIndex = Math.floor(Math.random() * char.length);
        color += char[randomIndex];
    }
    return color;
}

function changeColor(event) {
    let taskElement = event.target.closest('.task');
    taskElement.style.backgroundColor = generateColor();
}

function changeBars() {
    gridBtn.classList.remove('active');
    barsBtn.classList.add('active');

    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.remove('col-md-6', 'col-lg-4');
        sections[i].style.overflow = 'auto';
    }

    for (let j = 0; j < tasksContainer.length; j++) {
        tasksContainer[j].setAttribute('data-view', 'bars');
    }
}

function changeBarsToDefault() {
    barsBtn.classList.remove('active');
    gridBtn.classList.add('active');

    for (let i = 0; i < sections.length; i++) {
        sections[i].classList.add('col-md-6', 'col-lg-4');
        sections[i].style.overflow = 'hidden';
    }

    for (let j = 0; j < tasksContainer.length; j++) {
        tasksContainer[j].removeAttribute('data-view');
    }
}

let titleRegex = /^\w{3,}(\s\w+)*$/;
let descriptionRegex = /^(?=.{3,100}$)\w+(\s\w*)*$/;

function validate(regex, element) {
    if (regex.test(element.value)) {
        element.classList.add('is-valid');
        element.classList.remove('is-invalid');
        element.parentElement.nextElementSibling.classList.add('d-none');
    } else {
        element.classList.add('is-invalid');
        element.classList.remove('is-valid');
        element.parentElement.nextElementSibling.classList.remove('d-none');
    }

    return regex.test(element.value);
}

function changeMode() {
    if (modeBtn.dataset.mode == 'night') {
        root.style.setProperty('--main-black', '#f1f1f1');
        root.style.setProperty('--sec-black', '#ddd');
        root.style.setProperty('--gray-color', '#222');
        root.style.setProperty('--text-color', '#333');
        root.style.setProperty('--mid-gray', '#000');
        modeBtn.classList.replace('bi-sun-fill', 'bi-moon-stars-fill')
        modeBtn.dataset.mode = 'light';
    } else if (modeBtn.dataset.mode == 'light') {
        root.style.setProperty('--main-black', '#0d1117');
        root.style.setProperty('--sec-black', '#161b22');
        root.style.setProperty('--gray-color', '#dadada');
        root.style.setProperty('--text-color', '#a5a6a7');
        root.style.setProperty('--mid-gray', '#f1f1f1');
        modeBtn.classList.replace('bi-moon-stars-fill', 'bi-sun-fill')
        modeBtn.dataset.mode = 'night';
    }
}

modeBtn.addEventListener('click', changeMode);

taskTitleInput.addEventListener('input', () => {
    validate(titleRegex, taskTitleInput);
});

taskDescriptionInput.addEventListener('input', () => {
    validate(descriptionRegex, taskDescriptionInput);
})

searchInput.addEventListener('input', searchTask)

addNewTask.addEventListener('click', showModal);

modal.addEventListener('click', function(e) {
    if (e.target.classList.contains('my-modal')) {
        hideModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.code === 'Escape') {
        hideModal();
    }
});

addTaskBtn.addEventListener('click', addTask);

barsBtn.addEventListener('click', changeBars);

gridBtn.addEventListener('click', changeBarsToDefault);