import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

function LiveTracking() {
  const { id } = useParams();
const navigate = useNavigate();

const [ending, setEnding] = useState(false);
const [ended, setEnded] = useState(false);
  const [locations, setLocations] = useState([]);
const [emergency, setEmergency] = useState(null);

  const fetchLocations = async () => {
    try { 
      const response = await fetch(
        `http://127.0.0.1:5000/api/location/${id}`
      );

      const data = await response.json();

      if (data.success) {
    setLocations(data.locations);
    setEmergency(data.emergency);
}
    } catch (error) {
      console.error(error);
    }
  };

  const endEmergency = async () => {

  const confirmEnd = window.confirm(
    "Are you sure you want to end this emergency?"
  );

  if (!confirmEnd) return;

  try {

    setEnding(true);

    const response = await fetch(
      `http://127.0.0.1:5000/api/emergency/${id}/end`,
      {
        method: "PUT",
      }
    );

    const data = await response.json();

    if (data.success) {

      setEnded(true);

      alert("✅ Emergency Ended Successfully");

      setTimeout(() => {

        navigate("/history");

      },2000);

    }
    else{

      alert(data.message);

    }

  }
  catch(error){

    console.error(error);

  }
  finally{

    setEnding(false);

  }

};

 useEffect(() => {

  if (ended) return;

  fetchLocations();

  const interval = setInterval(fetchLocations, 5000);

  return () => clearInterval(interval);

}, [id, ended]);

const start = locations.length > 0 ? locations[0] : null;

const current =
  locations.length > 0
    ? locations[locations.length - 1]
    : null;

const path = locations.map((location) => [
  location.latitude,
  location.longitude,
]);

if (!start || !current || !emergency) {
  return (
    <div className="p-10 text-center text-xl">
      Loading Location...
    </div>
  );
}

  return (
    <div className="p-8">

      <h1 className="text-4xl font-bold mb-6">
        🛰️ Live Emergency Tracking
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

  <div className="bg-white rounded-xl shadow p-5">

    <h2 className="text-2xl font-bold mb-4">
      🚨 Emergency Details
    </h2>

    <p><strong>ID:</strong> {emergency.id}</p>

    <p><strong>Status:</strong> {emergency.status}</p>

    <p><strong>Trigger:</strong> {emergency.trigger_type}</p>

    <p><strong>Risk Score:</strong> {emergency.risk_score}</p>

    <p><strong>Created:</strong> {emergency.created_at}</p>

  </div>

  <div className="bg-white rounded-xl shadow p-5">

    <h2 className="text-2xl font-bold mb-4">
      📍 Tracking Statistics
    </h2>

    <p><strong>Total GPS Points:</strong> {locations.length}</p>

    <p><strong>Current Latitude:</strong> {current.latitude}</p>

    <p><strong>Current Longitude:</strong> {current.longitude}</p>

    <p><strong>Last Update:</strong> {current.timestamp}</p>

  </div>

</div>

      <div className="mb-6">

  <button
    onClick={endEmergency}
    disabled={ending || ended}
    className={`px-6 py-3 rounded-lg text-white font-semibold transition
      ${
        ended
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-red-600 hover:bg-red-700"
      }`}
  >
    {ending
      ? "Ending..."
      : ended
      ? "Emergency Ended"
      : "🚨 End Emergency"}
  </button>

</div>

      <MapContainer
        center={[current.latitude, current.longitude]}
        zoom={17}
        style={{
          height: "600px",
          width: "100%",
          borderRadius: "15px",
        }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[
            start.latitude,
            start.longitude,
          ]}
        >
          <Popup>
            🚩 Start Location
          </Popup>
        </Marker>

        <Marker
          position={[
            current.latitude,
            current.longitude,
          ]}
        >
          <Popup>
            📍 Current Location
          </Popup>
        </Marker>

        <Polyline
          positions={path}
        />

      </MapContainer>

<div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6">

  <h2 className="text-xl font-bold mb-3">
    🤖 AI Safety Recommendation
  </h2>

  <p>
    {emergency.ai_recommendation}
  </p>

</div>

    </div>
  );
}

export default LiveTracking;