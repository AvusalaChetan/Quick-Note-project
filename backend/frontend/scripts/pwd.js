const passwordField = document.querySelector("#password");
const showpassword = document.querySelector(".showpassword");
showpassword.addEventListener("click", (e) => {
  if (showpassword.checked == true) {
    passwordField.type = "text";
  } else {
    passwordField.type = "password";
  }
});
