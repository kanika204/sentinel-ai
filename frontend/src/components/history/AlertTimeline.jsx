import AlertCard from "./AlertCard";

function AlertTimeline({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-10 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          No Emergency History
        </h2>

        <p className="mt-2 text-gray-500">
          Your emergency records will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {alerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
        />
      ))}
    </div>
  );
}

export default AlertTimeline;