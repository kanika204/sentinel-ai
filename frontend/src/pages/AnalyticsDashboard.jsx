import { useEffect, useState } from "react";

import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaChartLine,
  FaBell,
  FaPercentage,
  FaHistory,
} from "react-icons/fa";

function AnalyticsDashboard() {

  const [analytics, setAnalytics] = useState(null);

  const [recentEmergencies, setRecentEmergencies] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchAnalytics();

  }, []);

  async function fetchAnalytics() {

    try {

      const response = await fetch(
        "http://127.0.0.1:5000/api/analytics"
      );

      const data = await response.json();

      if (data.success) {

        setAnalytics(data.analytics);

        setRecentEmergencies(data.recent_emergencies);

      }

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (

      <div className="flex justify-center items-center h-screen text-2xl">

        Loading Analytics...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-100 p-10">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">

          📊 SentinelAI Analytics Dashboard

        </h1>

        {/* KPI Cards */}

        <div className="grid md:grid-cols-3 gap-6">

          <Card
            title="Total Emergencies"
            value={analytics.total_emergencies}
            color="bg-red-500"
            icon={<FaExclamationTriangle />}
          />

          <Card
            title="Active Emergencies"
            value={analytics.active_emergencies}
            color="bg-yellow-500"
            icon={<FaHistory />}
          />

          <Card
            title="Resolved Emergencies"
            value={analytics.resolved_emergencies}
            color="bg-green-600"
            icon={<FaCheckCircle />}
          />

          <Card
            title="Average Risk Score"
            value={analytics.average_risk_score}
            color="bg-indigo-600"
            icon={<FaChartLine />}
          />

          <Card
            title="Notifications Sent"
            value={analytics.notifications_sent}
            color="bg-blue-600"
            icon={<FaBell />}
          />

          <Card
            title="Success Rate"
            value={`${analytics.notification_success_rate}%`}
            color="bg-purple-600"
            icon={<FaPercentage />}
          />

        </div>

        {/* Recent Emergencies */}

        <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-6">

            Recent Emergencies

          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-3">ID</th>

                <th className="text-left">Trigger</th>

                <th className="text-left">Risk Score</th>

                <th className="text-left">Status</th>

                <th className="text-left">Created At</th>

              </tr>

            </thead>

            <tbody>

              {

                recentEmergencies.map((emergency) => (

                  <tr
                    key={emergency.id}
                    className="border-b hover:bg-slate-50"
                  >

                    <td className="py-4">

                      #{emergency.id}

                    </td>

                    <td>

                      {emergency.trigger_type}

                    </td>

                    <td>

                      {emergency.risk_score}

                    </td>

                    <td>

                      <span className={`px-3 py-1 rounded-full text-white text-sm ${
                        emergency.status === "ACTIVE"
                          ? "bg-red-500"
                          : "bg-green-600"
                      }`}>

                        {emergency.status}

                      </span>

                    </td>

                    <td>

                      {emergency.created_at}

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

function Card({

  title,

  value,

  color,

  icon,

}) {

  return (

    <div className={`${color} rounded-2xl shadow-lg text-white p-6`}>

      <div className="flex justify-between items-center">

        <div>

          <p className="text-lg">

            {title}

          </p>

          <h2 className="text-4xl font-bold mt-2">

            {value}

          </h2>

        </div>

        <div className="text-4xl">

          {icon}

        </div>

      </div>

    </div>

  );

}

export default AnalyticsDashboard;