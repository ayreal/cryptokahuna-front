const modal = document.querySelector(".modal");
let logout = document.querySelector("#logout");

function closeModal() {
  modal.className = "modal";
}

function openModal() {
  modal.className = "modal is-active";
}

// listens for clicks on login and either logs them in, gives an error, or creates a user
modal.addEventListener("click", e => {
  if (e.target.className === "button is-warning") {
    const cryptokey = e.path[2].firstElementChild.querySelector("input").value;
    fetchUsers(cryptokey);
  } else if (e.target.id === "new-user") {
    newUser()
  }
});

logout.addEventListener("click", e => {
  // reset global user
  // let user = {};
  openModal();
});
function newUser() {
  // prevents duplicate renders
  if (!document.getElementById("new-user-input")) {
    renderNewUserForm();
  }
}

//// refactor this with .innerHTML?
function renderNewUserForm() {
  const loginBox = document.querySelector("body > div > div.modal-content > nav > div > div");
  const newUserDiv = document.createElement("div");
  const newUserButton = document.createElement("button");
  newUserDiv.id = "new-user-input";
  newUserDiv.innerText = "Enter a username: ";
  newUserDiv.innerHTML += '<input class="input" id="new-username" size="10" type="text" placeholder="Enter Username">';
  //// style this button
  newUserButton.innerText = "submit";
  newUserButton.addEventListener("click", e => {
    createUser()
  })
  newUserDiv.appendChild(newUserButton);
  loginBox.append(newUserDiv);
}

function createUser() {
  const username = document.getElementById('new-username').value;
  const cryptokey = generateCryptokey();

  fetch("https://crypto-kahuna-api.herokuapp.com/api/v1/users/", {
    method: "POST",
    body: JSON.stringify({ 
      name: username, 
      cash: 10000,
      cryptokey: cryptokey
     }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  // .then(resp => createPortfolio());

  displayCryptokey(username, cryptokey);
}

function displayCryptokey(username, cryptokey) {
  // remove new user divs
  document.getElementById("new-user-input").remove();
  document.getElementById("new-user-line").remove();
  const loginBox = document.querySelector("body > div > div.modal-content > nav > div > div");
  // welcome new user
  const welcomeDiv = document.createElement('div');
  welcomeDiv.innerHTML = ` Welcome ${username}! Your cryptokey is:<br><b>${cryptokey}</b><br>Don't lose this! This will be how you log in moving forward. Give it a try by entering it above.`;
  loginBox.appendChild(welcomeDiv);
}

function closeModal() {
  modal.className = "modal";
}

function fetchUsers(cryptokey) {
  //// is this const users declaration necessary??
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
    fetchPortfolios(userId);
    console.log("user is " + user.name);
  // else, give an error and clear the text field
  } else {
    invalidCryptokey();
    clearCryptokeyTextField();
    $('#wrong-cryptokey').delay(4000).fadeOut();
  }
}

// displays an "invalid cryptokey" div
function invalidCryptokey() {
  console.log("hello test")
  console.log(TEST)
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
