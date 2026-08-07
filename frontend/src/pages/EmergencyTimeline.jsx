import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  FaExclamationTriangle,
  FaRobot,
  FaBell,
  FaMapMarkerAlt,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";

function EmergencyTimeline() {

  const { id } = useParams();

  const [timeline, setTimeline] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchTimeline();

  }, []);

  async function fetchTimeline() {

    try {

      const response = await fetch(

        `https://sentinel-ai-backend-67u8.onrender.com/api/timeline/${id}`

      );

      const data = await response.json();

      if (data.success) {

        setTimeline(data.timeline);

      }

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoading(false);

    }

  }

  function getIcon(title) {

    if (title.includes("Emergency"))

      return <FaExclamationTriangle className="text-red-600"/>;

    if (title.includes("Risk"))

      return <FaExclamationTriangle className="text-orange-500"/>;

    if (title.includes("AI"))

      return <FaRobot className="text-indigo-600"/>;

    if (title.includes("Contact"))

      return <FaBell className="text-green-600"/>;

    if (title.includes("Tracking"))

      return <FaMapMarkerAlt className="text-red-500"/>;

    if (title.includes("Report"))

      return <FaFileAlt className="text-blue-600"/>;

    if (title.includes("Resolved"))

      return <FaCheckCircle className="text-green-700"/>;

    return <FaCheckCircle/>;

  }

  if (loading) {

    return (

      <div className="flex justify-center items-center h-screen text-2xl">

        Loading Timeline...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-100 p-10">

      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-2xl shadow-xl p-8">

          <h1 className="text-4xl font-bold mb-2">

            🚨 Emergency Timeline

          </h1>

          <p className="text-gray-500">

            Complete sequence of emergency events

          </p>

        </div>

        <div className="mt-8">

          {

            timeline.map((item,index)=>(

              <div
                key={index}
                className="flex gap-5"
              >

                <div className="flex flex-col items-center">

                  <div className="h-12 w-12 rounded-full bg-white shadow flex items-center justify-center text-xl">

                    {getIcon(item.title)}

                  </div>

                  {

                    index !== timeline.length-1 && (

                      <div className="w-1 h-24 bg-gray-300"></div>

                    )

                  }

                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 flex-1 mb-8">

                  <div className="flex justify-between">

                    <h2 className="text-xl font-bold">

                      {item.title}

                    </h2>

                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      item.status==="completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}>

                      {item.status}

                    </span>

                  </div>

                  <p className="mt-3 text-gray-600">

                    {item.description}

                  </p>

                  <p className="mt-4 text-sm text-gray-500">

                    {item.time}

                  </p>

                </div>

              </div>

            ))

          }

        </div>

      </div>

    </div>

  );

}

export default EmergencyTimeline;