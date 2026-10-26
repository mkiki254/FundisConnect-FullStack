import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../AuthContext';
import { useState, useEffect } from 'react'
import client from '@/api'



export default function ViewProfile(){
    const navigate = useNavigate()
    const { artisanId } = useAuthContext()
    const [artisanDataElements, setArtisanDataElements] = useState([])

    useEffect(() => {
        client.get("/api/artisan/profile/personal-info/").then(
           res => {
            const dta = res.data.features
            setArtisanDataElements(dta)
            // console.log(dta)
           }
        ).catch(error => {
            console.log(error)
        })
    }, [artisanId])

    // Going back to profiles
    function handleGoBack(){
        navigate("/customer-home")
    }

    // Getting data of the selected artisan
    const artisanData = artisanDataElements.filter(artisan => artisan.id==artisanId)
    console.log(artisanData)

    return (
        <>
        <h1>View Profile here</h1>
        <Button onClick={handleGoBack}>Go Back</Button>
        </>
    )
}