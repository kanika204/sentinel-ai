import { motion } from "framer-motion";

function StatCard({ icon, title, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500">{title}</p>

          <h2 className={`text-4xl font-bold mt-3 ${color}`}>
            {value}
          </h2>
        </div>

        <div className="text-5xl">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;