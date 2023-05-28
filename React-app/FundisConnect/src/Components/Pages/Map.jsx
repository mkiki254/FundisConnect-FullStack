import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


const Map = ({ location, onLocationChange }) => {
    const  MapEvents = () => {
        useMapEvents({
            click(e){
                const { lat, lng } = e.latlng;
                onLocationChange({ lat, lng })
            },
        });
        return null;
    }
 
    return (
        <section className='map-component' >
            {/* --- Add leaflet map container --- */}
            <div className='map'>
            <MapContainer center={location} zoom={13} scrollWheelZoom={true}>
                <MapEvents />
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'/>
                {location && <Marker position={location}></Marker>}
            </MapContainer>
            </div>
        </section>
    )    
}

export default Map;

