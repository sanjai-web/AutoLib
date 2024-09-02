const express = require('express');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, child } = require('firebase/database');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: `${process.env.PROJECT_ID}.firebaseapp.com`,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: `${process.env.PROJECT_ID}.appspot.com`,
  messagingSenderId: process.env.PROJECT_NUMBER,
  appId: process.env.FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// Check database connection
const testConnection = async () => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `test`)); // Attempt to read from a 'test' path
    console.log('Firebase Realtime Database connected successfully');
  } catch (err) {
    console.error('Error connecting to Firebase Realtime Database:', err);
  }
};

// Call the testConnection function to verify connection on server start
testConnection();

app.post('/addbus', async (req, res) => {
  try {
    const newBusRef = ref(db, `buses/${req.body.busNumber}`);
    await set(newBusRef, req.body);
    res.status(201).send('Bus details added successfully');
  } catch (err) {
    res.status(400).send('Error: ' + err);
  }
});

app.get('/buses', async (req, res) => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `buses`));
    if (snapshot.exists()) {
      res.json(snapshot.val());
    } else {
      res.status(404).send('No data available');
    }
  } catch (err) {
    res.status(400).send('Error: ' + err);
  }
});

app.put('/updatebus/:id', async (req, res) => {
  try {
    const updateBusRef = ref(db, `buses/${req.params.id}`);
    await update(updateBusRef, req.body);
    res.status(200).send('Bus details updated successfully');
  } catch (err) {
    res.status(400).send('Error: ' + err);
  }
});

app.delete('/deletebus/:id', async (req, res) => {
  try {
    const deleteBusRef = ref(db, `buses/${req.params.id}`);
    await remove(deleteBusRef);
    res.status(200).send('Bus details deleted successfully');
  } catch (err) {
    res.status(400).send('Error: ' + err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
