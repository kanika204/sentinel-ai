function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
}) {
  const baseStyle =
    "rounded-full font-semibold transition-all duration-300 cursor-pointer";

  const variants = {
    primary:
      "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg",

    secondary:
  "bg-violet-100 text-violet-700 hover:bg-violet-200 shadow-sm",

    outline:
      "border border-slate-300 bg-white hover:bg-slate-100 text-slate-700",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",

    md: "px-6 py-3 text-base",

    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </button>
  );
}

export default Button;