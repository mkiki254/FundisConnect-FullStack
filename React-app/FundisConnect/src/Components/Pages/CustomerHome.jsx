import { useState, useEffect } from 'react'
import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

export default function Artisan(){

    return (
        <>
        <h1>This is the Customer homepage</h1>
        </>
    )
}


