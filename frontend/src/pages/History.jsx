import { useEffect, useState } from "react";
import AlertTimeline from "../components/history/AlertTimeline";

function History() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/history");
      const data = await response.json();

      if (data.success) {
        setAlerts(data.history);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading Emergency History...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        🚨 Emergency History
      </h1>

      <AlertTimeline alerts={alerts} />

    </div>
  );
}

export default History;