const currentUserId = "chante";
function saveTask()
{   
    //get values from the DOM
    const title = $("#txtTitle").val();
    const desc =$("#txtDescription").val();
    const color =$("#selColor").val();
    const date =$("#selDate").val();
    const status =$("#selStatus").val();
    const budget =$("#numBudget").val();
    //Create the object
    const taskToSave = new Task(title, desc, color, date, status, budget, currentUserId,);
    console.log(taskToSave);

    //mock the response from the server
    displayTask(taskToSave);

    //Send to Server
    $.ajax({
        type:"POST",// HTTP Verb : Create
        url: API,
        data: JSON.stringify(taskToSave),
        contentType:"application/json",
        success:function(created){
            console.log(created);
        },
        error: function(err){
            console.log(err);
        },
    });
}

function updateTask() {
  $.ajax({
    type: "PUT", // HTTP Verb: Update
    url: "https://106api-b0bnggbsgnezbzcz.westus3-01.azurewebsites.net/api/tasks/1",
    data: JSON.stringify({
      title: "Chante",
      budget: 9999,
    }),
    contentType: "application/json",
    success: function (response) {
      console.log(response);
    },
    error: function (err) {
      console.log(err);
    },
  });
}



const API = "https://106api-b0bnggbsgnezbzcz.westus3-01.azurewebsites.net/api/tasks";

function loadTask(){
    $.ajax({
        type:"get", //HTTP Verb. READ
        url: API,
        dataType:"json",//Expected format
        success: function (data) {
            console.log(data);
            //minichallange: try to solve the commnication problem, bacause we are trying
            //to send 8 elements into a single container. this is a logic problem
            $(".list").empty();

            // Filter tasks by the current user
            for (let i = 0; i < data.length; i++) {
            if (data[i].userId === currentUserId) {
            displayTask(data[i]);
          }
         }
        },
    error: function (err) {
      console.error("Error loading tasks", err);
    },
  });
}

function displayTask(task) {
  // Added quotes to id and data-user-id attributes
  let syntax = `
    <div class="task" id="${task.id}" data-user-id="${task.userId}" style="border-color:${task.color}">
    <div class="info">
    <h4>${task.title}</h4>
    <p>${task.desc}</p>
    </div>
    <label class="status">${task.status}</label>
    <div class="date-budget">
    <label>Due: ${task.date}</label>
    <label>Budget: $${task.budget}</label>
    </div>
    <button class="btn-delete"> Delete </button>
    </div>`;

  $(".list").append(syntax);
}



function deleteTask(){
    //1. Context: this is the specific button that was clicked
    let btn = $(this);

    //2. Find the parent div with the class task
    let taskElement = btn.parents(".task");

    //3. Get the ID that we save in to the HTML
    let id= tasksElement.attr("id");

    console.log("requesting id is", id);
    //Server communication
    $.ajax({
        type: "DELTE", // HTTP Verb: Remove
        url: API + "/" + id, //Example: URL...../api/task/1
        success:function(){
            //succes: lets remoe and add some styl e to it
            taskElement.fadeOut(500, function(){
                $(this).remove();
            });
            },
         });
        }

function filterTask(status) {
  if (status === "All") {
    $(".task").show();
  } else {
    $(".task").hide();

    //show only those that match
    //we can look at the text inside the label <label class="status">
    $(".task").each(function () {
      let taskStatus = $(this).find(".status").text();
    //   = assign
    //   == compare
    //   === compare and return "true" or "false"
      if ((taskStatus === status)) {
        $(this).show();
      }
    });
  }
}

function displayTask(task){
let syntax =  `
    <div class="task" style="border-color:${task.color}">
      <div class="info">
        <h4>${task.title}</h4>
        <p>${task.desc}</p>
      </div>
      <label class="status">${task.status}</label>
      <div class="date-budget">
        <label>Due: ${task.date}</label>
        <label>Budget: $${task.budget}</label>
      </div>
      <button class="btn-delete"> Delete </button>
    </div>`;

    
  // Inject the new HTML into the DOM Tree
  $(".list").append(syntax);

}

function init() {
    $("#btnSave").click(saveTask);
    //$(".btn-delete").click(updateTask);
    //load data from the server
    //On click inside ".list", if target is ".btn-delete", run function
    $(".list").on("click",".btn-delete",deleteTask);
    //Hook of teh filter buttons
    $("#btnAll").click(function(){filterTask("All")})
    $("#btnDone").click(function(){filterTask("Completed")})
    $("#btnTodo").click(function(){filterTask("New")})
    loadTask();
}

window.onload = init;
//It force that the HTML and the CSS gets resolved before that the logic gets executed