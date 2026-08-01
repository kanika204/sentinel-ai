import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Safety from "./pages/Safety";
import Contacts from "./pages/Contacts";
import History from "./pages/History";
import VoiceSOS from "./pages/VoiceSOS";
// import Settings from "./pages/Settings";
import LiveTracking from "./pages/LiveTracking";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Future Pages */}
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/history" element={<History />} />
          {/* <Route path="/settings" element={<Settings />} /> */}
          <Route path="/voice-sos" element={<VoiceSOS />} />
          <Route
    path="/tracking/:id"
    element={<LiveTracking />}
/>
        </Routes>

        <Footer />
      </Layout>
    </BrowserRouter>
  );
}

export default App;