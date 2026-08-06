import { useEffect, useRef, useState } from "react";
import EmergencyService from "../../services/EmergencyService";
import {
  FaMicrophone,
  FaStop,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NotificationPanel from "../notifications/NotificationPanel";


function VoiceActivator() {

  // ============================
  // STATES
  // ============================

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);

  const [statusMessage, setStatusMessage] = useState("");
  const [sosTriggered, setSosTriggered] = useState(false);
  const [emergencyId, setEmergencyId] = useState(null);
  const [notifications, setNotifications] = useState([]);
const navigate = useNavigate();
  // ============================
  // REFS
  // ============================

  const recognitionRef = useRef(null);
  const watchIdRef = useRef(null);

  // Prevent duplicate SOS
  const sosLockRef = useRef(false);

  // ============================
  // SPEECH RECOGNITION
  // ============================

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {

      let text = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        text += event.results[i][0].transcript + " ";
      }

      text = text.trim();

      setTranscript(text);

      const lowerText = text.toLowerCase();

      if (
        !sosLockRef.current &&
        (
          lowerText.includes("help") ||
          lowerText.includes("emergency") ||
          lowerText.includes("save me") ||
          lowerText.includes("danger")
        )
      ) {

        console.log("Emergency keyword detected");

        sosLockRef.current = true;

        recognition.stop();

        setIsListening(false);

        getLocationAndTriggerSOS();

      }

    };

    recognition.onerror = (event) => {

      console.error(event);

      setStatusMessage(
        "❌ Speech Recognition Error"
      );

      speakMessage(
        "Speech recognition failed."
      );

      setIsListening(false);

    };

    recognition.onend = () => {

      setIsListening(false);

    };

    recognitionRef.current = recognition;

    return () => {

      recognition.stop();

      if (watchIdRef.current !== null) {

        navigator.geolocation.clearWatch(
          watchIdRef.current
        );

      }

    };

  }, []);

  // ============================
  // TEXT TO SPEECH
  // ============================

  const speakMessage = (message) => {

    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(message);

    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);

  };

  // ============================
  // START LISTENING
  // ============================

  const startListening = () => {

    if (!recognitionRef.current) return;

    setTranscript("");
    setStatusMessage("");
    setSosTriggered(false);

    setEmergencyId(null);

    sosLockRef.current = false;

    recognitionRef.current.start();

    setIsListening(true);

    speakMessage(
      "Voice listening started."
    );

  };

  // ============================
  // STOP LISTENING
  // ============================

  const stopListening = () => {

    if (recognitionRef.current) {

      recognitionRef.current.stop();

    }

    if (watchIdRef.current !== null) {

      navigator.geolocation.clearWatch(
        watchIdRef.current
      );

      watchIdRef.current = null;

    }

    setIsListening(false);

    speakMessage(
      "Voice listening stopped."
    );

  };

  // ============================
  // GET LOCATION
  // ============================

  const getLocationAndTriggerSOS = () => {

    if (!navigator.geolocation) {

      setStatusMessage(
        "Geolocation is not supported."
      );

      speakMessage(
        "Geolocation is not supported."
      );

      return;

    }

    setStatusMessage(
      "📍 Getting current location..."
    );

    navigator.geolocation.getCurrentPosition(

      (position) => {

        triggerSOS(

          position.coords.latitude,
          position.coords.longitude

        );

      },

      (error) => {

        console.error(error);

        setStatusMessage(
          "❌ Unable to get location."
        );

        speakMessage(
          "Unable to access your location."
        );

      },

      {
        enableHighAccuracy: true,
      }

    );

  };

  // ============================
  // PART 2 CONTINUES BELOW...
  // ============================
    // ============================
  // TRIGGER SOS
  // ============================

  const triggerSOS = async (latitude, longitude) => {

    try {

      setStatusMessage(
        "🚨 Triggering Emergency..."
      );

      const response = await fetch(
        "http://127.0.0.1:5000/api/sos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude,
            longitude,
            trigger_type: "VOICE_COMMAND",
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        EmergencyService.setEmergency({

        id: data.emergency_id,

        status: "ACTIVE",

        latitude,

        longitude,

        trigger_type: "VOICE_COMMAND",

        created_at: new Date(),

    });

    console.log(EmergencyService.getEmergency());

        console.log("SOS Created");
        console.log("Emergency ID:", data.emergency_id);

        setEmergencyId(data.emergency_id);

        console.log("Starting Location Tracking...");

        startLocationTracking(
          data.emergency_id
        );
        await notifyContacts(data.emergency_id);

        setStatusMessage(
          "✅ Emergency Created Successfully!"
        );

        setSosTriggered(true);

        speakMessage(
          "Emergency detected. Your location has been shared. Your trusted contacts are being notified. Please move to a safe place."
        );

      } else {

        setStatusMessage(
          "❌ Failed to trigger emergency."
        );

        sosLockRef.current = false;

        speakMessage(
          "Sorry. I could not trigger the emergency."
        );

      }

    } catch (error) {

      console.error(error);

      sosLockRef.current = false;

      setStatusMessage(
        "❌ Server Error."
      );

      speakMessage(
        "A server error occurred while triggering the emergency."
      );

    }

  };

  const notifyContacts = async (emergencyId) => {

  try {

    setStatusMessage("📨 Sending emergency alerts...");

    const response = await fetch(
      "http://127.0.0.1:5000/api/notify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emergency_id: emergencyId,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {

      console.log("Notifications");

      console.table(data.notifications);
      setNotifications(data.notifications);

      setStatusMessage(
        `✅ ${data.notifications.length} trusted contacts notified`
      );

    }

    else {

      setStatusMessage("❌ Notification Failed");

    }

  }

  catch(error){

    console.error(error);

    setStatusMessage("❌ Notification Server Error");

  }

};

  // ============================
  // LIVE LOCATION TRACKING
  // ============================

  const startLocationTracking = (emergencyId) => {

    console.log(
      "startLocationTracking called"
    );

    if (!navigator.geolocation) {

      console.log(
        "Geolocation not supported"
      );

      return;

    }

    if (watchIdRef.current !== null) {

      navigator.geolocation.clearWatch(
        watchIdRef.current
      );

    }

    watchIdRef.current =
      navigator.geolocation.watchPosition(

        async (position) => {

          console.log(
            "Tracking Location..."
          );

          console.log(
            position.coords.latitude,
            position.coords.longitude
          );

          try {

            const response =
              await fetch(
                "http://127.0.0.1:5000/api/location/update",
                {
                  method: "POST",
                  headers: {
                    "Content-Type":
                      "application/json",
                  },
                  body: JSON.stringify({
                    emergency_id: emergencyId,
                    latitude:
                      position.coords.latitude,
                    longitude:
                      position.coords.longitude,
                  }),
                }
              );

            const result =
              await response.json();

            console.log(
              "Location API Response:",
              result
            );

          } catch (error) {

            console.error(
              "Location update failed:",
              error
            );

          }

        },

        (error) => {

          console.error(
            "watchPosition Error:",
            error
          );

        },

        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000,
        }

      );

  };

  // ============================
  // UI
  // ============================

  if (!supported) {
    return (
      <div className="bg-red-100 text-red-700 p-6 rounded-xl">
        Your browser does not support Speech Recognition.
        <br />
        Please use Google Chrome.
      </div>
    );
  }

  return (
  <div className="bg-white rounded-2xl shadow-lg p-8">

    <h2 className="text-3xl font-bold mb-6">
      🎤 Voice SOS
    </h2>

    {/* Listening Status */}
    <div className="mb-6">

      <p className="text-lg font-semibold">
        Status
      </p>

      <div className="mt-2">
        {isListening ? (
          <span className="text-green-600 font-bold">
            🟢 Listening...
          </span>
        ) : (
          <span className="text-red-600 font-bold">
            🔴 Not Listening
          </span>
        )}
      </div>

    </div>

    {/* Transcript */}
    <div className="bg-gray-100 rounded-xl p-5 min-h-[120px]">

      <p className="font-semibold mb-2">
        Live Transcript
      </p>

      <p className="text-gray-700 break-words">
        {transcript || "Start speaking..."}
      </p>

    </div>

    {/* Status */}
    {statusMessage && (
      <div className="mt-6 p-4 rounded-xl bg-blue-100 text-blue-700 font-semibold">
        {statusMessage}
      </div>
    )}

    {/* Success Card */}
    {emergencyId && (

      <div className="mt-6 p-6 rounded-2xl border border-green-300 bg-green-50">

        <h3 className="text-2xl font-bold text-green-700">
          ✅ Emergency Created Successfully
        </h3>

        <p className="mt-3 text-gray-700">
          <strong>Emergency ID:</strong> {emergencyId}
        </p>

        <p className="mt-2 text-gray-600">
          Your emergency has been registered successfully.
          Live GPS tracking has started and your trusted contacts
          are being notified.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">

          <button
            onClick={() => navigate(`/tracking/${emergencyId}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
          >
            📍 Track Live
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition"
          >
            🏠 Dashboard
          </button>

        </div>

      </div>

    )}

<NotificationPanel
    notifications={notifications}
    emergencyId={emergencyId}
/>
    {/* Buttons */}
    <div className="mt-8 flex flex-wrap gap-4">

      <button
        onClick={startListening}
        disabled={isListening}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition"
      >
        <FaMicrophone />
        Start Listening
      </button>

      <button
        onClick={stopListening}
        disabled={!isListening}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition"
      >
        <FaStop />
        Stop
      </button>

    </div>

    {/* Transcript Success */}
    {transcript && (
      <div className="mt-6 flex items-center gap-2 text-green-600 font-semibold">

        <FaCheckCircle />

        Speech detected successfully.

      </div>
    )}

  </div>
);
}

export default VoiceActivator;