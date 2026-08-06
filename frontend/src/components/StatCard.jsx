import { motion } from "framer-motion";

function StatCard({ icon, title, value, color }) {
 return (
  <motion.div
    whileHover={{ scale: 1.03, y: -3 }}
    transition={{ duration: 0.2 }}
    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all hover:shadow-xl"
  >
    <div className="flex items-start justify-between">

      <div>
        <p className="text-base font-semibold text-slate-500">
          {title}
        </p>

        <h2 className={`mt-4 text-5xl font-bold ${color}`}>
          {value}
        </h2>
      </div>

      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
        {icon}
      </div>

    </div>
  </motion.div>
);
}

export default StatCard;