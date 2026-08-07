import { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaStop,
  FaCheckCircle,
} from "react-icons/fa";

const API_BASE_URL =
  "https://sentinel-ai-backend-67u8.onrender.com";

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

  // Shake detection
  const [shakeEnabled, setShakeEnabled] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);

  // ============================
  // REFS
  // ============================

  const recognitionRef = useRef(null);
  const watchIdRef = useRef(null);

  // Prevent duplicate SOS
  const sosLockRef = useRef(false);

  // Shake detection refs
  const shakeCountRef = useRef(0);
  const lastShakeTimeRef = useRef(0);
  const shakeResetTimerRef = useRef(null);
  const lastTriggerTimeRef = useRef(0);

  // ============================
  // SHAKE SETTINGS
  // ============================

  const SHAKE_THRESHOLD = 18;
  const REQUIRED_SHAKES = 3;
  const SHAKE_WINDOW = 1500;
  const MIN_SHAKE_INTERVAL = 180;
  const SOS_COOLDOWN = 10000;

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

        getLocationAndTriggerSOS("VOICE_COMMAND");
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
      try {
        recognition.stop();
      } catch (error) {
        console.log("Recognition already stopped.");
      }

      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(
          watchIdRef.current
        );
      }

      if (shakeResetTimerRef.current) {
        clearTimeout(shakeResetTimerRef.current);
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

    try {
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
    } catch (error) {
      console.error(error);
    }
  };

  // ============================
  // STOP LISTENING
  // ============================

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log("Recognition already stopped.");
      }
    }

    setIsListening(false);

    speakMessage(
      "Voice listening stopped."
    );
  };

  // ============================================================
  // SHAKE DETECTION
  // ============================================================

  const handleDeviceMotion = (event) => {
    const acceleration =
      event.accelerationIncludingGravity;

    if (!acceleration) return;

    const x = acceleration.x || 0;
    const y = acceleration.y || 0;
    const z = acceleration.z || 0;

    const magnitude = Math.sqrt(
      x * x + y * y + z * z
    );

    // Ignore weak movements
    if (magnitude < SHAKE_THRESHOLD) {
      return;
    }

    const now = Date.now();

    // Avoid counting the same movement repeatedly
    if (
      now - lastShakeTimeRef.current <
      MIN_SHAKE_INTERVAL
    ) {
      return;
    }

    lastShakeTimeRef.current = now;

    // Don't allow another SOS immediately
    if (
      now - lastTriggerTimeRef.current <
      SOS_COOLDOWN
    ) {
      return;
    }

    shakeCountRef.current += 1;

    setShakeCount(shakeCountRef.current);

    console.log(
      "Shake detected:",
      shakeCountRef.current
    );

    // Reset shake sequence if user doesn't complete it
    clearTimeout(shakeResetTimerRef.current);

    shakeResetTimerRef.current = setTimeout(() => {
      shakeCountRef.current = 0;
      setShakeCount(0);
    }, SHAKE_WINDOW);

    // Three shakes = emergency
    if (
      shakeCountRef.current >=
      REQUIRED_SHAKES
    ) {
      console.log(
        "🚨 Shake SOS Triggered"
      );

      shakeCountRef.current = 0;
      setShakeCount(0);

      lastTriggerTimeRef.current = now;

      // Prevent duplicate SOS
      if (sosLockRef.current) {
        return;
      }

      sosLockRef.current = true;

      setStatusMessage(
        "🚨 Shake pattern detected. Triggering emergency..."
      );

      speakMessage(
        "Emergency detected. Triggering SOS."
      );

      getLocationAndTriggerSOS(
        "SHAKE_GESTURE"
      );
    }
  };

  // ============================================================
  // ENABLE SHAKE DETECTION
  // ============================================================

  const enableShakeDetection = async () => {
    console.log("DeviceMotionEvent:", window.DeviceMotionEvent);
console.log(
  "requestPermission:",
  typeof DeviceMotionEvent?.requestPermission
);
    if (!("DeviceMotionEvent" in window)) {
      setStatusMessage(
        "❌ Motion detection is not supported on this device."
      );
      return;
    }

    try {
      // iOS requires explicit permission
      if (
        typeof DeviceMotionEvent.requestPermission ===
        "function"
      ) {
        const permission =
          await DeviceMotionEvent.requestPermission();

        if (permission !== "granted") {
          setStatusMessage(
            "❌ Motion permission was denied."
          );
          return;
        }
      }

      window.addEventListener(
        "devicemotion",
        handleDeviceMotion
      );

      setShakeEnabled(true);

      setStatusMessage(
        "📳 Shake detection is active. Shake your phone 3 times quickly to trigger SOS."
      );

      speakMessage(
        "Shake detection activated."
      );

      console.log(
        "Shake detection enabled."
      );
    } catch (error) {
      console.error(
        "Motion permission error:",
        error
      );

      setStatusMessage(
        "❌ Unable to enable motion detection."
      );
    }
  };

  // ============================================================
  // DISABLE SHAKE DETECTION
  // ============================================================

  const disableShakeDetection = () => {
    window.removeEventListener(
      "devicemotion",
      handleDeviceMotion
    );

    setShakeEnabled(false);

    shakeCountRef.current = 0;

    setShakeCount(0);

    setStatusMessage(
      "📳 Shake detection disabled."
    );
  };

  // ============================================================
  // GET LOCATION
  // ============================================================

  const getLocationAndTriggerSOS = (
    triggerType = "VOICE_COMMAND"
  ) => {
    if (!navigator.geolocation) {
      setStatusMessage(
        "Geolocation is not supported."
      );

      speakMessage(
        "Geolocation is not supported."
      );

      sosLockRef.current = false;

      return;
    }

    setStatusMessage(
      "📍 Getting current location..."
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        triggerSOS(
          position.coords.latitude,
          position.coords.longitude,
          triggerType
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

        sosLockRef.current = false;
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // ============================================================
  // TRIGGER SOS
  // ============================================================

  const triggerSOS = async (
    latitude,
    longitude,
    triggerType = "VOICE_COMMAND"
  ) => {
    try {
      setStatusMessage(
        "🚨 Triggering Emergency..."
      );

      console.log(
        "SOS Trigger:",
        triggerType
      );

      const response = await fetch(
        `${API_BASE_URL}/api/sos`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            latitude,
            longitude,
            trigger_type: triggerType,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        console.log("SOS Created");

        console.log(
          "Emergency ID:",
          data.emergency_id
        );

        setEmergencyId(
          data.emergency_id
        );

        startLocationTracking(
          data.emergency_id
        );

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

  // ============================================================
  // LIVE LOCATION TRACKING
  // ============================================================

  const startLocationTracking = (
    emergencyId
  ) => {
    console.log(
      "Starting location tracking..."
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
            "Tracking location:",
            position.coords.latitude,
            position.coords.longitude
          );

          try {
            const response =
              await fetch(
                `${API_BASE_URL}/api/location/update`,
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body: JSON.stringify({
                    emergency_id:
                      emergencyId,

                    latitude:
                      position.coords
                        .latitude,

                    longitude:
                      position.coords
                        .longitude,
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

  // ============================================================
  // UI
  // ============================================================

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

      {/* VOICE SOS */}

      <h2 className="text-3xl font-bold mb-6">
        🎤 Voice SOS
      </h2>

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

      <div className="bg-gray-100 rounded-xl p-5 min-h-[120px]">
        <p className="font-semibold mb-2">
          Live Transcript
        </p>

        <p className="text-gray-700 break-words">
          {transcript ||
            "Start speaking..."}
        </p>
      </div>

      {/* STATUS */}

      {statusMessage && (
        <div className="mt-6 p-4 rounded-xl bg-blue-100 text-blue-700 font-semibold">
          {statusMessage}
        </div>
      )}

      {/* EMERGENCY ID */}

      {emergencyId && (
        <div className="mt-4 p-4 rounded-xl bg-green-100 text-green-700">
          <strong>
            Emergency ID:
          </strong>{" "}
          {emergencyId}
        </div>
      )}

      {/* VOICE BUTTONS */}

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

      {/* =====================================================
          SHAKE SOS
      ===================================================== */}

      <div className="mt-10 border-t pt-8">

        <h2 className="text-2xl font-bold mb-3">
          📳 Shake SOS
        </h2>

        <p className="text-gray-600 mb-5">
          Shake your phone 3 times quickly
          to trigger an emergency alert.
        </p>

        {!shakeEnabled ? (
          <button
            onClick={
              enableShakeDetection
            }
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            📳 Enable Shake Detection
          </button>
        ) : (
          <div className="space-y-4">

            <div className="bg-green-100 text-green-700 p-4 rounded-xl font-semibold">
              🟢 Shake Detection Active
            </div>

            {shakeCount > 0 && (
              <div className="bg-violet-100 text-violet-700 p-4 rounded-xl font-semibold">
                Shake detected:{" "}
                {shakeCount}/
                {REQUIRED_SHAKES}
              </div>
            )}

            <button
              onClick={
                disableShakeDetection
              }
              className="bg-gray-700 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Disable Shake Detection
            </button>

          </div>
        )}

      </div>

      {/* SPEECH SUCCESS */}

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