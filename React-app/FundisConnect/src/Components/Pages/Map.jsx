import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Alert } from 'react-bootstrap'


const Map = ({ location, onLocationChange }) => {
 
    if(location){
        return (
        <section className='map-component' >
            {/* --- Add leaflet map container --- */}
            <div className='map'>
            <MapContainer center={location} zoom={13} scrollWheelZoom={true}>
                {/* <MapEvents /> */}
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'/>
                {location && <Marker position={location}></Marker>}
            </MapContainer>
            </div>
        </section>
        )    
    }else{
        return(
            <>
            <Alert variant="danger">Please turn on location to set your profile. You might also be offline</Alert>
            </>
        )
    }
}

export default Map;

