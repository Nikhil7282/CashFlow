const accessToken = sessionStorage.getItem("accessToken");
const myToast = new bootstrap.Toast(document.querySelector(".toast"));
let message = document.querySelector(".toastContent");
if (accessToken) {
  window.location.href =
    "http://127.0.0.1:5500/Nikhil/CashFlow/pages/dashboard.html";
} else {
  refreshToken();
}
async function refreshToken() {
  try {
    const refreshTokenResponse = await fetch(
      "http://localhost:5000/users/refreshToken",
      {
        method: "GET",
        credentials: "include",
      }
    );

    const refreshTokenResult = await refreshTokenResponse.json();
    if (refreshTokenResponse.status === 200 && refreshTokenResult.accessToken) {
      sessionStorage.setItem("accessToken", refreshTokenResult.accessToken);
      return;
    } else {
      return;
    }
  } catch (error) {
    console.log(error);
    window.location.href =
      "http://127.0.0.1:5500/Nikhil/CashFlow/pages/login.html";
  }
}
let loginBtn = document.querySelector("#login-btn");
// let forgetPassword = document.querySelector("#forgotPassword");

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    if (username == "" || password == "") {
      message.textContent = "Please fill all the fields";
      myToast.show();
      return;
    } else {
      let data = await Promise.race([
        fetch("http://localhost:5000/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: username, password: password }),
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Network Error")), 5000)
        ),
      ]);
      let result = await data.json();
      // console.log(data);
      if (data.status === 200) {
        message.textContent = result.message;
        myToast.show();
        sessionStorage.setItem("accessToken", result.accessToken);
        window.location.href =
          "http://127.0.0.1:5500/Nikhil/CashFlow/pages/dashboard.html";
        return;
      }
      message.textContent = result.message;
      myToast.show();
    }
  } catch (error) {
    console.log(error);
    message.textContent = error;
    myToast.show();
  }
});
