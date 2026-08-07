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
  FaSatelliteDish,
  FaChartBar,
  FaStream,
  FaDesktop,
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
      const historyRes = await fetch("https://sentinel-ai-backend-67u8.onrender.com/api/history");
      const historyData = await historyRes.json();

      const contactsRes = await fetch("https://sentinel-ai-backend-67u8.onrender.com/api/contacts");
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

      <div className="mb-8 flex items-center gap-4">
  <div className="rounded-xl bg-blue-100 p-3">
    <FaShieldAlt className="text-3xl text-blue-600" />
  </div>

  <div>
    <h1 className="text-4xl font-bold text-slate-800">
      SentinelAI Dashboard
    </h1>

    <p className="mt-1 text-slate-500">
      Monitor emergencies and manage safety tools
    </p>
  </div>
</div>

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

<div className="mt-8">

  <h2 className="mb-6 flex items-center gap-2 text-3xl font-bold text-slate-800">
    ⚡ Quick Actions
  </h2>

  <div className="grid gap-6 md:grid-cols-4">


    <button
  onClick={() => navigate("/voice-sos")}
  className="flex h-36 flex-col items-center justify-center rounded-2xl bg-red-500 p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-red-600 hover:shadow-xl"
>
  <FaMicrophone className="mb-3 text-3xl" />

  <h3 className="text-2xl font-bold">
    Voice SOS
  </h3>

  <p className="mt-2 text-center text-sm opacity-90">
    Trigger emergency using voice commands.
  </p>
</button>

    <button
  onClick={() => navigate("/contacts")}
  className="flex h-36 flex-col items-center justify-center rounded-2xl bg-blue-500 p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600 hover:shadow-xl"
>
  <FaPhoneAlt className="mb-3 text-3xl" />

  <h3 className="text-2xl font-bold">
    Contacts
  </h3>

  <p className="mt-2 text-center text-sm opacity-90">
    Manage trusted emergency contacts.
  </p>
</button>

    <button
  onClick={() => navigate("/history")}
  className="flex h-36 flex-col items-center justify-center rounded-2xl bg-green-500 p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-green-600 hover:shadow-xl"
>
  <FaHistory className="mb-3 text-3xl" />

  <h3 className="text-2xl font-bold">
    History
  </h3>

  <p className="mt-2 text-center text-sm opacity-90">
    View previous emergencies.
  </p>
</button>

    <button
  onClick={() => navigate("/safety")}
  className="flex h-36 flex-col items-center justify-center rounded-2xl bg-indigo-500 p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-600 hover:shadow-xl"
>
  <FaBookMedical className="mb-3 text-3xl" />

  <h3 className="text-2xl font-bold">
    Emergency
  </h3>

  <p className="mt-2 text-center text-sm opacity-90">
    Safety assistance tools.
  </p>
</button>

<button
  onClick={() => navigate("/control-center")}
  className="flex h-36 flex-col items-center justify-center rounded-2xl bg-slate-800 p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-slate-900 hover:shadow-xl"
>
  <FaDesktop className="mb-3 text-3xl" />

  <h3 className="text-2xl font-bold">
    Control Center
  </h3>

  <p className="mt-2 text-center text-sm opacity-90">
    Central emergency monitoring.
  </p>
</button>

<button
  onClick={() => navigate("/analytics")}
  className="flex h-36 flex-col items-center justify-center rounded-2xl bg-purple-600 p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-purple-700 hover:shadow-xl"
>
  <FaChartBar className="mb-3 text-3xl" />

  <h3 className="text-2xl font-bold">
    Analytics
  </h3>

  <p className="mt-2 text-center text-sm opacity-90">
    View system statistics.
  </p>
</button>

<button
  onClick={() => {
    if (history.length > 0) {
      navigate(`/timeline/${history[0].id}`);
    }
  }}
  className="flex h-36 flex-col items-center justify-center rounded-2xl bg-orange-600 p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-orange-700 hover:shadow-xl"
>
  <FaStream className="mb-3 text-3xl" />

  <h3 className="text-2xl font-bold">
    Timeline
  </h3>

  <p className="mt-2 text-center text-sm opacity-90">
    View emergency timeline.
  </p>
</button>

<button
  onClick={() => {
    if (history.length > 0) {
      navigate(`/tracking/${history[0].id}`);
    }
  }}
  className="flex h-36 flex-col items-center justify-center rounded-2xl bg-cyan-600 p-6 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-700 hover:shadow-xl"
>
  <FaSatelliteDish className="mb-3 text-3xl" />

  <h3 className="text-2xl font-bold">
    Live Tracking
  </h3>

  <p className="mt-2 text-center text-sm opacity-90">
    Monitor live GPS location.
  </p>
</button>

  </div>

</div>

      {/* Risk Trend */}

<div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">

  <div className="mb-6 flex items-center justify-between">

    <div className="flex items-center gap-3">
      <FaChartLine className="text-2xl text-blue-600" />

      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Risk Trend
        </h2>

        <p className="text-sm text-slate-500">
          Emergency risk score over time
        </p>
      </div>
    </div>

    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-600">
      Live
    </span>

  </div>

  <RiskChart history={history} />

</div>
{/* AI Recommendation */}

<div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">

  <div className="mb-5 flex items-center gap-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
      🤖
    </div>

    <div>
      <h2 className="text-2xl font-bold text-slate-800">
        AI Recommendation
      </h2>

      <p className="text-sm text-slate-500">
        Personalized safety suggestions
      </p>
    </div>
  </div>

  {latestEmergency ? (
    <div className="rounded-xl bg-violet-50 p-5">
      <p className="leading-8 text-slate-700">
        {latestEmergency.ai_recommendation}
      </p>
    </div>
  ) : (
    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">

      <div className="mb-3 text-5xl">
        🤖
      </div>

      <h3 className="text-lg font-semibold text-slate-700">
        No Recommendations Yet
      </h3>

      <p className="mt-2 text-slate-500">
        AI recommendations will appear after an emergency is analyzed.
      </p>

    </div>
  )}

</div>

      {/* Recent Emergencies */}

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">

        <div className="mb-6 flex items-center justify-between">

  <div>
    <h2 className="text-2xl font-bold text-slate-800">
      Recent Emergencies
    </h2>

    <p className="text-sm text-slate-500">
      Latest emergency records
    </p>
  </div>

  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-600">
    {history.length} Records
  </span>

</div>

        {history.length === 0 ? (
          <div className="py-12 text-center">

  <div className="mb-4 text-5xl">
    🚨
  </div>

  <h3 className="text-lg font-semibold text-slate-700">
    No Emergencies Found
  </h3>

  <p className="mt-2 text-slate-500">
    Your emergency history will appear here.
  </p>

</div>
        ) : (

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead>

                <tr className="border-b bg-slate-50 text-slate-600">

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
                    className="border-b transition-colors hover:bg-blue-50"
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