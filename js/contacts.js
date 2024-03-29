// let contacts = []; <--- Moved to arrays.js
let contactList = [];
let contactLetterGroup = [];


/**
 * Initializes the contact page by loading user data, generating header and sidebar, sorting contacts, and loading contacts.
 */
async function init() {
  await loadUserData();
  await generateHeader(userInitials);
  await generateSidebar();  
  sortContacts();
  loadContacts();
}


/**
 * Loads contacts by initializing the contact list, grouping names, and rendering the contact list.
 */
function loadContacts() {
  contactList = [];
  groupNames();
  renderContactList();
}


/**
 * Renders the contact list by populating the contact list container with categorized contacts.
 */
function renderContactList() {
  let contactListComplete = document.getElementById("contact-list-container");
  contactListComplete.innerHTML = "";
  for (let i = 0; i < contactList.length; i++) {
    const letter = contactList[i]["letter"];
    contactListComplete.innerHTML += `
    <div class="category-letter"><span>${letter}</span></div>
    <div class="contacts-splitter"></div>
    <div id="contacts${i}" class="contacts-list"></div>
    `;
    renderContact(i);
  }
}


/**
 * Renders contacts within a specific category.
 * @param {number} i - The index of the category.
 */
function renderContact(i) {
  let newContactList = document.getElementById(`contacts${i}`);
  newContactList.innerHTML = "";
  for (let j = 0; j < contactList[i]["contacts"].length; j++) {
    const contact = contactList[i]["contacts"][j];
    const initials = contact.firstName[0] + contact.lastName[0];
    const firstName = contact.firstName;
    const lastName = contact.lastName;
    const email = contact.email;
    const userColor = contact.userColor;
    newContactList.innerHTML += generateContact(i,j,initials,firstName,lastName,email,userColor);
  }
}


/**
 * Generates HTML markup for a contact.
 * @param {number} i - The index of the category.
 * @param {number} j - The index of the contact within the category.
 * @param {string} initials - The initials of the contact.
 * @param {string} firstName - The first name of the contact.
 * @param {string} lastName - The last name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} userColor - The color associated with the contact.
 * @returns {string} The HTML markup for the contact.
 */
function generateContact(i, j, initials, firstName, lastName, email, userColor) {
  return `
  <div id="contact${i},${j}" class="contact contact-hover" onclick="openContactInfo(${i},${j})">
      <div class="name-logo" style= "background-color: ${userColor}"><span>${initials}</span></div>
      <div class="contact-name">
      <span id="contact${i},${j}-name">${firstName} ${lastName}</span>
      <a href="#">${email}</a>
      </div>    
  </div>
  `;
}


/**
 * Groups contacts by their first name initials.
 */
function groupNames() {
  for (let i = 0; i < contacts.length; i++) {
    const letter = contacts[i].firstName[0].toUpperCase();
    const initials = contacts[i].initials;
    const firstName = contacts[i].firstName;
    const lastName = contacts[i].lastName;
    const email = contacts[i].email;
    const phone = contacts[i].phone;
    const userColor = contacts[i].userColor;
    const id = contacts[i].userId;
    let contact = {
      id: id,
      initials: initials,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      userColor: userColor,
    };

    contactLetterGroup = contactList.filter(function (list) {
      return list.letter == firstName[0].toUpperCase();
    });

    if (contactLetterGroup.length > 0) {
      contactLetterGroup[0].contacts.push(contact);
    } else {
      contactList.push({
        letter: letter,
        contacts: [
          { id: id,
            initials: initials,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            userColor: userColor,
          },
        ],
      });
    }
  }
}


/**
 * Sorts contacts alphabetically by first name.
 */
function sortContacts() {
  contacts.sort((a, b) => {
    if (a.firstName.toUpperCase() < b.firstName.toUpperCase()) {
      return -1;
    } else if (a.firstName.toUpperCase() > b.firstName.toUpperCase()) {
      return 1;
    } else {
      return 0;
    }
  });
}


/**
 * Opens the contact information for a specific contact.
 * @param {number} i - The index of the category.
 * @param {number} j - The index of the contact within the category.
 */
function openContactInfo(i, j) {
  let contactDetail = document.getElementById("contact-detail");
  if (
    document.getElementById(`contact${i},${j}`).style.backgroundColor !=="rgb(42, 54, 71)") {
    renderContactList();
    loadContactData(i, j, contactDetail);
    changeContactBackgroundColor(i, j);
  } else {
    contactDetail.innerHTML = "";
    renderContactList();
  }
}


/**
 * Loads contact data and renders contact information.
 * @param {number} i - The index of the category.
 * @param {number} j - The index of the contact within the category.
 * @param {HTMLElement} contactDetail - The container element for contact details.
 */
function loadContactData(i, j, contactDetail) {
  contactDetail.innerHTML = "";
  const contact = contactList[i]["contacts"][j];
  const initials = contact.initials;
  const firstName = contact.firstName;
  const lastName = contact.lastName;
  const email = contact.email;
  const phone = contact.phone;
  const userColor = contact.userColor;
  const id = contact.userId;
  contactDetail.innerHTML = renderContactInfo(i,j,initials,firstName,lastName,email,phone,userColor);
}


/**
 * Adds a new contact to the user's contacts.
 * @returns {Promise<void>} A promise that resolves after the contact is added.
 */
async function addNewContact() {
  let users = JSON.parse(await getItem("users"));
  let fullName = contactname.value.split(' ');
  let firstName = fullName[0];
  let lastName = fullName[fullName.length -1];
  let userColor = await generateRandomColor();
  let newUserId = await generateRandomId();
  user.userContacts.push({
    firstName: firstName,
    lastName: lastName,
    initials: firstName[0] + lastName[0],
    email: email.value,
    phone: phone.value,
    userColor: userColor,
    password: null,
    userId: newUserId,
    userContacts: null
  })
  await saveUserData(users);
  document.getElementById("overlay").style.display = "none";
  init();
}


/**
 * Deletes a contact from the user's contacts.
 * @param {number} i - The index of the category.
 * @param {number} j - The index of the contact within the category.
 * @returns {Promise<void>} A promise that resolves after the contact is deleted.
 */
async function deleteContact(i, j) {
  let users = JSON.parse(await getItem("users"));
  let contactForDelete = contactList[i]["contacts"][j].id;
  findContactForDelete(contactForDelete);
  document.getElementById("contact-detail").innerHTML = "";
  document.getElementById("overlay").style.display = "none";
  await saveUserData(users);
  init();
}


/**
 * Finds the contact to be deleted from the user's contacts.
 * @param {string} contactForDelete - The ID of the contact to be deleted.
 */
function findContactForDelete(contactForDelete){
    for (let x = 0; x < user.userContacts.length; x++) {
      const contact = user.userContacts[x];
      if(contact.userId == contactForDelete){
        user.userContacts.splice(x, 1);
      }
    }
}


/**
 * Opens an overlay for editing a contact.
 * @param {number} i - The index of the category.
 * @param {number} j - The index of the contact within the category.
 */
function EditContact(i, j) {
  document.getElementById("overlay").style.display = "flex";
  const contact = contactList[i]["contacts"][j];
  let fullName = contact.firstName+' '+contact.lastName;
  const initials = contact.initials;
  const email = contact.email;
  const phone = contact.phone;
  const userColor = contact.userColor;
  const id = contact.userId;
  document.getElementById("overlay").innerHTML = generateEditOverlay(i,j,initials,fullName,email,phone,userColor);
}


/**
 * Finds the contact to be updated in the user's contacts and updates its information.
 * @param {Object} updatingContact - The contact object containing updated information.
 */
function findUpdatingContact(updatingContact){
  for (let x = 0; x < user.userContacts.length; x++) {
    const contact = user.userContacts[x];
    if(contact.userId == updatingContact.id){
      let fullName = document.getElementById("editName").value.split(' ');
      updatingContact.firstName = fullName[0];
      updatingContact.lastName = fullName[fullName.length-1];
      updatingContact.email = document.getElementById("editEmail").value;
      updatingContact.phone = document.getElementById("editPhone").value;
      user.userContacts.splice(x, 1);
      user.userContacts.push(updatingContact);
    }
  }
}


/**
 * Saves the updated contact information.
 * @param {number} i - The index of the category.
 * @param {number} j - The index of the contact within the category.
 * @returns {Promise<void>} A promise that resolves after the contact information is saved.
 */
async function saveContact(i, j) {
  let users = JSON.parse(await getItem("users"));
  let updatingContact = contactList[i]["contacts"][j];
  findUpdatingContact(updatingContact);
  await saveUserData(users);
  init();
  document.getElementById("overlay").style.display = "none";
  openContactInfo(i, j);
}


/**
 * Generates HTML markup for displaying contact information.
 * @param {number} i - The index of the category.
 * @param {number} j - The index of the contact within the category.
 * @param {string} initials - The initials of the contact.
 * @param {string} firstName - The first name of the contact.
 * @param {string} lastName - The last name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} userColor - The color associated with the contact.
 * @returns {string} The HTML markup for displaying contact information.
 */
function renderContactInfo(i,j,initials,firstName,lastName,email,phone,userColor) {
  return `
    <div class="name-section">
        <div class="name-logo name-logo-detail" style= "background-color: ${userColor}">
        <span>${initials}</span>
        </div>
        <div class="flex-row">    
            <div class="name">
                <span>${firstName} ${lastName}</span>
            </div>
            <div class="edit-contact">
                <button onclick="EditContact(${i},${j})" onmouseover="hover('a')" onmouseout="unhover('a')"><img id="edit-img" src="assets/img/edit_icon.png" alt=""><span>Edit</span></button>
                <button onclick="deleteContact(${i},${j})" onmouseover="hover('b')" onmouseout="unhover('b')"><img id="delete-img" src="assets/img/delete_icon.png" alt=""><span>Delete</span></button>
            </div>
        </div>
    </div>        
    <div class="contact-information">
        <p id="ci-head">Contact Information</p>
        <div class="email">
          <p>Email</p>
          <a href="mailto:${email}">${email}</a>
        </div>
        <div class="phone">
          <p>Phone</p>
          <a href="tel:${phone}">${phone}</a>
        </div>
    </div>
    <img src="assets/img/mobile-menu-icon.png" id="roundButton" onclick="EditContact(${i},${j})" alt="Edit" style="cursor: pointer;">`;
}


/**
 * Generates HTML markup for the overlay to add a new contact.
 * @returns {string} The HTML markup for the add new contact overlay.
 */
function generateAddNewOverlay() {
  return `
  <div class="add-contact-card" onclick="doNotClose(event)">

  <div class="add-contact-card-left">
      <img class="mobile-none" src="/assets/img/logo_desktop.png" alt="">
      <div class="titles">
        <span class="title">Add contact</span>
        <span class="subtitle">Tasks are better with a Team!</span>
        <div class="blue-line-horizontal"></div>
      </div>
  </div>
  <div class="add-contact-card-right">
    <div class="close-button" onclick="closeAddContact()">
      <button><img src="assets/img/close_icon.png" alt=""></button>
    </div>
    <div class="add-contact-container">
    <img class="profile-icon" src="assets/img/profile_icon.png" alt="">
    <form onsubmit="addNewContact(); return false">
      <div class="actions-container">
        <div class="add-contact-inputs" >
          <input id="contactname" type="text" placeholder="Name" class="input-icon-name" required>
          <input id="email" type="email" placeholder="Email" class="input-icon-mail" required>
          <input id="phone" type="text" placeholder="Phone" class="input-icon-phone" required>
        </div>
        <div class="add-contact-buttons">
          <button type="button" onclick="closeAddContact()" class="cancel-button"><span>Cancel</span><img src="assets/img/cancel_icon.png" alt=""></button>
          <button type="submit" class="create-button"><span>Create contact</span><img src="assets/img/check_icon_white.png" alt=""></button>
        </div>
      </div>
      </form>
      </div>
  </div>`;
}


/**
 * Generates HTML markup for the overlay to edit a contact.
 * @param {number} i - The index of the category.
 * @param {number} j - The index of the contact within the category.
 * @param {string} initials - The initials of the contact.
 * @param {string} fullName - The full name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} userColor - The color associated with the contact.
 * @returns {string} The HTML markup for the edit contact overlay.
 */
function generateEditOverlay(i,j,initials,fullName,email,phone,userColor) {
  return `
  <div class="add-contact-card" onclick="doNotClose(event)">
    <div class="add-contact-card-left">
      <img class="mobile-logo-small" src="assets/img/logo_small.png" alt="">
        <div class="titles">
          <span class="title">Edit contact</span>
          <span class="subtitle">Tasks are better with a Team!</span>
          <div class="blue-line-horizontal"></div>
        </div>
    </div>
    
    <div class="add-contact-card-right">
      <div class="close-button" onclick="closeAddContact()">
        <button><img src="assets/img/close_icon.png" alt=""></button>
      </div>

      <div class="add-contact-container">
        <div id="name-logo-bg${i}" class="name-logo name-logo-detail" style= "background-color: ${userColor}">
          <span>${initials}</span>
        </div>
        <form onsubmit="saveContact(${i},${j}); return false">
          <div class="actions-container">
            <div class="add-contact-inputs" >
              <input id="editName" type="text" placeholder="Name" class="edit-input input-icon-name" value="${fullName}" required>
              <input id="editEmail" type="email" placeholder="Email" class="edit-input input-icon-mail" value="${email}" required>
              <input id="editPhone" type="text" placeholder="Phone" class="edit-input input-icon-phone" value="${phone}" required>
            </div>
            <div class="add-contact-buttons">
              <button type="button" onclick="deleteContact(${i},${j})" class="cancel-button"><span>Delete</span><img src="assets/img/cancel_icon.png" alt=""></button>
              <button type="submit" class="create-button"><span>Save</span><img src="assets/img/check_icon_white.png" alt=""></button>
            </div>
          </div>
        </form
      </div>
  </div>`;
}


/**
 * Opens the contact information for a specific contact.
 * @param {number} i - The index of the category.
 * @param {number} j - The index of the contact within the category.
 */
function openContactInfo(i, j) {
  if (window.innerWidth <= 1049) {
    // Kontaktinformationen laden für kleinere Bildschirme im Popup
    const contactDetail = document.getElementById("popup-contact-detail");
    loadContactData(i, j, contactDetail); // Annahme, dass diese Funktion die Kontaktinformationen lädt

    // Popup anzeigen
    document.getElementById("contact-info-popup").style.display = "block";
  } else {
    // Für größere Bildschirme die Kontaktinformationen im Detailbereich laden
    const contactDetail = document.getElementById("contact-detail");
    loadContactData(i, j, contactDetail); // Lädt die Kontaktinformationen in den Detailbereich
  }
}


/**
 * Closes the contact information popup.
 */
function closePopup() {
  document.getElementById("contact-info-popup").style.display = "none";
}


/**
 * Changes the image source to the hover version when hovering over an element.
 * @param {string} img - The identifier of the element being hovered over.
 */
function hover(img) {
  if (img == "a") {
    document
      .getElementById("edit-img")
      .setAttribute("src", "assets/img/edit_hover_icon.png");
  } else {
    document
      .getElementById("delete-img")
      .setAttribute("src", "assets/img/delete_hover_icon.png");
  }
}


/**
 * Changes the image source back to the original version when hovering out of an element.
 * @param {string} img - The identifier of the element being hovered out of.
 */
function unhover(img) {
  if (img == "a") {
    document
      .getElementById("edit-img")
      .setAttribute("src", "assets/img/edit_icon.png");
  } else {
    document
      .getElementById("delete-img")
      .setAttribute("src", "assets/img/delete_icon.png");
  }
}


/**
 * Prevents the default behavior of an event to stop propagation.
 * @param {Event} event - The event object.
 */
function doNotClose(event) {
  event.stopPropagation();
}


/**
 * Changes the background color of a contact element and removes hover effect.
 * @param {number} i - The index of the category.
 * @param {number} j - The index of the contact within the category.
 */
function changeContactBackgroundColor(i, j) {
  let contact = document.getElementById(`contact${i},${j}`);
  contact.style.backgroundColor = "#2A3647";
  contact.classList.remove("contact-hover");
  document.getElementById(`contact${i},${j}-name`).style.color = "#FFFFFF";
}


/**
 * Opens the overlay to add a new contact.
 */
function openAddNewContact() {
  const windowWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  if (windowWidth <= 1050) {
    document.querySelector(".add-contact-button").style.display = "none";
  }

  document.getElementById("overlay").style.display = "flex";
  document.getElementById("overlay").innerHTML = generateAddNewOverlay();
}


/**
 * Closes the overlay for adding a new contact.
 */
function closeAddContact() {
  document.getElementById("overlay").style.display = "none";

  const windowWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  if (windowWidth <= 1050) {
    document.querySelector(".add-contact-button").style.display = "block";
  }
}
