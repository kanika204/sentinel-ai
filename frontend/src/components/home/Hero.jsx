import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { FiShield } from "react-icons/fi";

function Hero() {

  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden py-20">

      {/* Background Blur Effects */}

      <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-pink-400/40 blur-[120px]"></div>

      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-400/40 blur-[120px]"></div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-100 to-pink-100 px-5 py-2 text-sm font-semibold text-violet-700 shadow-lg">
    ✨ AI Powered Safety
</div>

        {/* Logo */}

        <div className="mb-10 flex h-20 w-20 animate-float items-center justify-center rounded-full bg-gradient-to-br from-red-50 to-pink-100 shadow-xl shadow-red-200/40">

          <FiShield className="text-4xl text-red-500" />

        </div>

        {/* Heading */}

        <h1 className="text-6xl font-black tracking-tight text-slate-900 md:text-8xl">

          Feel Safe.

        </h1>

        <h2 className="mt-3 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-6xl font-black text-transparent md:text-8xl">

          Stay Protected.

        </h2>

        {/* Description */}

        <p className="mt-10 max-w-3xl text-xl leading-9 text-slate-600">

          SentinelAI is your intelligent safety companion that combines
          emergency assistance, trusted contacts, proactive monitoring,
          and smart safety tools to help you feel secure every day.

        </p>
{/* Buttons */}

<div className="mt-12 flex flex-wrap justify-center gap-6">

  <Button
    variant="primary"
    size="lg"
    onClick={() => navigate("/dashboard")}
    className="rounded-xl px-8 py-4 text-lg font-semibold shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-red-300/50"
  >
    🚀 Get Started
  </Button>

  <Button
    variant="secondary"
    size="lg"
    onClick={() =>
      document
        .getElementById("quick-actions")
        ?.scrollIntoView({ behavior: "smooth" })
    }
    className="rounded-xl border border-violet-200 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:border-violet-500 hover:bg-violet-50"
  >
    Learn More →
  </Button>

</div>
{/* Scroll Indicator */}

<div
  onClick={() =>
    document.getElementById("quick-actions")?.scrollIntoView({
      behavior: "smooth",
    })
  }
  className="mt-20 flex cursor-pointer flex-col items-center text-slate-400 transition-all duration-300 hover:text-violet-600"
>
  <p className="mb-2 text-sm font-medium tracking-wide">
    Scroll to explore
  </p>

  <div className="animate-bounce text-3xl">
    ⌄
  </div>
</div>

      </div>

    </section>
  );
}

export default Hero;