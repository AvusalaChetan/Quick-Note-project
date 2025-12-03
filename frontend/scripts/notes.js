const noteCount = document.querySelector("#noteCount");
const notesGrid = document.querySelector("#notesGrid");
const emptyState = document.querySelector("#emptyState");
const noteForm = document.querySelector("#noteForm");
const noteModal = document.querySelector("#noteModal");
const tostStyle = {
  padding: "12px 24px",
  fontSize: "14px",
  borderRadius: "8px",
};
let notes = [];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const showAllNotes = (data) => {
  notes = data;
  noteCount.textContent = data.length;

  if (data.length === 0) {
    notesGrid.innerHTML = "";
    emptyState.classList.add("show");
    return;
  }

  emptyState.classList.remove("show");

  notesGrid.innerHTML = data
    .map(
      (note) => `
      <div class="note-card" data-id="${note._id}">
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <div class="note-card-footer">
          <span class="note-date">${formatDate(note.createdAt)}</span>
          <div class="note-actions">
            <button class="btn-edit" onclick="editNote('${
              note._id
            }')" title="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
</button>
            <button class="btn-download" onclick="downloadNote('${
              note._id
            }')" title="Download"><span class="material-symbols-outlined">
download
</span></button>
            <button class="btn-delete" onclick="deleteNote('${
              note._id
            }')" title="Delete">delete</button>
          </div>
        </div>
      </div>
    `
    )
    .join("");
};

const getAllNotes = async () => {
  try {
    const res = await fetch("/note", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    showAllNotes(data.notes || data);
  } catch (error) {
    console.log(error.message);
  }
};

// Download note
window.downloadNote = (id) => {
  const note = notes.find((n) => n._id === id);
  if (note) {
    const blob = new Blob([`${note.title}\n\n${note.content}`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
};

// Delete note
window.deleteNote = async (id) => {
  if (!confirm("you want to Delete this note?")) return;

  try {
    const res = await fetch(`/note/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      getAllNotes();
    }
  } catch (error) {
    console.log(error.message);
  }
};

const closeModalBtn = document.querySelector("#closeModal");
const createNoteBtn = document.querySelector("#createNoteBtn");
const createFirstNote = document.querySelector("#createFirstNote");
// Open modal for NEW note
const openNewNoteModal = () => {
  noteForm.reset(); // Clear form
  delete noteModal.dataset.editId; // No edit ID = create mode
  noteModal.classList.add("show"); // Open modal
};

createNoteBtn?.addEventListener("click", openNewNoteModal);
createFirstNote?.addEventListener("click", openNewNoteModal);

closeModalBtn?.addEventListener("click", () => {
  noteModal.classList.remove("show");
  noteForm.reset();
  delete noteModal.dataset.editId;
});

window.editNote = (id) => {
  const note = notes.find((n) => n._id === id);
  if (note) {
    // Fill modal inputs
    document.querySelector("#noteTitle").value = note.title;
    document.querySelector("#noteContent").value = note.content;
    noteModal.classList.add("show");
    noteModal.dataset.editId = id;
  }
};

// Add form submit handler
noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.querySelector("#noteTitle").value;
  const content = document.querySelector("#noteContent").value;
  const editId = noteModal.dataset.editId;

  const url = editId ? `/note/${editId}` : "/note";
  const method = editId ? "PATCH" : "POST";
  try {
    const res = await fetch(url, {
      method: method,
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({title, content}),
    });

    const data = await res.json();

    if (res.ok) {
      noteModal.classList.remove("show");
      noteForm.reset();
      delete noteModal.dataset.editId;
      getAllNotes();

      Toastify({
        text: editId ? "Note updated!" : "Note created!",
        backgroundColor: "#4caf50",

        style: {
          ...tostStyle,
        },
      }).showToast();
    } else {
      Toastify({
        text: data.message || "Failed to save note",
        backgroundColor: "#f44336",
        style: {
          ...tostStyle,
        },
      }).showToast();
    }
  } catch (error) {
    Toastify({
      text: "Something went wrong!",
      backgroundColor: "#f44336",
      style: {
        ...tostStyle,
      },
    }).showToast();
  }
});

const searchInput = document.querySelector("#searchInput");

searchInput?.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  filterNotes(searchTerm);
});
const filterNotes = (searchTerm) => {
  if (searchTerm === "") {
    showAllNotes(notes);
    return;
  }

  const filtered = notes.filter((note) => {
    const titleMatch = note.title.toLowerCase().includes(searchTerm);
    const contentMatch = note.content.toLowerCase().includes(searchTerm);
    return titleMatch || contentMatch;
  });

  showAllNotes(filtered);
};

getAllNotes();
