
const userEmail = document.querySelector("#detailEmail");
const avatarInitial = document.querySelector('#avatarInitial');
const userName = document.querySelector("#detailName");
const accCreatedAt = document.querySelector("#AccCreatedAt");
const userNotExist = document.querySelector("#profile-details");

const replace = (user) => {
  if(!user)  userNotExist.innerHTML = ` <div id="userNotExist">
  user not exits go to login page 
  <a href="/html/login.html">login</a>
  </div>`;
;
 userEmail.textContent = user.email;
 avatarInitial.textContent = user?.email?.charAt(0) || 'U';
 userName.textContent = user.name;
 accCreatedAt.textContent = (user.createdAt).split("T")[0];
 };

const getUser = async () => {
  const res = await fetch("/profile", {method: "GET"});
  const data = await res.json();
  const {user} = data;
  replace(user);

  console.log(user);
};

getUser();
