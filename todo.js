import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import {
  getFirestore,
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

// Import the functions you need from the SDKs you need
// import { initializeApp } from "/firebase-app";
// import { doc, setDoc } from "/firebase-firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function storeItem(content, complete) {
  let raw = await getDoc(doc(db, "todos", "todoID"));
  let newID = raw.data().currentID + 1;

  await setDoc(doc(db, "todos", "todoID"), {
    currentID: newID,
  });

  await setDoc(doc(db, "todos", `todo${newID}`), {
    content: content,
    complete: complete,
  });
}

/* ------------------------------ */

let addToDo = document.getElementById("add-to-do");
let closeButton = document.getElementById("close");
let checkButton = document.getElementById("check");
let allButton = document.getElementById("all-button");
let activeButton = document.getElementById("active-button");
let completedButton = document.getElementById("completed-button");

addToDo.addEventListener("click", showAddItem);
closeButton.addEventListener("click", closeAddItem);
checkButton.addEventListener("click", addItem);
allButton.addEventListener("click", loadItems);
activeButton.addEventListener("click", () => displayFiltered(event, 0));
completedButton.addEventListener("click", () => displayFiltered(event, 1));

function showAddItem() {
  let input = document.getElementById("item-input");
  let inputBox = document.getElementById("item-text");
  input.style.opacity = 100;
  inputBox.focus();
}

function closeAddItem() {
  let input = document.getElementById("item-input");
  input.style.opacity = 0;

  let inputBox = document.getElementById("item-text");
  inputBox.value = "";
}

async function itemChecked() {
  if (event.target.checked) {
    event.target.nextSibling.classList.add("complete");

    await setDoc(
      doc(db, "todos", event.target.parentElement.parentElement.id),
      {
        complete: 1,
      },
      { merge: true }
    );
  } else {
    event.target.nextSibling.classList.remove("complete");

    await setDoc(
      doc(db, "todos", event.target.parentElement.parentElement.id),
      {
        complete: 0,
      },
      { merge: true }
    );
  }

  countItems();
}

async function removeItem() {
  event.target.parentElement.parentElement.remove();

  await deleteDoc(
    doc(db, "todos", event.target.parentElement.parentElement.id)
  );

  countItems();
}

async function addItem(e, loading = false, itemLoading = "") {
  let textboxContent = "default";
  let obj;

  if (!loading) {
    textboxContent = document.getElementById("item-text").value;
  } else {
    let data = await getDoc(doc(db, "todos", itemLoading));
    obj = data.data();
    textboxContent = obj.content;
  }

  // Create elements.
  let container = document.createElement("div");
  let checkboxButtonContainer = document.createElement("div");
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  let toDoContent = document.createElement("p");
  let trashIconContainer = document.createElement("div");
  let trashIcon = document.createElement("i");

  // Add classes.
  container.classList.add("to-do");
  checkboxButtonContainer.classList.add("checkbox-button");
  checkbox.classList.add("checkbox");
  trashIcon.classList.add("gg-trash");
  trashIcon.classList.add("trash-icon");

  // Add event listeners.
  checkbox.addEventListener("click", itemChecked);
  trashIcon.addEventListener("click", removeItem);

  // Add content.
  toDoContent.textContent = textboxContent;

  // Append children to parents.
  checkboxButtonContainer.appendChild(checkbox);
  checkboxButtonContainer.appendChild(toDoContent);

  trashIconContainer.appendChild(trashIcon);

  container.appendChild(checkboxButtonContainer);
  container.appendChild(trashIconContainer);

  let toDoContainer = document.getElementById("to-dos-container");

  toDoContainer.appendChild(container);

  if (!loading) {
    let raw = await getDoc(doc(db, "todos", "todoID"));
    let todoID = raw.data().currentID;

    container.setAttribute("id", `todo${todoID + 1}`);

    storeItem(textboxContent, 0).then(() => countItems());
  } else {
    container.setAttribute("id", itemLoading);

    // let obj = JSON.parse(localStorage.getItem("todos"));

    if (obj.complete == 1) {
      toDoContent.classList.add("complete");
      checkbox.checked = true;
    }
  }

  closeAddItem();
  countItems();
}

async function loadItems() {
  removeAllItems();

  let selected = document.getElementsByClassName("filter-button-selected");

  if (selected.length != 0)
    selected[0].classList.remove("filter-button-selected");

  let allButton = document.getElementById("all-button");

  allButton.classList.add("filter-button-selected");

  let data = await getDocs(collection(db, "todos"));

  if (data.docs.length > 0)
    data.forEach((doc) => {
      if (doc.id != "todoID") {
        addItem("", true, doc.id);
      }
    });
}

async function countItems() {
  let countElement = document.getElementById("items-left");
  // let obj = JSON.parse(localStorage.getItem("todos"));
  let itemsLeft = 0;

  let data = await getDocs(collection(db, "todos"));

  data.docs.forEach((doc) => {
    if (doc.id != "todoID" && doc.data().complete == 0) itemsLeft++;
  });

  itemsLeft != 0
    ? (countElement.textContent = `Items left: ${itemsLeft}`)
    : (countElement.textContent = `All items complete!`);
}

async function displayFiltered(e, complete) {
  let selected = document.getElementsByClassName("filter-button-selected");

  if (selected.length != 0)
    selected[0].classList.remove("filter-button-selected");

  e.target.classList.add("filter-button-selected");

  removeAllItems();

  let data = await getDocs(collection(db, "todos"));

  data.docs.forEach((doc) => {
    if (doc.id != "todoID" && doc.data().complete == complete) {
      addItem("", true, doc.id);
    }
  });
}

function removeAllItems() {
  let container = document.getElementById("to-dos-container");

  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

loadItems();
