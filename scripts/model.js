// Profile Model
const profileBtn = document.querySelector("#profile-link");
profileBtn.addEventListener("click", async () => {
  await createProfileModal();
});
async function createProfileModal() {
  const existingModel = document.querySelector("#profile-modal");
  if (existingModel) {
    existingModel.remove();
    return;
  }
  const getUserResponse = await fetch("http://localhost:5000/users/user", {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
    credentials: "include",
  });
  const { user } = await getUserResponse.json();
  // console.log(user);
  const profileModalContainer = document.createElement("div");
  profileModalContainer.classList.add("modal", "fade");
  profileModalContainer.id = "profile-modal";
  profileModalContainer.tabIndex = "-1";
  profileModalContainer.setAttribute("aria-labelledby", "profile-modal");
  profileModalContainer.style.display = "block";
  profileModalContainer.style.paddingRight = "1px";
  profileModalContainer.setAttribute("aria-modal", "true");

  const modalDialog = document.createElement("div");
  modalDialog.classList.add(
    "modal-dialog",
    "modal-dialog-centered",
    "modal-dialog-scrollable"
  );
  modalDialog.id = "profile-model-dialog";

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content", "bg-altgrey", "text-white");

  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");

  const modalTitle = document.createElement("h5");
  modalTitle.classList.add("modal-title");
  modalTitle.id = "profile-modal-title";
  modalTitle.textContent = "Profile";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.classList.add("btn-close");
  closeButton.setAttribute("data-bs-dismiss", "modal");
  closeButton.setAttribute("aria-label", "Close");
  closeButton.addEventListener("click", (e) => {
    closeProfile(profileModalContainer);
  });

  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);

  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");
  modalBody.innerHTML = `
  <img src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg"
 alt="User Image" height="200" class="profile-modal-image"/>
    <h6>Username:${user.username}</h6>
    <h6>Email:${user.email}</h6>
    <h6>Phone Number:${user.phoneNumber}</h6>
`;

  const modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-footer");

  const saveChangesButton = document.createElement("button");
  saveChangesButton.type = "button";
  saveChangesButton.classList.add("btn", "btn-altDanger", "text-white");
  saveChangesButton.textContent = "Save changes";

  //   modalFooter.appendChild(closeButtonSecondary);
  modalFooter.appendChild(saveChangesButton);

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);

  modalDialog.appendChild(modalContent);
  profileModalContainer.appendChild(modalDialog);

  document.body.appendChild(profileModalContainer);
  const profile = new bootstrap.Modal(profileModalContainer);
  profile.show();
}

function closeProfile(profileModalContainer) {
  if (profileModalContainer) {
    const profile = new bootstrap.Modal(profileModalContainer);
    profile.hide();
  }
  return;
}
