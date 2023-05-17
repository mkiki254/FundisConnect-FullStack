import { useState, useEffect } from 'react'
import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

export default function Artisan(){

    const [data, setData] = useState(null)

    useEffect(() => {
        try{
            const response = client.get('/api/artisan')
            setData(response.data)
        }catch(error){
            if(error.response && error.response.status === 403){
                // Handle unauthorized access here
            } else {
                // Handle other errors here
            }
        }
    }, [])

    return (
        <>
        {
            data ? 
            (
                <div>{data}</div>
            ) : 
            (
                <div>Loading...</div>
            )
        }
        </>
    )
}


