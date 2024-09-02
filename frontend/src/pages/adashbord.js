import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get, child, update, remove } from 'firebase/database';
import database from '../config/firebaseConfig';
import "../styles/adashbord.css";

function BusForm({ fetchBuses, selectedBus, clearSelectedBus }) {
  const [busNumber, setBusNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [fromPlace, setFromPlace] = useState('');
  const [toPlace, setToPlace] = useState('');
  const [boardingPoints, setBoardingPoints] = useState([{ placeName: '' }]);

  useEffect(() => {
    if (selectedBus) {
      setBusNumber(selectedBus.busNumber);
      setMobileNumber(selectedBus.mobileNumber);
      setFromPlace(selectedBus.fromPlace);
      setToPlace(selectedBus.toPlace);
      setBoardingPoints(selectedBus.boardingPoints);
    }
  }, [selectedBus]);

  const handleBoardingPointChange = (index, key, value) => {
    const newBoardingPoints = [...boardingPoints];
    newBoardingPoints[index][key] = value;
    setBoardingPoints(newBoardingPoints);
  };

  const addBoardingPoint = () => {
    setBoardingPoints([...boardingPoints, { placeName: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newBus = {
      busNumber,
      mobileNumber,
      fromPlace,
      toPlace,
      boardingPoints,
    };

    const db = getDatabase();

    try {
      if (selectedBus) {
        const updateBusRef = ref(db, `buses/${selectedBus.busNumber}`);
        await update(updateBusRef, newBus);
        alert('Bus details updated successfully');
      } else {
        const newBusRef = ref(db, `buses/${busNumber}`);
        await set(newBusRef, newBus);
        alert('Bus details added successfully');
      }
      fetchBuses();
      clearSelectedBus();
      setBusNumber('');
      setMobileNumber('');
      setFromPlace('');
      setToPlace('');
      setBoardingPoints([{ placeName: '' }]);
    } catch (error) {
      console.error('There was an error adding/updating the bus!', error);
    }
  };

  return (
    <form className="bus-form" onSubmit={handleSubmit}>
      <div>
        <label>Bus Number:</label>
        <input 
          type="text" 
          value={busNumber} 
          onChange={(e) => setBusNumber(e.target.value)} 
        />
      </div>
      <div>
        <label>Mobile Number:</label>
        <input 
          type="text" 
          value={mobileNumber} 
          onChange={(e) => setMobileNumber(e.target.value)} 
        />
      </div>
      <div>
        <label>From Place:</label>
        <input 
          type="text" 
          value={fromPlace} 
          onChange={(e) => setFromPlace(e.target.value)} 
        />
      </div>
      <div>
        <label>To Place:</label>
        <input 
          type="text" 
          value={toPlace} 
          onChange={(e) => setToPlace(e.target.value)} 
        />
      </div>
      {boardingPoints.map((point, index) => (
        <div key={index} className="boarding-point">
          <div>
            <label>Boarding Point {index + 1} Place Name:</label>
            <input 
              type="text" 
              value={point.placeName} 
              onChange={(e) => handleBoardingPointChange(index, 'placeName', e.target.value)} 
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={addBoardingPoint}>Add Boarding Point</button>
      <button type="submit">{selectedBus ? 'Update Bus' : 'Add Bus'}</button>
    </form>
  );
}

function AdminDashboard() {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchBuses = async () => {
    const dbRef = ref(database);
    try {
      const snapshot = await get(child(dbRef, 'buses'));
      if (snapshot.exists()) {
        const busesData = snapshot.val();
        const busesArray = Object.keys(busesData).map(key => ({
          _id: key,
          ...busesData[key]
        }));
        setBuses(busesArray);
      }
    } catch (error) {
      console.error('There was an error fetching the bus data!', error);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleEditClick = (bus) => {
    setSelectedBus(bus);
  };

  const handleDeleteClick = async (busId) => {
    const db = getDatabase();
    const deleteBusRef = ref(db, `buses/${busId}`);
    try {
      await remove(deleteBusRef);
      alert('Bus details deleted successfully');
      fetchBuses();
    } catch (error) {
      console.error('There was an error deleting the bus!', error);
    }
  };

  const clearSelectedBus = () => {
    setSelectedBus(null);
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <input 
        type="text" 
        placeholder="Search by Bus Number" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      <BusForm 
        fetchBuses={fetchBuses} 
        selectedBus={selectedBus} 
        clearSelectedBus={clearSelectedBus} 
      />
      <table className="bus-table">
        <thead>
          <tr>
            <th>Bus Number</th>
            <th>Mobile Number</th>
            <th>From Place</th>
            <th>To Place</th>
            <th>Boarding Points</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {buses
            .filter(bus => 
              bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((bus, index) => (
              <tr key={index}>
                <td>{bus.busNumber}</td>
                <td>{bus.mobileNumber}</td>
                <td>{bus.fromPlace}</td>
                <td>{bus.toPlace}</td>
                <td>{bus.boardingPoints.map((point, i) => (
                  <div key={i}>
                    {point.placeName} 
                  </div>
                ))}</td>
                <td>
                  <button onClick={() => handleEditClick(bus)}>Edit</button>
                  <button onClick={() => handleDeleteClick(bus._id)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
