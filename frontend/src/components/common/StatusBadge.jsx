function StatusBadge({ status }) {
  const styles = {
    protected: "bg-green-100 text-green-700",

    warning: "bg-yellow-100 text-yellow-700",

    danger: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-4 py-2 text-sm font-semibold ${
        styles[status]
      }`}
    >
      {status.toUpperCase()}
    </span>
  );
}

export default StatusBadge;