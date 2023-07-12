import { Button } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../AuthContext'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

export default function ProfileCard(props){
    const [imageUrl, setImageUrl] = useState()
    const navigate = useNavigate()
    const { setArtisanId } = useAuthContext()
    
    useEffect(() => {
        // Getting the image
        if(props.profilePic){
            client.get(props.profilePic, {responseType: 'blob'})
            .then(response => {
                const imgblob = response.data
                const imgUrl = URL.createObjectURL(imgblob)
                setImageUrl(imgUrl)
            })
        }else{
            setImageUrl(null)
        }
    }, [])

    // function handleViewProfile(){
    //     setArtisanId(props.id)
    //     navigate("/customer-home/view-profile")
    // }
    
    function handleSelectArtisan(){
        setArtisanId(props.id)
        navigate("/customer-home/select-artisan")
    }

    return(
        <div className="prof-card">
            <img src={imageUrl} alt="profile picture" className="prof-card-pic"/>
            <h2 className="prof-card-name">{props.firstname} {props.lastname}</h2>
            <p className="prof-card-loc">Location: {props.distance} kilometres away</p>
            <div className='prof-card-actions'>
                {/* <Button onClick={handleViewProfile}>View Profile</Button> */}
                <Button onClick={handleSelectArtisan}>Select Artisan</Button>
            </div>
        </div>
    )
}