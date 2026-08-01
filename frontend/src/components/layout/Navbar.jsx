import { FiShield } from "react-icons/fi";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

        <div className="flex items-center gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">

            <FiShield className="text-2xl text-red-500"/>

          </div>

          <div>

            <h1 className="text-2xl font-bold text-slate-800">

              SentinelAI

            </h1>

            <p className="text-sm text-slate-500">

              Your Intelligent Safety Companion

            </p>

          </div>

        </div>

        <div className="rounded-full bg-green-100 px-5 py-2 text-sm font-semibold text-green-700">

          ● Protected

        </div>

      </div>

    </nav>
  );
}

export default Navbar;