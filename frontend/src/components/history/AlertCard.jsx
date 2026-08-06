import {
  FaMapMarkerAlt,
  FaRobot,
  FaCalendarAlt,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function AlertCard({ alert }) {
  const navigate = useNavigate();

  // Determine risk level
  const getRiskLevel = (score) => {
    if (score >= 80) {
      return {
        text: "HIGH",
        color: "bg-red-100 text-red-700",
      };
    }

    if (score >= 50) {
      return {
        text: "MEDIUM",
        color: "bg-yellow-100 text-yellow-700",
      };
    }

    return {
      text: "LOW",
      color: "bg-green-100 text-green-700",
    };
  };

  const risk = getRiskLevel(alert.risk_score);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6">

      {/* Header */}
      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            🚨 {alert.trigger_type.replace("_", " ")}
          </h2>

          <div className="flex items-center gap-2 mt-2 text-gray-500">
            <FaCalendarAlt />
            <span>{alert.created_at}</span>
          </div>
        </div>

        <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
          {alert.status}
        </span>

      </div>

      {/* Risk Score */}
      <div className="mt-6 flex items-center justify-between">

        <div>
          <p className="text-gray-500 text-sm">
            Risk Score
          </p>

          <h3 className="text-3xl font-bold">
            {alert.risk_score}
          </h3>
        </div>

        <span
          className={`px-4 py-2 rounded-full font-semibold ${risk.color}`}
        >
          {risk.text}
        </span>

      </div>

      {/* AI Recommendation */}
      <div className="mt-6">

        <div className="flex items-center gap-2 mb-2">
          <FaRobot className="text-indigo-600" />
          <h3 className="font-semibold">
            AI Recommendation
          </h3>
        </div>

        <p className="text-gray-600">
          {alert.ai_recommendation || "No recommendation available."}
        </p>

      </div>

      {/* Location & Actions */}
    {/* Location */}

<div className="mt-6 flex items-center gap-2 text-gray-600">

  <FaMapMarkerAlt className="text-red-500" />

  <span>

    {alert.latitude}, {alert.longitude}

  </span>

</div>

{/* Actions */}

<div className="mt-6">

  <h3 className="font-semibold text-lg mb-4">

    Quick Actions

  </h3>

  <div className="flex flex-wrap gap-3">

    {alert.status === "ACTIVE" && (
  <button
    onClick={() => navigate(`/tracking/${alert.id}`)}
    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition hover:scale-105"
  >
    📍 Live Tracking
  </button>
)}
    <button

      onClick={() => navigate(`/contact/${alert.id}`)}

      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition hover:scale-105"

    >

      👥 Contact Dashboard

    </button>

    <button

      onClick={() => navigate(`/timeline/${alert.id}`)}

      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition hover:scale-105"

    >

      📜 Timeline

    </button>

    <button

      onClick={() =>
        window.open(
          `http://127.0.0.1:5000/api/report/download/${alert.id}`,
          "_blank"
        )
      }

      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition hover:scale-105"

    >

      📄 Report

    </button>

    <a

      href={alert.maps_link}

      target="_blank"

      rel="noreferrer"

      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition hover:scale-105"

    >

      🗺 View Map

    </a>

  </div>

</div>

    </div>
  );
}

export default AlertCard;