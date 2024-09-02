import React, { useEffect, useState } from 'react';
import { ref, get, child } from 'firebase/database';
import database from '../config/firebaseConfig';
import "../styles/home.css";

function Home() {
  const [buses, setBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Function to fetch bus details and live location data
  const fetchBuses = async () => {
    try {
      const dbRef = ref(database);
      // Fetch bus details from the 'buses' collection
      const snapshot = await get(child(dbRef, 'buses'));
      if (snapshot.exists()) {
        const busesData = snapshot.val();

        // Fetch live location for each bus and combine it with the bus details
        const busesArray = await Promise.all(
          Object.keys(busesData).map(async (key) => {
            // Fetch live location data for the bus
            const liveLocation = await fetchLiveLocation(key);
            return {
              _id: key,
              ...busesData[key],
              liveLocation, // Include live location data in the bus object
            };
          })
        );

        // Update the buses state with the combined data
        setBuses(busesArray);
      } else {
        console.error('No bus data available');
      }
    } catch (error) {
      console.error('There was an error fetching the bus data!', error);
    }
  };

  // Function to fetch live location data from the 'live_location_data' collection
  const fetchLiveLocation = async (busNumber) => {
    try {
      const dbRef = ref(database);
      // Fetch live location data using the bus number as a key
      const snapshot = await get(child(dbRef, `live_location_data/${busNumber}`));
      if (snapshot.exists()) {
        const liveLocationData = snapshot.val();
        const { Latitude: latitude, Longitude: longitude } = liveLocationData;
        return { latitude, longitude };
      } else {
        console.error('No live location data available');
        return null;
      }
    } catch (error) {
      console.error('There was an error fetching the live location data!', error);
      return null;
    }
  };





// Function to handle the click event for the 'Locate' button
const handleBusClick = async (busNumber, fromPlace, toPlace, boardingPoints) => {
  const fromPlaceEncoded = encodeURIComponent(fromPlace);
  const toPlaceEncoded = encodeURIComponent(toPlace);
  const waypointsEncoded = boardingPoints
    .map(point => encodeURIComponent(point.placeName))
    .join('|');

  // Fetch the live location data again before opening Google Maps
  const liveLocation = await fetchLiveLocation(busNumber);
  if (liveLocation) {
    const { latitude, longitude } = liveLocation;
    const liveLocationWaypoint = `${latitude},${longitude}`;

    // Add live location as the last waypoint
    const waypointsWithLiveLocation = waypointsEncoded 
      ? `${waypointsEncoded}|${liveLocationWaypoint}` 
      : liveLocationWaypoint;

    // Create a marker for the live location with a specific icon
    const customIconUrl = 'https://maps.google.com/mapfiles/kml/paddle/red-circle.png'; // Example of a custom icon
    const liveLocationMarker = `&markers=icon:${encodeURIComponent(customIconUrl)}|${latitude},${longitude}`;

    // Construct the Google Maps URL
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${fromPlaceEncoded}&destination=${toPlaceEncoded}&waypoints=${waypointsWithLiveLocation}${liveLocationMarker}`;

    // Open the Google Maps URL in a new tab
    window.open(googleMapsUrl, '_blank');
  } else {
    alert('Live location not available for this bus.');
  }
};





  // Fetch bus data on component mount
  useEffect(() => {
    fetchBuses();
  }, []);

  // Filter buses based on the search term
  const filteredBuses = buses.filter((bus) =>
    bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-page">
      <h1 className="home-title">Bus Details</h1>
      <input
        className="search-bus"
        type="text"
        placeholder="Search bus by number..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="bus-table">
        <thead>
          <tr>
            <th>Bus Number</th>
            <th>Mobile Number</th>
            <th>From Place</th>
            <th>To Place</th>
            <th>Boarding Points</th>
            <th>Longitude</th>
            <th>Latitude</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBuses.map((bus) => (
            <tr key={bus._id}>
              <td>{bus.busNumber}</td>
              <td>{bus.mobileNumber}</td>
              <td>{bus.fromPlace}</td>
              <td>{bus.toPlace}</td>
              <td>
                {bus.boardingPoints.map((point, index) => (
                  <div key={index}>
                    {`Place Name: ${point.placeName}`}
                  </div>
                ))}
              </td>
              {/* Display longitude and latitude from live location data */}
              <td>{bus.liveLocation?.longitude || 'N/A'}</td>
              <td>{bus.liveLocation?.latitude || 'N/A'}</td>
              <td>
                <button
                  className="locate-button"
                  onClick={() => handleBusClick(bus.busNumber, bus.fromPlace, bus.toPlace, bus.boardingPoints)}
                >
                  Locate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home;
