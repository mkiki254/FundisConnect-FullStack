import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import Dashboard from './Artisans/Dashboard'
import ArtisanProfile from './Artisans/ArtisanProfile'
import ViewProfile from './Artisans/ViewProfile'
import JobRequests from './Artisans/JobRequests'
import Reports from './Artisans/Reports'
import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})


export default function Artisan(){
    const [dashboard, setDashboard] = useState(true)
    const [artisanProfile, setArtisanProfile] = useState(false)
    const [viewProfile, setViewProfile] = useState(false)
    const [jobrequests, setJobrequests] = useState(false)
    const [reports, setReports] = useState(false)
    const [profileDetails, setProfileDetails] = useState()
    const [artisanData, setArtisanData] = useState()
    const [imageUrl, setImageUrl] = useState()

    useEffect(() => {
        client.get("/api/artisan/profile/personal-info/detail/").then(
           res => {
            const dta = res.data
            setArtisanData(dta)
            setProfileDetails(true)

            // Getting the image
           if(dta.properties.profile_picture){
                client.get(dta.properties.profile_picture, {responseType: 'blob'})
                .then(response => {
                    const imgblob = response.data
                    const imgUrl = URL.createObjectURL(imgblob)
                    setImageUrl(imgUrl)
                })
            }else{
                setImageUrl(null)
            }
           }
        ).catch(error => {
            setProfileDetails(false)
        })
    }, [dashboard])

    function handleDashboard(){
        setDashboard(true)
        setArtisanProfile(false)
        setJobrequests(false)
        setReports(false)
        setViewProfile(false)
    }

    function handleArtisanProfile(){
        setDashboard(false)
        setArtisanProfile(true)
        setJobrequests(false)
        setReports(false)
        setViewProfile(false)
    }

    function handleViewProfile(){
        setDashboard(false)
        setArtisanProfile(false)
        setJobrequests(false)
        setReports(false)
        setViewProfile(true)
    }

    function handleJobrequests(){
        setDashboard(false)
        setArtisanProfile(false)
        setJobrequests(true)
        setReports(false)
        setViewProfile(false)
    }

    function handleReports(){
        setDashboard(false)
        setArtisanProfile(false)
        setJobrequests(false)
        setReports(true)
        setViewProfile(false)
    }

    return (
        <>
        <Button className='nav-button' onClick={handleDashboard}>Dash Board</Button>
        {!profileDetails && <Button className='nav-button' onClick={handleArtisanProfile}>Set Profile</Button>}
        {profileDetails && <Button className='nav-button' onClick={handleViewProfile}>View Profile</Button>}
        <Button className='nav-button' onClick={handleJobrequests}>Job Requests</Button>
        <Button className='nav-button' onClick={handleReports}>Reports</Button>
        {dashboard && <Dashboard />}
        {artisanProfile && <ArtisanProfile />}
        {profileDetails && viewProfile && <ViewProfile 
        lat={artisanData.geometry.coordinates[1]}
        lng={artisanData.geometry.coordinates[0]}
        first_name={artisanData.properties.first_name}
        last_name={artisanData.properties.last_name}
        specialization={artisanData.properties.specialization}
        profile_picture={imageUrl}
         />}
        {jobrequests && <JobRequests />}
        {reports && <Reports />}
        </>
    )
}


