const server = "http://192.168.68.115:3000";
let loginButton;

function processLogin(displayName) {
  localStorage.setItem("displayName", displayName);
  window.location.href = "chat.html";
}

function signup(username, password) {
  fetch(
    `${server}/signup${new URLSearchParams({
      username,
      password,
    })}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Content-Type-Options": "nosniff",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  )
    .then((res) => {
      console.log("received response");
      if (res.ok) {
        res.json().then(() => {
          window.location.href = "chat.html";
        });
      } else {
        return console.log("Could not signup");
      }
    })
    .catch((err) => console.error(err));
}

function login(username, password) {
  loginButton.disabled = true;
  fetch(
    `${server}/login?${new URLSearchParams({
      username,
      password,
    })}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Content-Type-Options": "nosniff",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  )
    .then((res) => {
      if (res.ok) {
        res.json().then((account) => {
          processLogin(account.displayName);
        });
      } else {
        window.alert("Username or Password incorrect!");
        loginButton.disabled = false;
      }
    })
    .catch((err) => console.error(err));
}

window.onload = () => {
  const loginForm = document.getElementById("loginForm");
  loginButton = document.getElementById("loginBtn");
  signupButton = document.getElementById("signupBtn");

  signupButton.addEventListener("click", (event) => {
    event.preventDefault();
    signup(
      document.getElementById("usrname").value,
      document.getElementById("pswrd").value
    );
  });

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    login(
      document.getElementById("usrname").value,
      document.getElementById("pswrd").value
    );
  });
};

function enryptPassword(password) {
  if (password != null) {
    password = "$" + password + "$";
    return password;
  } else {
    console.warn("Password not provided");
  }
}

function decryptPassword(password) {
  if (password != null) {
    password = password;
    return password;
  } else {
    console.warn("Password not provided");
  }
}
