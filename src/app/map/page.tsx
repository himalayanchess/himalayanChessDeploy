"use client";
import { useState } from "react";
import MapComponent from "@/MapComponent";
import axios from "axios";

export default function Home() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Save location to MongoDB
  const saveLocation = async (location) => {
    try {
      //   await axios.post("/api/saveLocation", location);
      setLocations([...locations, location]);
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (selectedLocation) {
      // Show the selected location in an alert
      alert(
        `Location: Latitude: ${selectedLocation.lat}, Longitude: ${selectedLocation.lng}`
      );
      saveLocation(selectedLocation);
    } else {
      alert("Please select a location first.");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">Select a Location</h1>
      <MapComponent onLocationSelect={setSelectedLocation} />

      <button
        onClick={handleSubmit}
        className="mt-5 p-2 bg-blue-500 text-white rounded"
      >
        Submit Location
      </button>

      <h2 className="mt-5 text-lg font-bold">Saved Locations</h2>
      {locations.map((loc, index) => (
        <button
          key={index}
          onClick={() =>
            window.open(
              `https://www.openstreetmap.org/?mlat=${loc.lat}&mlon=${loc.lng}`,
              "_blank"
            )
          }
          className="mt-2 p-2 bg-blue-500 text-white rounded"
        >
          Open Location {index + 1} in OpenStreetMap
        </button>
      ))}
    </div>
  );
}
