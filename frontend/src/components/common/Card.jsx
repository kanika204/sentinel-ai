function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-3xl bg-white p-8 shadow-lg border border-slate-100 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;