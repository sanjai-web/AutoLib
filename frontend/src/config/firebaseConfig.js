import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCtdAEcpIdluo-NPIhzJ8vHoMSMD6VPczQ",
  authDomain: "tracker-53c35.firebaseapp.com",
  databaseURL: "https://tracker-53c35-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tracker-53c35",
  storageBucket: "tracker-53c35.appspot.com",
  messagingSenderId: "1042913432614",
  appId: "1:1042913432614:web:abcd1234efgh5678",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;
