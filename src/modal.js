let modal = document.querySelector(".modal");
function closeModal() {
  modal.className = "modal";
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
