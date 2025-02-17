const server = "http://192.168.2.55:3000";
const envPass = process.env.PASSWORD;
const envToken = process.env.TOKEN;
const loginButton = document.getElementById("loginBtn");

function processLogin() {
  console.log("hello from processLogin");
  window.location.href = "chat.html";
}

function login(username, password) {
  console.log(`Running login: fetching ${server}/login`);
  loginButton.disabled = true;
  fetch(
    `${server}/login?${new URLSearchParams({
      username,
      password,
      token: envToken,
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
        processLogin();
      } else {
        window.alert("Username or Password incorrect!");
        loginButton.disabled = false;
      }
    }) // waits for response then prints to log
    .catch((err) => console.error(err));
}

window.onload = () => {
  const loginForm = document.getElementById("loginForm");
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
