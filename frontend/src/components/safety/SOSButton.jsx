import { motion } from "framer-motion";
import { useState } from "react";
import useLongPress from "../../hooks/useLongPress";

function SOSButton() {

  const [status, setStatus] = useState(
    "Press and hold for emergency assistance"
  );

  const handleSOS = async () => {

  setStatus("Getting your location...");

  if (!navigator.geolocation) {
    setStatus("❌ Geolocation is not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(

    async (position) => {

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      setStatus("Sending SOS...");

      try {

        const response = await fetch("http://127.0.0.1:5000/api/sos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude,
            longitude,
            trigger_type: "SOS_BUTTON",
          }),
        });

        const data = await response.json();
        console.log(data.ai_recommendation);
        if (data.success) {
          setStatus(
            `🚨 SOS Sent | ${data.risk_level} Risk (${data.risk_score})`
          );
        } else {
          setStatus("❌ Failed to send SOS");
        }

      } catch (error) {
        console.error(error);
        setStatus("❌ Unable to connect to server");
      }

    },

    (error) => {
      console.error(error);
      setStatus("❌ Unable to get location");
    }

  );
};

  const longPressEvents = useLongPress(handleSOS, 3000);

  return (
    <div className="flex flex-col items-center">

      <motion.button
        {...longPressEvents}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(239,68,68,.5)",
            "0 0 0 30px rgba(239,68,68,0)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-2xl"
      >
        <span className="text-6xl font-bold text-white">
          SOS
        </span>
      </motion.button>

      <p className="mt-8 text-lg text-slate-500">
        {status}
      </p>

    </div>
  );
}

export default SOSButton;