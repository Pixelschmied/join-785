function toggleDropdown() {
    var dropdown = document.getElementById("dropdownMenu");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}


function generateRandomId() {
    return Math.floor(100000 + Math.random() * 900000);
}


function clearDataBase() {
    localStorage.clear();
    location.reload();
}


function generateRandomColor(){
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    return "#" + randomColor
  }

function generateHeader(userInitials) {
    let header = document.getElementById("header-container");
    header.innerHTML = headerHTML(userInitials);
}

function generateSidebar() {
    let sidebar = document.getElementById("sidebar-container");
    sidebar.innerHTML = sidebarHTML();
}