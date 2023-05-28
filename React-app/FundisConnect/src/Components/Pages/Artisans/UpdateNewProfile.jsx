export default function UpdateNewProfile(){
    const [geoJSONData, setGeoJSONData] = useState(null);
    const [coordinates, setCoordinates] = useState([]);
    const [location, setLocation] = useState([-1.292066, 36.821945]);

    const handleFormSubmit = (event) => {
        event.preventDefault();
    
        // Fetch form values and construct GeoJSON data
        const formData = new FormData(event.target);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const specialization = formData.get('specialization');
        const newFeature = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: location,
          },
          properties: {
            first_name: firstName,
            last_name: lastName,
            specialization: [specialization],
          },
        };


        // Update GeoJSON data
        if (geoJSONData) {
            const updatedData = {
            type: 'FeatureCollection',
            features: [...geoJSONData.features, newFeature],
            };
            setGeoJSONData(updatedData);
        } else {
            const initialData = {
            type: 'FeatureCollection',
            features: [newFeature],
            };
            setGeoJSONData(initialData);
        }

        // Clear form and coordinates
        event.target.reset();
        setCoordinates([]);
        setLocation(null);
    }

    const handleLocationChange = (location) => {
        setSelectedLocation(location);
    };

    const handleCoordinateChange = (event, index) => {
        const newCoordinates = [...coordinates];
        newCoordinates[index] = event.target.value;
        setCoordinates(newCoordinates);
    };

    return (
    <div>
        <Form onSubmit={handleFormSubmit}>
        <Form.Group controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="Enter first name" />
        </Form.Group>

        <Form.Group controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder="Enter last name" />
        </Form.Group>

        <Form.Group controlId="specialization">
            <Form.Label>Specialization</Form.Label>
            <Form.Control type="text" placeholder="Enter specialization" />
        </Form.Group>

        <Form.Group controlId="coordinates">
            <Form.Label>Coordinates</Form.Label>
            {coordinates.map((coord, index) => (
            <Form.Control
                key={index}
                type="number"
                step="any"
                placeholder={`Enter coordinate ${index + 1}`}
                value={coord}
                onChange={(event) => handleCoordinateChange(event, index)}
            />
            ))}
            <Button
            variant="secondary"
            onClick={() => setCoordinates([...coordinates, ''])}
            >
            Add Coordinate
            </Button>
        </Form.Group>
        </Form>
    </div>
    );
}