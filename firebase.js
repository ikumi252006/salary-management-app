// Firebase SDK
import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 自分の設定に変更
const firebaseConfig = {
  apiKey: "ここ",
  authDomain: "ここ",
  projectId: "ここ",
  storageBucket: "ここ",
  messagingSenderId: "ここ",
  appId: "ここ"
};

// 初期化
const app = initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);

// 他ファイルで使えるように
window.db = db;