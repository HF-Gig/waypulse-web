import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
