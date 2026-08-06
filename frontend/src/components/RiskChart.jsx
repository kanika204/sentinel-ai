import { FaChartLine } from "react-icons/fa";
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
    if (chartData.length === 0) {
  return (
    <div className="flex h-72 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50">
      <div className="text-center">
        <FaChartLine className="mx-auto mb-4 text-5xl text-slate-400" />

        <h3 className="text-xl font-semibold text-slate-700">
          No Risk Data Available
        </h3>

        <p className="mt-2 text-slate-500">
          Your risk trend will appear here after an emergency is recorded.
        </p>
      </div>
    </div>
  );
}

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      

      <div style={{ width: "100%", height: 300 }}>
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
  dot={{ r: 5 }}
  activeDot={{ r: 8 }}
  animationDuration={1200}
/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RiskChart;