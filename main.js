let selectedNote = null;

function saveNote() {
    let content = document.getElementById("textAreaContent").value;
    let timestamp = document.getElementById("textAreaContent").getAttribute("data-timestamp");
    let errorMsg = document.getElementById("errorMsg");

    if (content.length < 5) {
        errorMsg.textContent = "The minimum number of characters is 5";
        return;
    } else {
        errorMsg.textContent = "";
    }

    if (content.length > 500) {
        errorMsg.textContent = "The maximum number of characters is 500";
        return;
    } else {
        errorMsg.textContent = "";
    }

    if (timestamp) {
        localStorage.setItem("nota_" + timestamp,  content);
    } else {
        timestamp = Date.now();
        localStorage.setItem("nota_" + timestamp, content);
    }

    updateList();

    document.getElementById("textAreaContent").value = "";
    document.getElementById("textAreaContent").removeAttribute("data-timestamp");
}

function updateList() {
    let list = document.getElementById("noteList");
    list.innerHTML = "";

    for (let i = 0;i < localStorage.length; i++) {
        let clave = localStorage.key(i);
        if (clave.startsWith("nota_")) {
            let content = localStorage.getItem(clave);
            let timestamp = clave.split("_")[1];
            let li = document.createElement("li");
            li.className = "noteItem";
            li.textContent = content;
            li.setAttribute("data-timestamp", timestamp);
            li.addEventListener("click", function () {
                if (selectedNote) {
                    selectedNote.classList.remove("selected");
                }
                this.classList.remove("selected");
                selectedNote = this;
                showEdit();
            });
            list.appendChild(li);
        }
    }
}

function showEdit() {
    let editArea = document.getElementById("editArea");
    editArea.style.display = "block";
    let selectedTimestamp = selectedNote.getAttribute("data-timestamp");
    let selectedContent = localStorage.getItem("nota_" + selectedTimestamp);
    document.getElementById("editContent").value = selectedContent;
}

function hideEdit() {
    let editArea = document.getElementById("editArea");
    editArea.style.display = "none";
}

function updateNote() {
    let content = document.getElementById("editContent").value;
    // let errorDown = document.getElementById("errorDown");
    if (content.length > 5 && content.length < 500) {
        let newContent = document.getElementById("editContent").value;
        let selectedTimestamp = selectedNote.getAttribute("data-timestamp");
        localStorage.setItem("nota_" + selectedTimestamp, newContent);
        hideEdit();
        updateList();
    } else {
        // return;
    }
}

function deleteNote() {
    let selectedTimestamp = selectedNote.getAttribute("data-timestamp");
    localStorage.removeItem("nota_" + selectedTimestamp);
    hideEdit();
    updateList();
}

window.onload = function () {
    updateList();
};

document.getElementById("saveBtn").addEventListener("click", saveNote);

document.getElementById("searchInput").addEventListener("input", function () {
    let searchTerm = this.value.toLowerCase();
    let notes = document.querySelectorAll(".noteItem");
    notes.forEach(function (note) {
        let content = note.textContent.toLowerCase();
        if (content.includes(searchTerm)) {
            note.style.display = "block";
        } else {
            note.style.display = "none";
        }
    });
});

document.getElementById("updateButton").addEventListener("click", updateNote);
document.getElementById("deleteButton").addEventListener("click", deleteNote);
document.getElementById("cancelButton").addEventListener("click", hideEdit);
