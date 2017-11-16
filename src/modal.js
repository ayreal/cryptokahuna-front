let modal = document.querySelector(".modal");
let logout = document.querySelector("#logout");

function closeModal() {
  modal.className = "modal";
}

function openModal() {
  modal.className = "modal is-active";
}

modal.addEventListener("click", e => {
  if (e.target.className === "button is-warning") {
    console.log("submit");
    // user find or create by Name
    closeModal();
  } else if (e.target.className === "modal-close is-large") {
    console.log("fire close modal callback and create new user");
    closeModal();
  }
});

logout.addEventListener("click", e => {
  // reset global user
  // let user = {};
  openModal();
});
