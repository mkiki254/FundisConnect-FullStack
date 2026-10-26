import { useState, useEffect } from 'react'
import client from '@/api'
import { Button } from 'react-bootstrap'
import Dashboard from './Customers/Dashboard'
import JobRequests from './Customers/JobRequests'
import RateArtisan from './Customers/RateArtisan'


export default function Customer(){
    const [dashboard, setDashboard] = useState(true)
    const [jobRequest, setJobRequest] = useState(false)
    const [rateArtisan, setRateArtisan] = useState(false)
    const [artisanData, setArtisanData] = useState([])

    useEffect(() => {
        client.get("/api/artisan/profile/personal-info/").then(
           res => {
            const dta = res.data.features
            setArtisanData(dta)
            // console.log(dta)
           }
        ).catch(error => {
            console.log(error)
        })
    }, [])

    // console.log(artisanData)

    function handleDashboard(){
        setDashboard(true)
        setJobRequest(false)
        setRateArtisan(false)
    }

    function handleJobRequest(){
        setDashboard(false)
        setJobRequest(true)
        setRateArtisan(false)
    }

    function handleRateArtisan(){
        setDashboard(false)
        setJobRequest(false)
        setRateArtisan(true)
    }

    return (
        <>
        <Button className='nav-button' onClick={handleDashboard}>Dashboard</Button>
        <Button className='nav-button' onClick={handleJobRequest}>Make Job Request</Button>
        <Button className='nav-button' onClick={handleRateArtisan}>Rate Artisan</Button>
        {dashboard && <Dashboard />}
        {jobRequest && artisanData && <JobRequests artisans = {artisanData}/>}
        {rateArtisan && <RateArtisan />}
        </>
    )
}


