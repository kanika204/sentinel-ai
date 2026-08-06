import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { FiShield } from "react-icons/fi";

function Hero() {

  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden py-20">

      {/* Background Blur Effects */}

      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl"></div>

      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl"></div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 text-center">

        {/* Logo */}

        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 shadow-md">

          <FiShield className="text-4xl text-red-500" />

        </div>

        {/* Heading */}

        <h1 className="text-5xl font-extrabold leading-tight text-slate-800 md:text-7xl">

          Feel Safe.

        </h1>

        <h2 className="mt-3 text-5xl font-extrabold text-violet-600 md:text-7xl">

          Stay Protected.

        </h2>

        {/* Description */}

        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-500 md:text-xl">

          SentinelAI is your intelligent safety companion that combines
          emergency assistance, trusted contacts, proactive monitoring,
          and smart safety tools to help you feel secure every day.

        </p>

        {/* Buttons */}

        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate("/dashboard")}
          >
            Get Started
          </Button>

          <Button
  variant="secondary"
  size="lg"
>
  Learn More
</Button>

        </div>

        {/* Scroll Indicator */}

        <div
          onClick={() =>
            document
              .getElementById("quick-actions")
              ?.scrollIntoView({
                behavior: "smooth",
              })
          }
          className="mt-20 cursor-pointer animate-bounce text-3xl text-slate-400 transition hover:text-slate-700"
        >
          ↓
        </div>

      </div>

    </section>
  );
}

export default Hero;