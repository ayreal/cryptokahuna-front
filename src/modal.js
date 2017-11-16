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
  // if user exists, set them as userId and closeModal()
  if (user) {
    userId = user.id;
    console.log("user is: " + user.name);
  } else {
    // else, give an error
    console.log("invalid cryptokey");
  }
}

function generateCryptokey() {
  var cryptokey = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()-=_+?/{}[]:;,.|"

  for (var i = 0; i < 32; i++)
    cryptokey += characters.charAt(Math.floor(Math.random() * characters.length));

  return cryptokey;
}