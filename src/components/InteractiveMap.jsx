import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Setup default marker icons for Leaflet dynamically
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Map helper to automatically center and pan the map frame
function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 9, {
      duration: 1.5,
    });
  }, [center, map]);
  return null;
}

export default function InteractiveMap({
  selectedHotspot,
  setSelectedHotspot,
  mapHotspots,
}) {
  return (
    <MapContainer
      center={selectedHotspot.coordinates}
      zoom={6}
      scrollWheelZoom={false}
      className="w-full h-full rounded-3xl z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      <MapController center={selectedHotspot.coordinates} />

      {mapHotspots.map((spot) => (
        <Marker
          key={spot.id}
          position={spot.coordinates}
          eventHandlers={{
            click: () => setSelectedHotspot(spot),
          }}
        >
          <Popup className="font-sans">
            <div className="p-1">
              <strong className="block mb-1 text-slate-900">
                {spot.name}
              </strong>
              <span
                className={`text-xs px-2 py-1 rounded-md font-bold text-white ${
                  spot.status === "Opened" ? "bg-emerald-500" : "bg-red-500"
                }`}
              >
                {spot.status}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
