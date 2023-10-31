import { useNavigate } from 'react-router-dom';
import styles from './Map.module.css';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from 'react-leaflet';
import { useCities } from './contexts/CitiesContext';
import { useEffect, useState } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import Button from './Button';
import useUrlPosition from './hooks/useUrlPosition';

function Map() {
  const { cities } = useCities();
  const [position, setPosition] = useState([40, 0]);

  const {
    isLoading: isLoadingPosition,
    position: geoLocation,
    getPosition,
  } = useGeolocation();

  const [lat, lng] = useUrlPosition();

  useEffect(() => {
    if (lat && lng) setPosition([lat, lng]);
  }, [lat, lng]);

  useEffect(() => {
    if (geoLocation) {
      setPosition([geoLocation.lat, geoLocation.lng]);
    }
  }, [geoLocation]);

  function LoadCitiesMarker() {
    return cities.map(city => {
      return (
        <Marker key={city.id} position={Object.values(city.position)}>
          <Popup>
            <span>{city.cityName}</span>
          </Popup>
        </Marker>
      );
    });
  }

  return (
    <div className={styles.mapContainer}>
      {!geoLocation && (
        <Button type='position' onClick={getPosition}>
          {isLoadingPosition ? 'Loading...' : 'Use Your Location'}
        </Button>
      )}
      <MapContainer
        className={styles.map}
        center={position}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        />
        {LoadCitiesMarker()}
        <ChangeCenter position={position} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvent({
    click: e => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
