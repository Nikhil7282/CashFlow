const accessToken = sessionStorage.getItem("accessToken");
if (accessToken) {
  window.location.href =
    "http://127.0.0.1:5500/Nikhil/CashFlow/pages/dashboard.html";
}
const registerButton = document.getElementById("register");

registerButton.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const myToast = new bootstrap.Toast(document.querySelector("#signUpToast"));
    let message = document.querySelector(".toastContent");
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("confirmPassword").value;
    if (
      username == "" ||
      email == "" ||
      password == "" ||
      passwordConfirm == "" ||
      phoneNumber == ""
    ) {
      message.innerHTML = "Please fill all the fields";
      myToast.show();
      return;
    }
    if (password !== passwordConfirm) {
      message.innerHTML = "Passwords do not match";
      myToast.show();
      return;
    } else {
      const signUpRes = await fetch("http://localhost:5000/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          phoneNumber: phoneNumber,
          password: password,
        }),
      });

      const result = await signUpRes.json();
      //   console.log(result);

      if (signUpRes.status === 200) {
        message.innerHTML = result.message;
        myToast.show();
        setTimeout(() => {
          window.location.href =
            "http://127.0.0.1:5500/Nikhil/CashFlow/pages/login.html";
        }, 1000);
        return;
      }
      message.innerHTML = result.message;
      myToast.show();
    }
  } catch (error) {
    console.log(error);
    message.innerHTML = error;
    myToast.show();
  }
});
