function QuickActionCard({
  icon,
  title,
  description,
  bgColor,
  iconBg,
}) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 ${bgColor} p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer`}
    >
      {/* Icon */}
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-xl ${iconBg} shadow-md`}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="mt-5 text-xl font-bold text-slate-800">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

     
    </div>
  );
}

export default QuickActionCard;