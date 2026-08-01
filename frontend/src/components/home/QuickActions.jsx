import {
  FiMic,
  FiSmartphone,
  FiPhone,
  FiClock,
} from "react-icons/fi";

import QuickActionCard from "./QuickActionCard";

function QuickActions() {
  const actions = [
    {
      title: "Voice SOS",
      description: "Activate emergency assistance using your voice.",
      icon: <FiMic size={28} className="text-violet-600" />,
      bg: "bg-violet-50",
    },
    {
      title: "Shake Detection",
      description: "Shake your phone to instantly trigger SOS.",
      icon: <FiSmartphone size={28} className="text-sky-600" />,
      bg: "bg-sky-50",
    },
    {
      title: "Fake Call",
      description: "Receive a simulated call for uncomfortable situations.",
      icon: <FiPhone size={28} className="text-pink-600" />,
      bg: "bg-pink-50",
    },
    {
      title: "Check-In Timer",
      description: "Notify trusted contacts if you miss a check-in.",
      icon: <FiClock size={28} className="text-green-600" />,
      bg: "bg-green-50",
    },
  ];

  return (
    <section className="w-full py-24 bg-slate-50">
      <div className="mt-12 flex flex-wrap justify-center gap-8">

        <div className="mb-14 text-center">
          <h2 className="text-4xl font-bold text-slate-800">
            Quick Actions
          </h2>

          <p className="mt-3 text-lg text-slate-500">
            Access your essential safety tools instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {actions.map((action) => (
            <QuickActionCard
              key={action.title}
              icon={action.icon}
              title={action.title}
              description={action.description}
              bgColor={action.bg}
              iconBg="bg-white"
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default QuickActions;