import { Button } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

export default function ProfileCard(props){
    const [imageUrl, setImageUrl] = useState()

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

    console.log(imageUrl)

    return(
        <div className="prof-card">
            <img src={imageUrl} alt="profile picture" className="prof-card-pic"/>
            <h2 className="prof-card-name">{props.firstname} {props.lastname}</h2>
            <div className='prof-card-actions'>
                <Button>View Profile</Button>
                <Button>Select Artisan</Button>
            </div>
        </div>
    )
}