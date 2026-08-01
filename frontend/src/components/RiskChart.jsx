import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function RiskChart({ history }) {
  const chartData = history
    .slice()
    .reverse()
    .map((item, index) => ({
      name: `SOS ${index + 1}`,
      risk: item.risk_score,
    }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-700">
        📈 Risk Trend
      </h2>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis domain={[0, 100]} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="risk"
              stroke="#ef4444"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RiskChart;