import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ latitude, longitude }) => {
    useEffect(() => {
        if (latitude && longitude) {
            const map = L.map('map').setView([latitude, longitude], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(map);
            L.marker([latitude, longitude]).addTo(map);
        }
    }, [latitude, longitude]);

    return <div id='map' style={{ height: '400px' }}></div>;
};

export default Map;
