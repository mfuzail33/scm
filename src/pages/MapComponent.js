import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { Location } from 'iconsax-react';

const MapComponent = ({ onClick }) => {
  const [marker, setMarker] = useState(null);

  const handleClick = (event) => {
    const coordinates = { lat: event.lat, lng: event.lng };
    setMarker(coordinates);
    onClick(coordinates);
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyCBp3WARK3OlnKYeOquzYqvVjpcqXhnbcw' }}
        defaultCenter={{ lat: 24.8607, lng: 67.0011 }}
        defaultZoom={10}
        onClick={handleClick}
      >
        {marker && (
          <Marker
            lat={marker.lat}
            lng={marker.lng}
          />
        )}
      </GoogleMapReact>
    </div>
  );
};

const Marker = () => (
  <div>
    <Location size={26} style={{ color: 'red' }} />
  </div>
);

export default MapComponent;

