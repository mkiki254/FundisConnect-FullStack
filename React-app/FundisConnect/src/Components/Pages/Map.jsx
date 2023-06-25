import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import LocationMarker from './LocationMarker';
import { Button, Form } from 'react-bootstrap'
import 'leaflet/dist/leaflet.css';

const Map = ({ location, onLocationChange }) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [show, setShow] = useState()

    const handleSearch = async () => {
        const provider = new OpenStreetMapProvider();
        const results = await provider.search({ query: searchTerm });
        setSearchResult(results[0]);
    };

    const  MapEvents = () => {
        useMapEvents({
            click(e){
                const { lat, lng } = e.latlng;
                setSearchResult((prevSearch) => ({
                    ...prevSearch,
                    x: lng,
                    y: lat
                }))
            },
        });
        return null;
    }
    onLocationChange(searchResult)

    useEffect(() => {
        setShow(location)
    }, [])

    if(show){
        // The map to be shown when viewing location
        return (
            <section className='map-component' >
                {/* --- Add leaflet map container --- */}
                <div className='map'>
                <MapContainer center={show} zoom={13} scrollWheelZoom={true}>
                    {/* <MapEvents /> */}
                    <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'/>
                    <Marker position={show}></Marker>
                </MapContainer>
                </div>
            </section>
            )    
    }else{
        // The map to be show while setting location
        return (
            <section className='map-component' >
                <div className='d-flex justify-content-center align-items-center map-control'>
                    <Form.Control type='text' placeholder="Search location" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></Form.Control>
                    <Button className='map-btn' onClick={handleSearch}>Search</Button>
                </div>
                {/* --- Add leaflet map container --- */}
                <div className='map'>
                <MapContainer center={[-1.2921, 36.8219]} zoom={13} scrollWheelZoom={true}>
                    <MapEvents />
                    <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'/>
                    {searchResult && (
                        <LocationMarker position={[searchResult.y, searchResult.x]} />
                    )}
                </MapContainer>
                </div>
            </section>
        )   
    }
}

export default Map;

