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
let pausedWorkTime = 0;
//単価制
const work_Number = document.getElementById("work_Number");
const unit_Work_Button = document.getElementById("unit_Work_Button");
const work_Date = document.getElementById("work_Date");
const work_Note = document.getElementById("work_Note");
//案件読み込み
const projects = JSON.parse(localStorage.getItem("projects")) || [];
//履歴
const history_List = document.getElementById("history_List");
const histories = JSON.parse(localStorage.getItem("histories")) || [];
//管理者用履歴編集
const admin_Pass = "2525";
const admin_History_Select = document.getElementById("admin_History_Select");
const admin_Edit_Project_Name = document.getElementById("admin_Edit_Project_Name");
const admin_Edit_Number = document.getElementById("admin_Edit_Number");
const admin_Edit_Note = document.getElementById("admin_Edit_Note");
const admin_Update_Button = document.getElementById("admin_Update_Button");
const admin_Delete_Button = document.getElementById("admin_Delete_Button");
//管理者用の案件追加登録
const admin_Register_Project_Name = document.getElementById("admin_Register_Project_Name");
const admin_Register_Salary = document.getElementById("admin_Register_Salary");
const admin_Register_Note = document.getElementById("admin_Register_Note");
const admin_Register_Button = document.getElementById("admin_Register_Button");


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
        render_Histories();
    }
    if (menu_Select.value === "admin_Edit") {
        const input_Pass = prompt("パスワードを入力してください");
        if (input_Pass === admin_Pass) {
            admin_History_Edit_Section.style.display = "block";
            render_Admin_Histories();
        } else {
            alert("パスワードが違います");
            menu_Select.value = "";
        }

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
    //選択された案件の配列の番号を取得
    const selected = edit_Project_Select.value;
    //選択されている案件の取得 indexに配列の番号、projectに中身を入力
    const index = projects.findIndex(function (p) {
        return p.name === selected;
    });
    //選択してなければ返す
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
    //フォームを空に
    edit_Project_Name.value = "";
    edit_Salary.value = "";
    edit_Type.value = "";
});
//削除ボタン
delete_Button.addEventListener("click", function () {

    const selected_Name = edit_Project_Select.value;
    //選択されている案件の取得 indexに配列の番号、projectに中身を入力
    const index = projects.findIndex(function (project) {
        return project.name === selected_Name;
    });
    //本当に消すか確認
    const ok = confirm("本当に削除しますか？");
    if (!ok) return;
    //index番目から１個削除
    if (index !== -1) {
        projects.splice(index, 1);
    }
    //変更した配列を保存
    localStorage.setItem("projects", JSON.stringify(projects));
    //更新
    renderProjects();
    //フォームを空に
    edit_Project_Name.value = "";
    edit_Salary.value = "";
    edit_Type.value = "";
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
    //勤務中に変えようとしたら返す
    if (status !== "notWorking") {
        alert("勤務中は案件変更できません");
        work_Project_Select.value = currentProject.name;
        return;
    }
    //選択された案件の配列の番号を取得
    const selected = work_Project_Select.value;
    //選択されている案件の取得
    const found = projects.find(function (project) {
        return project.name === selected;
    });
    //見つからなければ返す
    if (!found) return;
    currentProject = found;
    //制度ごとに表示
    hourly_System_Section.style.display = "none";
    unit_System_Section.style.display = "none";

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
    //ステータスを勤務中に変更
    status = "working";
    //スタート時の時間を取得
    const start = Date.now();
    //ローカルストレージに保存
    localStorage.setItem("startTime", start);
    //合計休憩時間のリセット
    totalBreak = 0;
    //時間が取得できないとき返す
    if (!start) {
        alert("時間が正しく取得できませんでした");
        return;
    }
    //タイマーあればリセット
    if (timer) clearInterval(timer);

    //時間表示
    //1秒ごとに繰り返す
    timer = setInterval(function () {
        //今の時間取得
        const now = Date.now();
        //今の勤務時間をworkTimeに挿入
        let workTime = now - start - totalBreak;
        //休憩中ならストップ
        if (status === "onBreak") {
            workTime = pausedWorkTime;
        }
        //現在の勤務時間等を画面に出力
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
    //勤務中でなければ返す
    if (status === "notWorking") {
        alert("出勤していません");
        return;
    }
    //休憩中なら返す
    if (status === "onBreak") {
        alert("休憩中です");
        return;
    }
    //データの取得
    const start = Number(localStorage.getItem("startTime"));
    const end = Date.now();
    const today = new Date();
    const year = today.getFullYear();
    //1桁の数字でも二桁目0が入る
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    //文字列にまとめてる yyyy-mm-dd
    const today_String = year + "-" + month + "-" + day;

    work_Date.value = today_String;
    //終了時間が得られなければ返す
    if (!end) {
        alert("時間が正しく取得できませんでした");
        return;
    }
    //タイマークリア
    if (timer) clearInterval(timer);
    //workTime、給料等計算　給料は1分単位で切り上げ
    let workTime = end - start - totalBreak;
    const total_Minutes = Math.ceil(workTime / (1000 * 60));
    const total_Seconds = Math.floor(workTime / 1000);
    const hours = String(Math.floor(total_Seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.ceil((total_Seconds % 3600) / 60)).padStart(2, "0");
    const salary = Math.floor(total_Minutes * (currentProject.salary / 60));
    //historiesにpush
    histories.push({
        type: "hourly",
        date: today_String,
        project: currentProject.name,
        minutes: total_Minutes,
        salary: salary
    });
    //ローカルストレージに保存
    localStorage.setItem(
        "histories",
        JSON.stringify(histories)
    );
    //テキスト表示
    result.textContent = " 今回の勤務時間:" + hours + "時間" + minutes + "分 給与 " + (salary) + "円";
    //ステータスを戻す
    status = "notWorking";
});
//休憩開始時
break_Start_Button.addEventListener("click", function () {
    //出勤してないときに返す
    if (status !== "working") {
        alert("出勤していません");
        return;
    }
    //ステータスを休憩中に変更
    status = "onBreak";
    breakStart = Date.now();
    //休憩に入った瞬間までの実際の勤務時間をキープ
    pausedWorkTime = breakStart - Number(localStorage.getItem("startTime")) - totalBreak;

});
//休憩終了時
break_End_Button.addEventListener("click", function () {
    //休憩中でなければ返す
    if (status !== "onBreak") {
        alert("休憩中ではありません");
        return;
    }
    //休憩時間の計算
    const breakTime = Date.now() - breakStart;
    //合計休憩時間に今回の休憩時間をプラス
    totalBreak += breakTime;
    //休憩時間をリセット
    breakStart = null;
    //ステータスを勤務中に変更
    status = "working"
});
//単価制
unit_Work_Button.addEventListener("click", function () {
    //プロジェクトを選択していないとき返す
    if (!currentProject) {
        alert("案件を選択してください");
        return;
    }
    //データの取得
    const count = Number(work_Number.value);
    const note = work_Note.value;
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const today_String = year + "-" + month + "-" + day;
    work_Date.value = today_String;
    //0件なら返す
    if (count <= 0) {
        alert("件数を入力してください");
        return;
    }
    //給料計算
    const salary = count * currentProject.salary;
    //historiesにデータをpushする
    histories.push({
        type: "unit",
        date: today_String,
        project: currentProject.name,
        count: count,
        note: note,
        salary: salary
    });
    //保存
    localStorage.setItem(
        "histories",
        JSON.stringify(histories)
    );
    //画面に表示
    result.textContent = today_String + " / " + count + "件 / " + salary + "円";

});
//履歴表示
function render_Histories() {
    //リストをいったんリセット
    history_List.innerHTML = "";
    //順番を日付順にソート
    histories.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });
    //1つずつ配列を表示
    histories.forEach(function (history) {
        //<div></div>を作る。
        const div = document.createElement("div");
        //それぞれのタイプごとの表示方法をとる
        if (history.type === "hourly") {
            const hours = Math.floor(history.minutes / 60);
            const remainMinutes = history.minutes % 60;
            div.textContent =
                history.date +
                " / " +
                history.project +
                " / " +
                hours +
                "時間 " +
                remainMinutes +
                "分 / " +
                history.salary +
                "円 / 備考: " +
                (history.note || "")
        }
        if (history.type === "unit") {

            div.textContent =
                history.date +
                " / " +
                history.project +
                " / " +
                history.count +
                "件 / " +
                history.salary +
                "円 / 備考: " +
                (history.note || "")
        }
        if (history.type === "admin") {

            div.textContent =
                history.date +
                " / " +
                history.project +
                " / " +
                history.salary +
                "円 / 備考: " +
                (history.note || "")
        }
        //作ったdivを画面に追加する
        history_List.appendChild(div);
    });
};
//管理者用履歴表示
function render_Admin_Histories() {
    //<option>の中身を空に
    admin_History_Select.innerHTML = '<option value = "">履歴を選択</option>';
    //日付順にソート
    histories.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });
    //1つずつ配列を表示
    histories.forEach(function (history, index) {
        //<option></option>を作る
        const option = document.createElement("option");
        //表示用の時間を計算
        const hours = Math.floor(history.minutes / 60);
        const remainMinutes = history.minutes % 60;
        //それぞれのタイプごとの表示方法をとる
        if (history.type === "hourly") {
            option.textContent =
                history.date +
                " / " +
                history.project +
                " / " +
                hours +
                "時間 " +
                remainMinutes +
                "分 / " +
                history.salary +
                "円 / 備考: " +
                (history.note || "")
        }
        if (history.type === "unit") {
            option.textContent =
                history.date +
                " / " +
                history.project +
                " / " +
                history.count +
                "件 / " +
                history.salary +
                "円 / 備考: " +
                (history.note || "")
        }
        if (history.type === "admin") {
            option.textContent =
                history.date +
                " / " +
                history.project +
                " / " +
                history.salary +
                "円 / 備考: " +
                (history.note || "")
        }
        //作ったオプションを入れてく
        option.value = index;
        admin_History_Select.appendChild(option);
    })
}
//管理者用の履歴編集
admin_History_Select.addEventListener("change", function () {
    //配列の番号を取得
    const index = admin_History_Select.value;
    //配列からデータ取り出し
    const history = histories[index];
    //存在しなければ返す
    if (!history) return;
    //フォームに案件名、制度毎の数、金額、備考を入力
    admin_Edit_Project_Name.value = history.project;

    if (history.type === "hourly") {
        admin_Edit_Number.value = history.minutes;
    }

    if (history.type === "unit") {
        admin_Edit_Number.value = history.count;
    }

    admin_Edit_Note.value = history.note || "";

});
//編集ボタン
admin_Update_Button.addEventListener("click", function () {
    //配列の番号を取得
    const index = admin_History_Select.value;
    //配列からデータ取り出し
    const history = histories[index];
    //何も選んでないときに返す
    if (index === "") {
        alert("履歴を選択してください");
        return;
    }
    //案件名等を上書き
    history.project = admin_Edit_Project_Name.value;

    if (history.type === "hourly") {
        history.minutes = Number(admin_Edit_Number.value);
    }

    if (history.type === "unit") {
        history.count = Number(admin_Edit_Number.value);
    }

    history.note = admin_Edit_Note.value;
    //変更した配列を保存
    localStorage.setItem(
        "histories",
        JSON.stringify(histories)
    );
    admin_Edit_Project_Name.value = "";
    admin_Edit_Number.value = "";
    admin_Edit_Note.value = "";
    //完了通知
    alert("更新しました");
    //更新
    render_Admin_Histories();
    render_Histories();

});
//削除ボタン
admin_Delete_Button.addEventListener("click", function () {
    //選択した配列の番号を取得
    const index = admin_History_Select.value;
    //選んでなければ返す
    if (index === "") {
        alert("履歴を選択してください");
        return;
    }
    //削除確認
    const ok = confirm("本当に削除しますか？");
    if (!ok) return;
    //配列のindex番目から一つ削除
    histories.splice(index, 1);
    //変更した配列を保存
    localStorage.setItem(
        "histories",
        JSON.stringify(histories)
    );
    //フォームの初期化
    admin_Edit_Project_Name.value = "";
    admin_Edit_Number.value = "";
    admin_Edit_Note.value = "";
    //更新
    render_Admin_Histories();
    render_Histories();
    //完了通知
    alert("削除しました");

});
//履歴追加ボタン
admin_Register_Button.addEventListener("click", function () {
    //値の入力
    const project = admin_Register_Project_Name.value;
    const salary = Number(admin_Register_Salary.value);
    const note = admin_Register_Note.value;
    const date = work_Date.value;

    //名前、金額、日付が空なら返す
    if (project === "") {
        alert("案件名を入力してください");
        return;
    }

    if (salary <= 0) {
        alert("金額を入力してください");
        return;
    }

    if (date === "") {
        alert("日付を入力してください");
        return;
    }

    //履歴に追加
    histories.push({
        type: "admin",
        date: date,
        project: project,
        salary: salary,
        note: note
    });

    //保存
    localStorage.setItem(
        "histories",
        JSON.stringify(histories)
    );

    //フォーム初期化
    admin_Register_Project_Name.value = "";
    admin_Register_Salary.value = "";
    admin_Register_Note.value = "";

    //更新
    render_Histories();
    render_Admin_Histories();

    alert("履歴を追加しました");
});