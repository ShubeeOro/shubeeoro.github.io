const taskData = [
    {
        title: "First task",
        description: "Just an example task. The description contains text.",
        dueDate: "2024-01-01",
    },
    {
        title: "Task (overdue)",
        description: "This task is overdue (due in the past)",
        dueDate: "2023-11-10",
        completed: false
    },
    {
        title: "Another task (completed)",
        description: "This task has the property completed: true",
        dueDate: "2023-10-10",
        completed: true,
    },
    {
        title: "Another completed task",
        description: "This task is completed but the due date was before the other one",
        dueDate: "2023-06-01",
        completed: true
    }
]

// Gets the current date
let date = new Date()

console.log(date)

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

let currentDate = `${year}-${month}-${day}`;

let taskcontainer = null;

let editbuttons = null;

let deletebuttons = null;

let li_task = null;

let heading = null;

document.addEventListener("DOMContentLoaded", function() {

    heading = document.querySelector("header>h1");

    console.log(heading)

    for (i in taskData) {
        document.getElementById("task_list").appendChild(loadTaskData(taskData[i], i))
    }
    
    checkTasks()

    refreshDel()

    refreshEdit()

    document.getElementById("save_task").addEventListener("click", function(event) {

        event.preventDefault;

        newtask = createTask()

        updateStatus()

        document.getElementById("task_list").appendChild(loadTaskData(taskData[newtask], newtask));

        checkTasks()

        refreshDel()

        refreshEdit()

    });

    document.getElementById("modal_wrapper").addEventListener("click", (event) => {
        if (event.target.id === "modal_wrapper") {
            hideModal()
        }
    });


    document.getElementById("datacheck").addEventListener("click", function() {
        console.log(taskData)
    })

    document.getElementById("create").addEventListener("click", openTaskCreator);

    document.getElementById("defaultmode").addEventListener("click", defaultView)

    document.getElementById("pending").addEventListener("click", pendingOnly)

    document.getElementById("completed").addEventListener("click", completedOnly)

});
    


function createTask() {

    var tasktitle = document.getElementById("new_task_title").value
    var taskdesc = document.getElementById("new_task_description").value
    var taskdue = document.getElementById("new_task_due_date").value

    taskData.push(
        {
            title: tasktitle,
            description: taskdesc,
            dueDate: taskdue,
            completed: false
        }
    )

    var new_task = (taskData.length - 1)

    return new_task

};

function loadTaskData(temp, num) {

    var task = document.createElement("li")
    var checkbox = document.createElement("input")
    var label = document.createElement("label")
    var description = document.createElement('p')
    var taskdate = document.createElement('p')
    var taskaction = document.createElement('p')
    var editBtn = document.createElement('button')
    var delBtn = document.createElement('button')

    checkbox.type = "checkbox";


    if (temp["completed"]) {
        checkbox.checked = true;
    } else {
        checkbox.checked = false;
    }

    // Checks what tasks are overdue
    temp1 = new Date(temp['dueDate'])
    temp2 = new Date(currentDate)

    if (temp2 > temp1) {
        task.classList.add("overdue")
    }

    checkbox.id = "task_" + num;

    editBtn.textContent = "Edit"
    delBtn.textContent = "Delete"

    label.textContent = (temp['title']);
    description.textContent = (temp['description']);
    taskdate.textContent = "Due: " + (temp['dueDate'])

    taskaction.classList.add("task_actions")
    editBtn.classList.add("edit_task")
    delBtn.classList.add("delete_task")

    task.appendChild(checkbox)
    task.appendChild(label);
    task.appendChild(description)
    task.append(taskdate)
    task.appendChild(taskaction);

    taskaction.appendChild(editBtn);
    taskaction.appendChild(delBtn);

    return task
}

/*Functions relating to the modal aka task creator*/
function hideModal() {
    document.getElementById("modal_wrapper").style.display = "none"
};

function openTaskCreator() {
    document.getElementById("modal_wrapper").style.display = "block"
};

function checkmark(evt) {
    let taskid = (evt.target.id).slice(-1)
    console.log(evt.target.id)
        if (evt.target.checked == true) {
        taskData.forEach((n, v) => {
            if (taskid == v) {
                taskData[v]["completed"] = true
                }   
            })
        }
        if (evt.target.checked == false) {
            taskData.forEach((n, v) => {
                if (taskid == v) {
                    taskData[v]["completed"] = false
                } 
            })
        }
    updateStatus()
    }

function updateStatus() {
    let total = 0
    let done = 0
    taskData.forEach((n) => {
        total += 1
        if (n["completed"]) {
            done += 1
        }
    })
    document.getElementById("stats").innerText = (total-done) + " tasks due, " + total + " tasks total"
}

function editTask(evt) {
    tempelem = evt.target.parentNode.parentNode.firstChild.id;
    tasknum = tempelem.slice(-1);

    for (i in taskData) {
        if (i == tasknum) {
            taskData.splice(i, 1)
            
        }
    }
}

function deleteTask(evt) {
    tempelem = evt.target.parentNode.parentNode.firstChild.id;
    task_ul = (evt.target.parentNode.parentNode.parentNode)
    tasknum = tempelem.slice(-1);
    console.log(task_ul)
    for (i in taskData) {
        if (i == tasknum) {
            taskData.splice(i, 1)
            evt.target.parentNode.parentNode.remove();
            console.log(task_ul.childNodes.length);
            if (task_ul.childNodes.length == null) {
                count = 0;
            } else {
                count = task_ul.childNodes.length;
            }
            if (count != 0) {
                for (let j = 0;  j < (count); ++j) {
                    console.log(('task_' + j));
                    task_ul.children[j].firstChild.id = ('task_' + j);
                };
            } else {
                evt.target.parentNode.parentNode.firstChild.remove();
            }
        }  
    }
    updateStatus()
}

function refreshDel() {

    deletebuttons = document.querySelectorAll('.delete_task')

    deletebuttons.forEach(elem => {

        elem.removeEventListener("click", deleteTask)

        elem.addEventListener("click", deleteTask)
        }
    );
}

function refreshEdit() {

    editbuttons = document.querySelectorAll('.edit_task')

    editbuttons.forEach(elem => {

        elem.removeEventListener("click", editTask)

        elem.addEventListener("click", editTask)

        }
    );
}


function checkTasks() {

    taskcontainer = document.querySelectorAll('input[type="checkbox"]')

    taskcontainer.forEach(elem => {

        elem.removeEventListener("click", checkmark)

        elem.addEventListener("click", checkmark)
        }
    );
}

//Return to default view
function defaultView() {

    heading.innerText = "All Tasks";

    li_task = document.querySelectorAll("ul#task_list>li")

    li_task.forEach(elem => {

        elem.style.display = "grid"
        }
    );
}

// Only displays complete tasks
function completedOnly() {

    heading.innerText = "Completed Tasks";

    li_task = document.querySelectorAll("ul#task_list > li")
    
    li_task.forEach(elem => {

        if (elem.firstChild.checked) {
            elem.style.display = "grid"
        } else {
                elem.style.display = "none"
            }
        }
    );
}


// Only displays pending tasks
function pendingOnly() {

    heading.innerText = "Pending Tasks";

    li_task = document.querySelectorAll("ul#task_list > li")

    li_task.forEach(elem => {

        console.log(elem)
        console.log(elem.firstChild.checked)

        if (elem.firstChild.checked) {
                elem.style.display = "none"
        } else {
                elem.style.display = "grid"
            }
        }
    );
}
