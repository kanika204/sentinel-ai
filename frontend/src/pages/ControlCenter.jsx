import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaExclamationTriangle,
  FaSatelliteDish,
  FaUserFriends,
  FaFileDownload,
  FaStream,
  FaPowerOff,
} from "react-icons/fa";

function ControlCenter() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState(null);

  useEffect(() => {

    fetchControlCenter();

    const interval = setInterval(() => {

      fetchControlCenter();

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  async function fetchControlCenter() {

    try {

      const response = await fetch(

        "https://sentinel-ai-backend-67u8.onrender.com/api/control-center"

      );

      const result = await response.json();

      if (result.success) {

        setData(result);

      }

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoading(false);

    }

  }
  async function endEmergency() {

  if (!window.confirm("Are you sure you want to end this emergency?")) {

    return;

  }

  try {

    const response = await fetch(

      `https://sentinel-ai-backend-67u8.onrender.com/api/emergency/${data.active_emergency.id}/end`,

      {

        method: "PUT",

      }

    );

    const result = await response.json();

    if (result.success) {

      alert("Emergency ended successfully.");

      fetchControlCenter();

    } else {

      alert(result.message);

    }

  }

  catch (error) {

    console.error(error);

    alert("Failed to end emergency.");

  }

}

  if (loading) {

    return (

      <div className="flex justify-center items-center h-screen text-2xl">

        Loading Control Center...

      </div>

    );

  }

  const active = data.active_emergency;

  return (

    <div className="min-h-screen bg-slate-100 p-10">

      <div className="max-w-7xl mx-auto">

        <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl">

          <h1 className="text-4xl font-bold">

            🚨 SentinelAI Control Center

          </h1>

          <p className="mt-2 text-slate-300">

            Central Emergency Monitoring Dashboard

          </p>

        </div>

        {/* Active Emergency */}

        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-5">

            Active Emergency

          </h2>

          {

            active ? (

              <div className="space-y-3">

                <p>

                  <strong>ID:</strong> #{active.id}

                </p>

                <p>

                  <strong>Trigger:</strong> {active.trigger_type}

                </p>

                <p>

                  <strong>Risk Score:</strong> {active.risk_score}

                </p>

                <p>

                  <strong>Status:</strong>

                  <span className="ml-2 bg-red-100 text-red-700 px-3 py-1 rounded-full">

                    {active.status}

                  </span>

                </p>

              </div>

            ) : (

              <p className="text-green-600 font-semibold">

                ✅ No Active Emergency

              </p>

            )

          }

        </div>

        {/* Summary */}

        <div className="grid md:grid-cols-2 gap-6 mt-8">

          <div className="bg-blue-600 text-white rounded-2xl p-6">

            <h3 className="text-xl">

              Total Emergencies

            </h3>

            <p className="text-4xl font-bold mt-3">

              {data.summary.total_emergencies}

            </p>

          </div>

          <div className="bg-green-600 text-white rounded-2xl p-6">

            <h3 className="text-xl">

              Notifications Sent

            </h3>

            <p className="text-4xl font-bold mt-3">

              {data.summary.notifications_sent}

            </p>

          </div>

        </div>

        {/* Quick Actions */}

        {

          active && (

            <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

              <h2 className="text-2xl font-bold mb-6">

                Quick Actions

              </h2>

         <div className="flex flex-wrap gap-5">

  <button
    onClick={() => navigate(`/tracking/${active.id}`)}
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
  >
    <FaSatelliteDish />
    Live Tracking
  </button>

  <button
    onClick={() => navigate(`/contact/${active.id}`)}
    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
  >
    <FaUserFriends />
    Contact Dashboard
  </button>

  <button
    onClick={() => navigate(`/timeline/${active.id}`)}
    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
  >
    <FaStream />
    Timeline
  </button>

  <button
    onClick={() =>
      window.open(
        `https://sentinel-ai-backend-67u8.onrender.com/api/report/download/${active.id}`,
        "_blank"
      )
    }
    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
  >
    <FaFileDownload />
    Report
  </button>

  <button
    onClick={endEmergency}
    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
  >
    <FaPowerOff />
    End Emergency
  </button>

</div>

            </div>

          )

        }

        {/* Recent Emergencies */}

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

          <h2 className="text-2xl font-bold mb-6">

            Recent Emergencies

          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">ID</th>

                <th className="text-left">Trigger</th>

                <th className="text-left">Risk</th>

                <th className="text-left">Status</th>

              </tr>

            </thead>

            <tbody>

              {

                data.recent_emergencies.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="py-4">

                      #{item.id}

                    </td>

                    <td>

                      {item.trigger_type}

                    </td>

                    <td>

                      {item.risk_score}

                    </td>

                    <td>

                      {item.status}

                    </td>

                  </tr>

                ))

              }

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default ControlCenter;