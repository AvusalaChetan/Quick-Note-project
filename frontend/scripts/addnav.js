export const addNavbar = async () => {
  const navbarContainer = document.querySelector(".navbar-container");
  
  if (!navbarContainer) {
    console.error("navbar-container element not found");
    return;
  }

  try {
    const res = await fetch("./navbar.html", {
      method: "GET",
    });
    const data = await res.text();
    navbarContainer.innerHTML = data;
  } catch (error) {
    console.error(error.message);
  }
};


