const navProfileButton = document.getElementById("nav-profile-button");
const profileMenu = document.getElementById("profile-menu");

navProfileButton?.addEventListener("click", (e) => {
  e.stopPropagation();
  profileMenu?.classList.toggle("hidden");
});

document.addEventListener("click", () => {
  profileMenu?.classList.add("hidden");
});
