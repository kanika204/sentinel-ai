import SOSButton from "../components/safety/SOSButton";

function Safety() {
  return (
    <section className="min-h-screen bg-slate-50 py-16">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <h1 className="text-5xl font-bold text-slate-800">
            Emergency SOS
          </h1>

          <p className="mt-4 text-lg text-slate-500">
            Instantly alert your trusted contacts during an emergency.
          </p>

        </div>

        <div className="mt-20 flex justify-center">
          <SOSButton />
        </div>

      </div>

    </section>
  );
}

export default Safety;