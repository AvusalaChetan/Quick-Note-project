const userEmail = document.querySelector("#userEmail");
const avatarInitial = document.querySelector('#avatarInitial');

const replace = (user) => {
 userEmail.textContent = user.email;
 avatarInitial.textContent = user.email.charAt(0)
 };

const getUser = async () => {
  const res = await fetch("/profile", {method: "GET"});
  const data = await res.json();
  const {user} = data;
  replace(user);
  console.log(user.email);
};

getUser();
