import { useEffect, useState } from "react";
import RiskChart from "../components/RiskChart";
import StatCard from "../components/StatCard";

import {
  FaExclamationTriangle,
  FaUsers,
  FaShieldAlt,
  FaChartLine,
  FaMicrophone,
  FaHistory,
  FaPhoneAlt,
  FaBookMedical,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const historyRes = await fetch("http://127.0.0.1:5000/api/history");
      const historyData = await historyRes.json();

      const contactsRes = await fetch("http://127.0.0.1:5000/api/contacts");
      const contactsData = await contactsRes.json();

      setHistory(historyData.history || []);
      setContacts(contactsData || []);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  const latestEmergency = history.length > 0 ? history[0] : null;

  const averageRisk =
    history.length > 0
      ? Math.round(
          history.reduce((sum, item) => sum + item.risk_score, 0) /
            history.length
        )
      : "--";

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Heading */}

      <h1 className="mb-8 text-4xl font-bold text-slate-800">
        🛡️ SentinelAI Dashboard
      </h1>

      {/* Statistics */}

      <div className="grid gap-6 md:grid-cols-4">

        <StatCard
          title="Emergencies"
          value={history.length}
          color="text-red-500"
          icon={<FaExclamationTriangle className="text-red-500" />}
        />

        <StatCard
          title="Contacts"
          value={contacts.length}
          color="text-blue-500"
          icon={<FaUsers className="text-blue-500" />}
        />

        <StatCard
          title="Latest Risk"
          value={latestEmergency ? latestEmergency.risk_score : "--"}
          color="text-yellow-500"
          icon={<FaShieldAlt className="text-yellow-500" />}
        />

        <StatCard
          title="Average Risk"
          value={averageRisk}
          color="text-green-500"
          icon={<FaChartLine className="text-green-500" />}
        />

      </div>

      {/* Quick Actions */}

<div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">

  <h2 className="mb-6 text-2xl font-bold">
    ⚡ Quick Actions
  </h2>

  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

    <button
      onClick={() => navigate("/voice-sos")}
      className="rounded-xl bg-red-500 p-6 text-white transition hover:scale-105 hover:bg-red-600"
    >
      <FaMicrophone className="mx-auto mb-3 text-4xl" />

      <h3 className="text-xl font-bold">
        Voice SOS
      </h3>

      <p className="mt-2 text-sm">
        Trigger emergency using voice commands.
      </p>
    </button>

    <button
      onClick={() => navigate("/contacts")}
      className="rounded-xl bg-blue-500 p-6 text-white transition hover:scale-105 hover:bg-blue-600"
    >
      <FaPhoneAlt className="mx-auto mb-3 text-4xl" />

      <h3 className="text-xl font-bold">
        Contacts
      </h3>

      <p className="mt-2 text-sm">
        Manage trusted emergency contacts.
      </p>
    </button>

    <button
      onClick={() => navigate("/history")}
      className="rounded-xl bg-green-500 p-6 text-white transition hover:scale-105 hover:bg-green-600"
    >
      <FaHistory className="mx-auto mb-3 text-4xl" />

      <h3 className="text-xl font-bold">
        History
      </h3>

      <p className="mt-2 text-sm">
        View previous emergencies.
      </p>
    </button>

    <button
      onClick={() => navigate("/safety")}
      className="rounded-xl bg-indigo-500 p-6 text-white transition hover:scale-105 hover:bg-indigo-600"
    >
      <FaBookMedical className="mx-auto mb-3 text-4xl" />

      <h3 className="text-xl font-bold">
        Emergency
      </h3>

      <p className="mt-2 text-sm">
        Emergency
      </p>
    </button>

  </div>

</div>

      {/* Risk Chart */}

      <RiskChart history={history} />

      {/* AI Recommendation */}

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">

        <h2 className="mb-4 text-2xl font-bold">
          🤖 Latest AI Recommendation
        </h2>

        {latestEmergency ? (
          <p className="whitespace-pre-wrap leading-8 text-gray-700">
            {latestEmergency.ai_recommendation}
          </p>
        ) : (
          <p>No emergency records available.</p>
        )}

      </div>

      {/* Recent Emergencies */}

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">

        <h2 className="mb-6 text-2xl font-bold">
          🚨 Recent Emergencies
        </h2>

        {history.length === 0 ? (
          <p>No emergency history found.</p>
        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead>

                <tr className="border-b bg-slate-100">

                  <th className="px-4 py-3 text-left">Date</th>

                  <th className="px-4 py-3 text-left">Trigger</th>

                  <th className="px-4 py-3 text-left">Risk</th>

                  <th className="px-4 py-3 text-left">Status</th>

                  <th className="px-4 py-3 text-left">Map</th>

                </tr>

              </thead>

              <tbody>

                {history.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="px-4 py-4">
                      {item.created_at}
                    </td>

                    <td className="px-4 py-4">
                      {item.trigger_type}
                    </td>

                    <td className="px-4 py-4">

                      <span className="rounded-full bg-red-100 px-3 py-1 font-semibold text-red-600">

                        {item.risk_score}

                      </span>

                    </td>

                    <td className="px-4 py-4">

                      <span className="rounded-full bg-green-100 px-3 py-1 font-semibold text-green-600">

                        {item.status}

                      </span>

                    </td>

                    <td className="px-4 py-4">

                      <a
                        href={item.maps_link}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        📍 Open Map
                      </a>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;