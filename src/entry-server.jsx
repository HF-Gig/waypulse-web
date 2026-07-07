import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

export function render(url, helmetContext = {}) {
  const html = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </StaticRouter>
    </HelmetProvider>
  );
  return { html };
}
