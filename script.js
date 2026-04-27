const menu_Select = document.getElementById("menu_Select"); //idでmenu_Selectを探す

const register_Section = document.getElementById("register_Section");
const edit_Section = document.getElementById("edit_Section");
const work_Section = document.getElementById("work_Section");
const history_Section = document.getElementById("history_Section");
const admin_History_Edit_Section = document.getElementById("admin_history_Edit_Section");

menu_Select.addEventListener("change", function () {

  register_Section.style.display = "none";
  edit_Section.style.display = "none";
  work_Section.style.display = "none";
  history_Section.style.display = "none";
  admin_History_Edit_Section.style.display = "none";
  
    if (menu_Select.value === "register") {
    register_Section.style.display = "block";
    }
     if (menu_Select.value === "edit") {
    edit_Section.style.display = "block";
    }
     if (menu_Select.value === "work") {
    work_Section.style.display = "block";
    }
     if (menu_Select.value === "history") {
    history_Section.style.display = "block";
    }
     if (menu_Select.value === "admin_Edit") {
    admin_History_Edit_Section.style.display = "block";
    }

});