import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC6jYee6NfxsetTLC0wRWOASyJIlg2pWsw",
  authDomain: "tracker-4fd12.firebaseapp.com",
  databaseURL: "https://tracker-4fd12-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "tracker-4fd12",
  storageBucket: "tracker-4fd12.appspot.com",
  messagingSenderId: "1042913432614",
  appId: "1:1042913432614:web:abcd1234efgh5678",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;
