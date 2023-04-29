// TODO #4.0: Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const backendIPAddress = "127.0.0.1:3000";

let itemsData;

// TODO #2.1: Edit group number
const getGroupNumber = () => {
  return 13;
};

// TODO #2.2: Show group members
/*const showGroupMembers = async () => {
  const member_list = document.getElementById("member-list");
  member_list.innerHTML = "";
  const member_dropdown = document.getElementById("name-to-add");
  member_dropdown.innerHTML =
    "<option value='0'>-- เลือกผู้ฝากซื้อ --</option>";
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(`http://${backendIPAddress}/items/members`, options)
    .then((response) => response.json())
    .then((data) => {
      const members = data;
      members.map((member) => {
        member_list.innerHTML += `
          <li>${member.full_name}</li>
          `;
        // ----------------- FILL IN YOUR CODE UNDER THIS AREA ONLY ----------------- //
        member_dropdown.innerHTML += ``;
        // ----------------- FILL IN YOUR CODE ABOVE THIS AREA ONLY ----------------- //
      });
    })
    .catch((error) => console.error(error));
};*/

// TODO #2.3: Send Get items ("GET") request to backend server and store the response in itemsData variable
const getItemsFromDB = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(`http://${backendIPAddress}/items`, options)
    .then((response) => response.json())
    .then((data) => {
      itemsData = data;
    })
    .catch((error) => console.error(error));
  console.log(itemsData);
};

// TODO #2.4: Show items in table (Sort itemsData variable based on created_date in ascending order)
const showItemsInList = (itemsData) => {
  // ----------------- FILL IN YOUR CODE UNDER THIS AREA ONLY ----------------- //
  itemsData.sort((a, b) => {
    try{
      let A = a.due_date.split("-").map(x => parseInt(x));
      let B = b.due_date.split("-").map(x => parseInt(x));
      if (A < B) return -1;
      else if (A > B) return 1;
      else return 0;
    }
    catch {return ;}
  });
  // ----------------- FILL IN YOUR CODE ABOVE THIS AREA ONLY ----------------- //
  itemsData.map((item) => {
    // ----------------- FILL IN YOUR CODE UNDER THIS AREA ONLY ----------------- //
    addItemtolist(item);
    // ----------------- FILL IN YOUR CODE ABOVE THIS AREA ONLY ----------------- //
  });
};

//myadd
function addItemtolist(item) {
  const taskList = document.getElementById('taskList');
  
  const oneRow = document.createElement("div");
  const note = document.createElement("div");
  const taskItem = document.createElement("button");
  const bin = document.createElement("button");

  note.className = "note";
  taskItem.className = "task";
  bin.className = "deleteButton";
  let i = taskList.childElementCount;
  oneRow.id = `oneRow${i}`;
  oneRow.className = "oneRow";
  note.id = `note${i}`;
  taskItem.id = `task${i}`;
  bin.id = `bin${i}`;
  bin.innerHTML = `
                  <img src="./img/image-removebg-preview 1.png" alt="bin">
                  `;
  if (item.link != "") {
    note.innerHTML = `
                          <div class = "note-text">Note</div>
                          <div class = "input-note-text"> ${item.note} </div>
                          <a class = "link-text" href="${item.link}">Link to ${item.title}</a>
                      `;
  } else {
    note.innerHTML = `
                          <div class = "note-text" style= "height : 120 ";>Note</div>
                          <div class = "input-note-text"> ${item.note} </div>
                      `;
  }
  taskItem.innerHTML = `
                      <button class = "check-task" onclick = "checkTask(event,${i})">
                          <div id = "checkMark${i}" class = "checkMark"></div>
                      </button>
                      <span id="taskName${i}" class="taskName">${item.title}</span>
                      <span id="taskDueDate${i}" class = "taskDueDate">${item.due_date}</span>
                  `;
  oneRow.appendChild(taskItem);
  oneRow.appendChild(bin);
  taskList.appendChild(oneRow);
  taskList.appendChild(note);
  taskItem.addEventListener("click", () => {
    clickTask(i);
  });
  bin.addEventListener("click", () => {
    deleteTask(item.item_id);
  });
};

function checkTask(event,idx){
  let x = document.getElementById("checkMark"+idx);
  let y = document.getElementById("taskName"+idx);
  console.log(x.style.display);
  event.stopPropagation();
  if (x.style.display != "flex" || x.style.display == null) {
      x.style.display = "flex";
      y.style.textDecoration = "line-through";
  } else {
      x.style.display = "none";
      y.style.textDecoration = "none";
  }
}
function clickTask(idx){
  let note = document.getElementById("note"+idx);
  let bin = document.getElementById("bin"+idx);
  console.log(bin.style.display)
  if(note.style.display != 'flex' || note.style.display == null) {
      note.style.display = 'flex';
      bin.style.visibility = 'visible';
  } else {
      note.style.display = 'none';
      bin.style.visibility = 'hidden';
  }
}

function deleteTask(item_id){
  deleteItem(item_id);
}

// TODO #2.5: Send Add an item ("POST") request to backend server and update items in the table
const addItem = async () => {
  const taskInput = document.getElementById('title');
  const taskDueDate = document.getElementById('dueDate');
  const taskNote = document.getElementById('note');
  const taskLink = document.getElementById('link')
  const taskCategory = document.getElementById('selectCategory');
  const newCategory = document.getElementById('addCategory');
  let cg =  taskCategory.value;
  if (taskInput.value.trim() === '') return;
  if (taskDueDate.value.trim() === '') return;
  if (cg == "other"){
    cg = newCategory.value;
  }
  const itemToAdd = {
    title: taskInput.value,
    category: cg,
    due_date: taskDueDate.value,
    note: taskNote.value,
    link: taskLink.value,
    user_name: "knot"
  }
  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(itemToAdd)
  }
  await fetch(`http://${backendIPAddress}/items`, options)
    .then((response) => {
      document.getElementById('title').value = "";
      document.getElementById('dueDate').value = "";
      document.getElementById('note').value = "";
      document.getElementById('link').value = "";
      document.getElementById('selectCategory').value = 0;
      document.getElementById('addCategory').value = "";
    })
    .catch((error) => console.error(error));

  await getItemsFromDB();
  cleartask();
  showItemsInList(itemsData);
};

function cleartask(){
  taskList.innerHTML = "";
}

// TODO 2.6: Send Delete an item ("DELETE") request to backend server and update items in the table
const deleteItem = async (item_id) => {
  const options = {
    method: "DELETE",
    credentials: "include"
  }
  await fetch(`http://${backendIPAddress}/items/${item_id}`, options)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => console.error(error));

  await getItemsFromDB();
  cleartask();
  showItemsInList(itemsData);
};

const redrawDOM = () => {
  window.document.dispatchEvent(
    new Event("DOMContentLoaded", {
      bubbles: true,
      cancelable: true,
    })
  );
  document.getElementById("task-to-add").value = "";
  document.getElementById("category-to-add").value = 0;
  document.getElementById("dueDate-to-add").value = "";
};

//document.getElementById("group-no").innerHTML = getGroupNumber();

document.addEventListener("DOMContentLoaded", async function (event) {
  //console.log("Showing Categories.");
  //await showCategories();
  console.log("Showing items from database.");
  await getItemsFromDB();
  showItemsInList(itemsData);
});
