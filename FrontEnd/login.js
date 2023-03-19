const form = document.querySelector(".login");
const errorLogin = document.createElement("span");
errorLogin.classList.add("wrongid");
const returnLine = document.createElement("br");

// authentification of the user by taking the mail and password value and using fetch so we get back the login token
async function authentification() {
  let user = {
    email: document.getElementById("mail").value,
    password: document.getElementById("password").value,
  };

  let response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  });

  let data = await response.json();
  sessionStorage.setItem("token", data.token);
  let storedToken = sessionStorage.getItem("token");

  if (storedToken != "undefined") {
    window.location = "http://127.0.0.1:5500/FrontEnd/index.html";
  } else {
    console.log("wrong id");

    errorLogin.innerText = "E-mail ou mot de passe invalide !";
    form.appendChild(returnLine);
    form.appendChild(errorLogin);
    errorLogin.style.textAlign = "center";
  }
}

////////////Evenement click button "Se connecter/////////////////
function loginEvent(e) {
  e.preventDefault();
  console.log("event");
  authentification();
}

const loginButton = document.getElementById("login");
loginButton.addEventListener("click", loginEvent);

//sophie.bluel@test.tld
//S0phie
