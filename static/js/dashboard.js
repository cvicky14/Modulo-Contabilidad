fetch("http://localhost:4000/api/login", {
    method: "GET",
    credentials: "include"
})
.then(response => {
    if (response.status === 401) {
        window.location.href = "login.html";
    }
    return response.json();
})
.then(data => {
    const perfil = data.perfil;
    const menus = data.menus;
    
    const perfilElement = document.getElementById("perfil");
    perfilElement.textContent = `${perfil}`;

    const dashboardData = document.getElementById("dashboard-data");
    console.log("message:", perfil);
    const menuList = createMenuList(menus);
    dashboardData.appendChild(menuList);
})
.catch(error => {
    console.error("Error:", error);
});

function createMenuList(menuData) {
    const menuList = document.createElement("ul");
    menuList.classList.add("dropdownmenu");
  
    // Iterar sobre la lista de menús y submenús
    for (const menuItemData of menuData) {
      const menuItem = document.createElement("li");
      menuItem.textContent = menuItemData.nombre_menu;
      menuItem.classList.add("dropdownmenu-item");
      
      // Asignar el atributo "id" con el ID del menú
      if (menuItemData.id_menu) {
        menuItem.setAttribute("id", "menu-" + menuItemData.id_menu);
      }
  
      const submenu = menuItemData.submenu;
      if (submenu && submenu.length > 0) {
        // Si hay submenús, crear una lista para ellos de manera recursiva
        const submenuList = createMenuList(submenu);
        submenuList.classList.add("dropdownmenu-submenu");
        menuItem.appendChild(submenuList);
      }
  
      menuList.appendChild(menuItem);
    }
  
    return menuList;
}
