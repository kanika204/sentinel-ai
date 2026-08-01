function QuickActionCard({
  icon,
  title,
  description,
  bgColor,
  iconBg,
}) {
  return (
    <div
      className={`rounded-3xl ${bgColor} p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer`}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg} shadow-sm`}
      >
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-3 text-slate-500 leading-7">
        {description}
      </p>
    </div>
  );
}

export default QuickActionCard;