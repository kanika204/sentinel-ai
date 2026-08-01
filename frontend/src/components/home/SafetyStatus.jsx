import {
  FiMapPin,
  FiMic,
  FiSmartphone,
  FiUsers,
} from "react-icons/fi";

import StatusBadge from "../common/StatusBadge";

function SafetyStatus() {
  const services = [
    {
      title: "Location Services",
      status: "Active",
      icon: <FiMapPin size={26} />,
    },
    {
      title: "Voice Trigger",
      status: "Ready",
      icon: <FiMic size={26} />,
    },
    {
      title: "Shake Detection",
      status: "Enabled",
      icon: <FiSmartphone size={26} />,
    },
    {
      title: "Trusted Contacts",
      status: "Connected",
      icon: <FiUsers size={26} />,
    },
  ];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        

          <div className="mb-14 text-center">
            <h2 className="text-center text-4xl font-bold text-slate-800">
              Safety Status
            </h2>

            <p className="mt-3 text-lg text-slate-500">
              Monitor the availability of your essential safety services.
            </p>
          </div>

        {/* Cards */}

 <div className="mt-12 flex flex-wrap justify-center gap-8">

  {services.map((service) => (

    <div
      key={service.title}
      className="w-72 rounded-3xl border border-slate-100 bg-gradient-to-br from-pink-50 via-white to-violet-50 p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-violet-600 shadow">
        {service.icon}
      </div>

      <h3 className="mt-6 text-xl font-semibold text-slate-800">
        {service.title}
      </h3>

      <p className="mt-2 text-slate-500">
        {service.status}
      </p>
    </div>

  ))}

</div>

      </div>
    </section>
  );
}

export default SafetyStatus;