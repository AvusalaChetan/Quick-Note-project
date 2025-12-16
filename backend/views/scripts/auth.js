const submit = document.querySelector("#submit");
const form = document.querySelector("form");
const holeContailer = document.querySelector(".hole-contailer");

  const isLoginPage = window.location.pathname.includes("login") || '/';
  console.log(window.location.pathname,isLoginPage)
  let url ;

isLoginPage? url  = "/auth/login": url = "/auth/signup"

async function fetchFunction(e) {
  e.preventDefault();
  const name = document.querySelector("#username")?.value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      const success = document.createElement("p");
      success.innerHTML = `<h4 class="success">${data.message} </h4>`;
      holeContailer.appendChild(success);
      window.location.href = "./html/home.html";
    } else {
      const error = document.createElement("p");
      error.innerHTML = `<h4 class="error">${data.message} </h4>`;
      holeContailer.appendChild(error);
    }
  } catch (err) {
    console.error("Error:", err.message);
    const error = document.createElement("p");
    error.innerHTML = `<h4 class="error">${data.message} </h4>`;
    holeContailer.appendChild(error);
  }
}
form.addEventListener("submit", fetchFunction);
