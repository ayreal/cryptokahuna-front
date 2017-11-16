let modal = document.querySelector(".modal");

// listens for clicks on login and either logs them in, gives an error, or creates a user
modal.addEventListener("click", e => {
  if (e.target.className === "button is-warning") {
    const cryptokey = e.path[2].firstElementChild.querySelector("input").value;
    fetchUsers(cryptokey);
  } else if (e.target.id === "new-user") {
    // ask for a username
    // create a new User (post to api)
    // return their cryptokey
  }
});

function closeModal() {
  modal.className = "modal";
}

function fetchUsers(cryptokey) {
  const users = fetch("https://crypto-kahuna-api.herokuapp.com/api/v1/users/")
    .then(resp => resp.json()) // converts reponse to json
    .then(json => { user = findUser(json, cryptokey) });
}

function findUser(users, cryptokey) {
  const user = users.find(function(user) {
    return user.cryptokey === cryptokey;
  }, cryptokey)
  // if user exists, sets them as userId and close the modal
  if (user) {
    userId = user.id;
    closeModal()
    fetchUser(user.id);
    console.log("user is " + user.name);
  // else, give an error and clear the text field
  } else {
    invalidCryptokey();
    clearCryptokeyTextField();
    $('#wrong-cryptokey').delay(5000).fadeOut();
  }
}

// displays an "invalid cryptokey" div
function invalidCryptokey() {
  const loginBox = document.querySelector("body > div > div.modal-content > nav > div > div");
  const error = document.createElement("div");
  error.id = "wrong-cryptokey";
  error.style.backgroundColor = "#DE2823";
  error.innerText = "Invalid Cryptokey";
  error.style.color = "white";
  loginBox.prepend(error);
}

function clearCryptokeyTextField() {
  const textBox = document.querySelector("body > div > div.modal-content > nav > div > div > div.field.has-addons > div:nth-child(1) > input")
  textBox.value = "";
}

function generateCryptokey() {
  var cryptokey = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()-=_+?/{}[]:;,.|"

  for (var i = 0; i < 32; i++)
    cryptokey += characters.charAt(Math.floor(Math.random() * characters.length));

  return cryptokey;
}