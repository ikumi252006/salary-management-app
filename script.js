//メニュー
const menu_Select = document.getElementById("menu_Select"); 
const register_Section = document.getElementById("register_Section");
const edit_Section = document.getElementById("edit_Section");
const work_Section = document.getElementById("work_Section");
const history_Section = document.getElementById("history_Section");
const admin_History_Edit_Section = document.getElementById("admin_History_Edit_Section");
//管理者用メニュー
const admin_Menu_Select = document.getElementById("admin_Menu_Select");
const admin_Register_Section = document.getElementById("admin_Register_Section");
const admin_Edit_Section = document.getElementById("admin_Edit_Section");
//案件登録
const register_Project_Name = document.getElementById("register_Project_Name");
const register_Salary = document.getElementById("register_Salary");
const register_Type = document.getElementById("register_Type");
const register_Button = document.getElementById("register_Button");
//案件編集
const edit_Project_Select = document.getElementById("edit_Project_Select");
const edit_Project_Name = document.getElementById("edit_Project_Name");
const edit_Salary = document.getElementById("edit_Salary");
const edit_Type = document.getElementById("edit_Type");
const edit_Button = document.getElementById("edit_Button");
const delete_Button = document.getElementById("delete_Button");
//案件選択
const work_Project_Select = document.getElementById("work_Project_Select");
const hourly_System_Section = document.getElementById("hourly_System_Section");
const unit_System_Section = document.getElementById("unit_System_Section");
//案件読み込み
const projects = JSON.parse(localStorage.getItem("projects")) || [];


//メニュー
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
         renderProjects(); 
    }
     if (menu_Select.value === "work") {
         work_Section.style.display = "block";
         renderProjects();
    }
     if (menu_Select.value === "history") {
    history_Section.style.display = "block";
    }
     if (menu_Select.value === "admin_Edit") {
    admin_History_Edit_Section.style.display = "block";
    }

});
//管理者用メニュー
admin_Menu_Select.addEventListener("change", function () {

admin_Register_Section.style.display = "none";
admin_Edit_Section.style.display = "none";
    
if (admin_Menu_Select.value === "admin_Register") {
  admin_Register_Section.style.display = "block";
}

if (admin_Menu_Select.value === "admin_Edit") {
  admin_Edit_Section.style.display = "block";
}
});
//案件登録
register_Button.addEventListener("click", function () {

    const project_Name = register_Project_Name.value;
    const salary = register_Salary.value;
    const project_Type = register_Type.value;
    
    if (project_Name === "") {
        alert("案件名を入力してください。");
        return;
    }

    const duplicate = projects.some(function (project) {
        return project.name === project_Name;
    });

    if (duplicate) {
        alert("同じ名前の案件がすでに存在しています。");
        return;
    }
    projects.push({
        name: project_Name,
        type: project_Type,
        salary: salary
    });
    localStorage.setItem("projects", JSON.stringify(projects));
    renderProjects();
});
//案件編集
edit_Project_Select.addEventListener("change", function () {
    const selected = edit_Project_Select.value;

    const found = projects.find(function (p) {
        return p.name === selected;
    });
    if (!found) return;

    edit_Project_Name.value = found.name;
    edit_Salary.value = found.salary;
    edit_Type.value = found.type;
});
edit_Button.addEventListener("click", function () {

    const selected = edit_Project_Select.value;
    const index = projects.findIndex(function (p) {
        return p.name === selected;
    });

    if (index === -1) return;

    projects[index] = {
        name: edit_Project_Name.value,
        salary: edit_Salary.value,
        type: edit_Type.value
    };
    localStorage.setItem("projects", JSON.stringify(projects));

    renderProjects();
});

delete_Button.addEventListener("click", function () {
    
    const selected_Name = edit_Project_Select.value;

    const index = projects.findIndex(function (project) {
        return project.name === selected_Name;
    });

    if (index !== -1) {
        projects.splice(index, 1);
    }
    localStorage.setItem("projects", JSON.stringify(projects));

    renderProjects();
});
//案件選択
work_Project_Select.addEventListener("change", function () {
    const selected_Project_Section = work_Project_Select.value;
    const found_Project = projects.find(function (project) {
        return project.name === selected_Project_Section;
    });
    hourly_System_Section.style.display = "none";
    unit_System_Section.style.display = "none";

    if (found_Project.type === "hourly") {
        hourly_System_Section.style.display = "block";
    }
    if (found_Project.type === "unit") {
        unit_System_Section.style.display = "block";
    }
    
})
//案件読み込み
function renderProjects() {
    work_Project_Select.innerHTML = "<option>案件を選択</option>";
    edit_Project_Select.innerHTML = "<option>案件を選択</option>";
    
    projects.forEach(function (project) {
        const option1 = document.createElement("option");
        option1.textContent = project.name;
        option1.value = project.name;
        work_Project_Select.appendChild(option1);

        const option2 = document.createElement("option");
        option2.textContent = project.name;
        option2.value = project.name;
        edit_Project_Select.appendChild(option2);
    });
}
//お金の計算
work_Project_Select.addEventListener("change", function () {
    const selected = work_Project_Select.value;

    const found = projects.find(function (project) {
        return project.name === selected;
    });

    hourly_System_Section.style.display = "none";
    unit_System_Section.style.display = "none";

    if (!found) return;

    if (found.type === "hourly") {
        hourly_System_Section.style.display = "block";
    }
    if (found.type === "unit") {
        unit_System_Section.style.display = "block";

    }
    calculateWorkMoney(found);
});
//計算用関数
function calculateWorkMoney(project) {

    const result = document.getElementById("work_Result");

    if (project.type === "hourly") {

        const attend_Button = document.getElementById("attend_Button");
        const leaving_Button = document.getElementById("leaving_Button");
        const break_Start_Button = document.getElementById("break_Start_Button");
        const break_End_Button = document.getElementById("break_End_Button");

        let timer = null;
        let breakStart = null;
        let totalBreak = 0;
        let status = "notWorking";

        
//出勤時
        attend_Button.addEventListener("click", function () {
            
             if (status !== "notWorking") {
                 alert("すでに出勤しています");
                 return;
            }
            
            status = "working";

            const start = Date.now();
            localStorage.setItem("startTime", start);

            totalBreak = 0;

            if (!start) {
                alert("時間が正しく取得できませんでした");
                return;
            }
            if (timer) clearInterval(timer);

            //時間表示
            
            timer = setInterval(function () {
                const now = Date.now();
                let workTime = now - start - totalBreak;
                const minutes = Math.ceil(workTime / (1000 * 60));

                 if (status === "onBreak") {
            workTime = breakStart - start - totalBreak;
        }
                
                result.textContent = "現在の給与:" + Math.floor(minutes * (project.salary / 60)) + "円";            }, 1000);
        });

//退勤時
        leaving_Button.addEventListener("click", function () {
         if (status === "notWorking") {
             alert("出勤していません");
             return;
         }

            if (status === "onBreak") {
                alert("休憩中です");
                return;
            }
            const start = Number(localStorage.getItem("startTime"));
            const end = Date.now();
                localStorage.setItem("endTime", Date.now());
            
                
                if (!end) {
                    alert("時間が正しく取得できませんでした");
                    return;
            }
              if (timer) clearInterval(timer);

            let workTime = now - start - totalBreak;

            const end_Date = new Date(Number(end));
            const minutes = Math.ceil(workTime / (1000 * 60));
            const salary = Math.floor(minutes * (project.salary / 60));
                
            result.textContent = "今回の勤務時間は" + minutes + "分です。給与は：" + (salary) + "円でした。";
                
            status = "notWorking";
            });
       //休憩開始時
        break_Start_Button.addEventListener("click", function () {
            if (status !== "working") {
        alert("出勤していません");
                return;
            }
            status = "onBreak";
            breakStart = Date.now();
        });
        //休憩終了時
        break_End_Button.addEventListener("click", function () {
            if (status !== "onBreak") {
                alert("休憩中ではありません");
                return;
            } 

            const breakTime = Date.now() - breakStart;
            totalBreak += breakTime;
            breakStart = null;
            status = "working"
});
        
    }


}
