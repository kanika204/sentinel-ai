import VoiceActivator from "../components/voice/VoiceActivator";

function VoiceSOS() {
  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        Voice Emergency Activation
      </h1>

      <VoiceActivator />

    </div>
  );
}

export default VoiceSOS;