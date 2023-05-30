import axios from 'axios'
import Map from '../Map'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

export default function ViewProfile(props){
    return (
        <>
        <h1>My Profile</h1>
        <h3>My Location</h3>
        <Map location={props.location}/>
        <p>First Name: {props.first_name}</p>
        <p>Last Name: {props.last_name}</p>
        <p>Specialization: {props.specialization}</p>
        <button>Edit Details</button>
        </>
    )
}