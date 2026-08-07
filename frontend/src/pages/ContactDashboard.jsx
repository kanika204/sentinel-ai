import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStream } from "react-icons/fa";
import {
  FaExclamationTriangle,
  FaRobot,
  FaMapMarkerAlt,
  FaClock,
  FaSatelliteDish,
  FaFileDownload,
} from "react-icons/fa";

function ContactDashboard() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {

  fetchEmergency();

  const interval = setInterval(() => {

    fetchEmergency();

  }, 3000);

  return () => clearInterval(interval);

}, [id]);
  const fetchEmergency = async () => {

  try {

    const response = await fetch(

      `https://sentinel-ai-backend-67u8.onrender.com/api/contact-dashboard/${id}`

    );

    const data = await response.json();

    if (data.success) {

      setDashboard(data);

    }

  }

  catch (error) {

    console.error(error);

  }

  finally {

    setLoading(false);

  }

};

  if(loading){

    return(

      <div className="flex justify-center items-center h-screen text-2xl">

        Loading Emergency...

      </div>

    );

  }

  if (!dashboard) {

    return(

      <div className="flex justify-center items-center h-screen text-2xl text-red-600">

        Emergency Not Found

      </div>

    );

  }
  const emergency = dashboard.emergency;

  const isEnded = emergency.status === "ENDED";

const latestLocation = dashboard.latest_location;

const contacts = dashboard.contacts;

  return (

    <div className="min-h-screen bg-slate-100 p-10">

      <div className="max-w-5xl mx-auto">

        <div
  className={`text-white rounded-2xl p-6 shadow-xl ${
    isEnded
      ? "bg-green-600"
      : "bg-red-600"
  }`}
>

<div className="bg-green-50 border border-green-300 rounded-2xl p-5 mt-6 flex justify-between items-center">

  <div>

    <h2 className="text-xl font-bold text-green-700">

      🛰 Live Monitoring Active

    </h2>

    <p className="text-green-600">

      GPS location refreshes automatically every 3 seconds.

    </p>

  </div>

  <div className="bg-green-600 text-white px-5 py-2 rounded-full font-bold">

    LIVE

  </div>

</div>
          <h1 className="text-4xl font-bold">

            {isEnded
  ? "✅ Emergency Resolved"
  : "🚨 Emergency Alert"}

          </h1>

          <p className="mt-2">

            {
  isEnded

  ? "Emergency has been resolved successfully."

  : "Trusted Contact Dashboard"
}

          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">

<div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

  <h2 className="text-2xl font-bold mb-6">

    Emergency Actions

  </h2>

  <div className="flex flex-wrap gap-5">

    {

      !isEnded && (

        <button

          onClick={() => navigate(`/tracking/${id}`)}

          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"

        >

          <FaSatelliteDish />

          Track Live

        </button>

      )

    }

    <button

      onClick={() =>
        window.open(
          `https://sentinel-ai-backend-67u8.onrender.com/api/report/download/${id}`,
          "_blank"
        )
      }

      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"

    >

      <FaFileDownload />

      Download Report

    </button>

    <button

      onClick={() => navigate(`/timeline/${id}`)}

      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"

    >

      <FaStream />

      View Timeline

    </button>

  </div>

</div>

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-6">

              AI Recommendation

            </h2>

            <div className="flex gap-3">

              <FaRobot className="text-indigo-600 mt-1"/>

              <p className="leading-8">

                {emergency.ai_recommendation}

              </p>

            </div>

          </div>

        </div>
<div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

  <h2 className="text-2xl font-bold mb-6">

    👨‍👩‍👧 Trusted Contacts

  </h2>

  <div className="space-y-4">

    {

      contacts.map((contact) => (

        <div
          key={contact.id}
          className="border rounded-xl p-4 flex justify-between items-center"
        >

          <div>

            <h3 className="text-lg font-semibold">

              {contact.name}

            </h3>

            <p className="text-gray-600">

              {contact.relationship}

            </p>

            <p className="text-gray-500">

              📞 {contact.phone}

            </p>

          </div>

          <div>

            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">

              ✓ Notification Delivered

            </span>

          </div>

        </div>

      ))

    }

  </div>

</div>


      </div>

    </div>

  );

}

export default ContactDashboard;