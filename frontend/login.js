const server = "http://192.168.2.55:3000";
let loginButton;

function processLogin(displayName) {
  localStorage.setItem("displayName", displayName);
  window.location.href = "chat.html";
}

function login(username, password) {
  console.log(`Running login: fetching ${server}/login`);
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
      console.log("received response");
      if (res.ok) {
        res.json().then((account) => {
          processLogin(account.displayName);
        });
      } else {
        window.alert("Username or Password incorrect!");
        loginButton.disabled = false;
      }
    }) // waits for response then prints to log
    .catch((err) => console.error(err));
}

window.onload = () => {
  const loginForm = document.getElementById("loginForm");
  loginButton = document.getElementById("loginBtn");

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
