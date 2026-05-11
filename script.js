//htmlのID取得、jsで使えるようにする
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
//時給制
const attend_Button = document.getElementById("attend_Button");
const leaving_Button = document.getElementById("leaving_Button");
const break_Start_Button = document.getElementById("break_Start_Button");
const break_End_Button = document.getElementById("break_End_Button");
const result = document.getElementById("work_Result");
let timer = null;
let breakStart = null;
let totalBreak = 0;
let status = "notWorking";
let currentProject = null;
//単価制
const work_Number = document.getElementById("work_Number");
const unit_Work_Button = document.getElementById("unit_Work_Button");
const work_Date = document
//案件読み込み
const projects = JSON.parse(localStorage.getItem("projects")) || [];

//メニューで選んだものを表示

menu_Select.addEventListener("change", function () {
    register_Section.style.display = "none";
    edit_Section.style.display = "none";
    work_Section.style.display = "none";
    history_Section.style.display = "none";
    admin_History_Edit_Section.style.display = "none";
    //案件選択のリセット
    hourly_System_Section.style.display = "none";
    unit_System_Section.style.display = "none";
    work_Project_Select.value = "";
    result.textContent = "";

    if (menu_Select.value === "register") {
        register_Section.style.display = "block";
    }
    if (menu_Select.value === "edit") {
        edit_Section.style.display = "block";
        //案件の読み込み
        renderProjects();
    }
    if (menu_Select.value === "work") {
        work_Section.style.display = "block";
        //案件の読み込み
        renderProjects();
    }
    if (menu_Select.value === "history") {
        history_Section.style.display = "block";
    }
    if (menu_Select.value === "admin_Edit") {
        admin_History_Edit_Section.style.display = "block";
    }

});
//管理者用メニューを選んだ際にもう一度選択し、表示
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
//案件登録の処理　
register_Button.addEventListener("click", function () {

    const project_Name = register_Project_Name.value;
    const salary = register_Salary.value;
    const project_Type = register_Type.value;
    //名前が空なら受け付けない
    if (project_Name === "") {
        alert("案件名を入力してください。");
        return;
    }
    //選択されている案件の取得 duplicateに番号、projectに中身を入力
    const duplicate = projects.some(function (project) {
        return project.name === project_Name;
    });
    //名前が同じ案件があれば受け付けない
    if (duplicate) {
        alert("同じ名前の案件がすでに存在しています。");
        return;
    }
    //配列に追加
    projects.push({
        name: project_Name,
        type: project_Type,
        salary: salary
    });
    //localStorageに追加
    localStorage.setItem("projects", JSON.stringify(projects));
    renderProjects();
});
//案件編集 
edit_Project_Select.addEventListener("change", function () {
    //選んだ案件の名前取得
    const selected = edit_Project_Select.value;
    //配列から名前を探し、取得
    const found = projects.find(function (project) {
        return project.name === selected;
    });
    //名前がなければ返す
    if (!found) return;
    //フォームに値をセット
    edit_Project_Name.value = found.name;
    edit_Salary.value = found.salary;
    edit_Type.value = found.type;
});
edit_Button.addEventListener("click", function () {

    const selected = edit_Project_Select.value;
    //選択されている案件の取得 indexに配列の番号、projectに中身を入力
    const index = projects.findIndex(function (p) {
        return p.name === selected;
    });

    if (index === -1) return;
    //上書き
    projects[index] = {
        name: edit_Project_Name.value,
        salary: edit_Salary.value,
        type: edit_Type.value
    };
    //ローカルストレージに保存
    localStorage.setItem("projects", JSON.stringify(projects));

    renderProjects();
});
//削除ボタン
delete_Button.addEventListener("click", function () {

    const selected_Name = edit_Project_Select.value;
    //選択されている案件の取得 indexに配列の番号、projectに中身を入力
    const index = projects.findIndex(function (project) {
        return project.name === selected_Name;
    });
    //index番目から１個削除
    if (index !== -1) {
        projects.splice(index, 1);
    }
    localStorage.setItem("projects", JSON.stringify(projects));

    renderProjects();
});

//案件読み込み　
function renderProjects() {
    work_Project_Select.innerHTML = "<option>案件を選択</option>";
    edit_Project_Select.innerHTML = "<option>案件を選択</option>";
    //配列毎に順番にループ
    projects.forEach(function (project) {
        //HTMLでの<option>を作成
        const option1 = document.createElement("option");
        //textContentは表示する文字
        option1.textContent = project.name;
        //HTMLでのvalue = project.name
        option1.value = project.name;
        //<select>の最後にoptionを追加
        work_Project_Select.appendChild(option1);
        //編集用にもう一つ
        const option2 = document.createElement("option");
        option2.textContent = project.name;
        option2.value = project.name;
        edit_Project_Select.appendChild(option2);
    });
}
//案件選択
work_Project_Select.addEventListener("change", function () {
    if (status !== "notWorking") {
        alert("勤務中は案件変更できません");
        work_Project_Select.value = currentProject.name;
        return;
    }
    const selected = work_Project_Select.value;
    //選択されている案件の取得
    const found = projects.find(function (project) {
        return project.name === selected;
    });
    //制度ごとに表示
    hourly_System_Section.style.display = "none";
    unit_System_Section.style.display = "none";

    if (!found) return;
    currentProject = found;
    if (found.type === "hourly") {
        hourly_System_Section.style.display = "block";
    }
    if (found.type === "unit") {
        unit_System_Section.style.display = "block";

    }

});

//出勤時
attend_Button.addEventListener("click", function () {
    //案件を選択してないときに返す
    if (!currentProject) {
        alert("案件を選択してください");
        return;
    }
    //勤務中に出勤を押した場合に返す
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

        let workTime = now - start - totalBreak;;

        if (status === "onBreak") {
            workTime = pausedWorkTime;
        }

        const total_Seconds = Math.floor(workTime / 1000);
        const hours = String(Math.floor(total_Seconds / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((total_Seconds % 3600) / 60)).padStart(2, "0");
        const seconds = String(Math.floor(total_Seconds % 60)).padStart(2, "0");
        const salary = Math.floor((workTime / (1000 * 60 * 60)) * currentProject.salary);
        if (status === "onBreak") {
            result.textContent = "休憩中 / " + "現在の勤務時間  " + hours + ":" + minutes + ":" + seconds + " / 現在の給与:" + salary + "円";
        } else {
            result.textContent = "勤務中 / " + "現在の勤務時間  " + hours + ":" + minutes + ":" + seconds + " / 現在の給与:" + salary + "円";
        }
        
    }, 1000);
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

    if (!end) {
        alert("時間が正しく取得できませんでした");
        return;
    }
    if (timer) clearInterval(timer);

    let workTime = end - start - totalBreak;

    const minutes = Math.ceil(workTime / (1000 * 60));
    const salary = Math.floor(minutes * (currentProject.salary / 60));

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
    //休憩に入った瞬間までの実際の勤務時間をキープ
    pausedWorkTime = breakStart - Number(localStorage.getItem("startTime")) - totalBreak;

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

