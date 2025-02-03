const server = "http://192.168.0.1:3000";

function processLogin() {
  window.location.href = "chat.html";
}

function login(username, password) {
  fetch(
    `${server}/login?${new URLSearchParams({
      username,
      password,
      token: "a",
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
        processLogin();
      } else {
        window.alert("Username or Password incorrect!");
      }
    }) // waits for response then prints to log
    .catch((err) => console.error(err));
}

window.onload = () => {
  const loginButton = document.getElementById("loginBtn");
  loginButton.addEventListener("click", (event) => {
    login(
      document.getElementById("usrname").value,
      document.getElementById("pswrd").value
    );
  });
};

function enryptPassword(password) {
  if (password != null) {
    password = "Encrypted" + password;
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
