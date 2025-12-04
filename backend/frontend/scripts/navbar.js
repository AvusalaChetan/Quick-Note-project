import {addNavbar} from "./addnav.js";
const pathname = window.location.pathname;
const presentLocation = pathname.includes("home") || pathname.includes("notes");
const navbarContainer = document.getElementsByClassName("navbar-container")[0];

const getCookies = async () => {
  try {
    const res = await fetch("/home", {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (data.cookieExist) {
      await addNavbar();
      const logoutBtn = document.querySelector("#logoutBtn");

      if (logoutBtn) {
        logoutBtn.addEventListener("click", async (e) => {
          try {
            const res = await fetch("/auth/logout", {
              method: "GET",
              credentials: "include",
            });
            if (res.ok) {
             window.location.href = "./login.html";
            }
          } catch (error) {
            console.log(error.message);
          }
        });
      }
    } else {
      navbarContainer.innerHTML = `
        <div class="navbar">
          <h1>Notes App</h1>
          <nav>
            <a href="./login.html">Login</a>
            <a href="./signup.html">Sign Up</a>
          </nav>
        </div>
      `;
    }
  } catch (error) {
    console.log(error.message);
  }
};

getCookies();
