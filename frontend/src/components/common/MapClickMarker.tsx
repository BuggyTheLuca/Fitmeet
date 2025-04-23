import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';

const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickMarker({
  onClickPosition,
  setPosition
}: {
  onClickPosition: (lat: number, lng: number) => void;
  setPosition: (pos: L.LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onClickPosition(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

export default function MapClickMarker({
  center,
  setLocal
}: {
  center?: { latitude: number; longitude: number };
  setLocal?: (latitude: number, longitude: number) => void;
}) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  // Se o `center` for passado, define como posição inicial
  useEffect(() => {
    if (center) {
      setPosition(L.latLng(center.latitude, center.longitude));
    }
  }, [center]);

  const handleMapClick = (lat: number, lng: number) => {
    if (setLocal) setLocal(lat, lng);
  };

  return (
    <MapContainer
      center={[center?.latitude ?? -23.55052, center?.longitude ?? -46.633308]}
      zoom={13}
      style={{ height: '208px', width: '320px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {setLocal && (
        <ClickMarker
          onClickPosition={handleMapClick}
          setPosition={(pos) => setPosition(pos)}
        />
      )}
      {position && <Marker position={position} icon={customIcon} />}
    </MapContainer>
  );
}
