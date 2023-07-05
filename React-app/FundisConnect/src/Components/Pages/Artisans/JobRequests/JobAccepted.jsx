import { Form, Button, Alert } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

export default function JobAccepted(){
    const [mpesaNumber, setMpesaNumber] = useState()
    const [responseMessage, setResponseMessage] = useState()
    const [errorMsg, setErrorMsg] = useState()
    const [paymentSuccess, setPaymentSuccess] = useState()

    function handleSubmit(event){
        event.preventDefault()
        setResponseMessage("")
        setErrorMsg("")
        client.post(
            "/api/payment/",{
                mpesa_number:mpesaNumber
            }
        ).then(
            res => {
                console.log(res)
                setResponseMessage("Please Enter your pin to complete your transaction")
            }
        ).catch(({response}) => {
            const msg = response.data[0]
            setErrorMsg(msg)
        })
    }

    useEffect(() => {
        
    },[])

    return (
        <div className='artisan-payment'>
        <h1 className='text-center'>
            Payment for Connection
        </h1>
        <p>Our business model is pay per lead model. We charge you a hundred bob for every customer we connect you with. After you make the payment, we will share the contact details of the customer which comprises of the phone number and email so that you can reach out to them and proceed with your business transaction. </p>
        <br></br>
        <div className='text-center'>
            <h3>Please complete the payment to get the customer's contact details</h3>
            <Form id="pass-res-req" onSubmit={handleSubmit}>
                <div className='d-flex justify-content-center align-items-center"'>
                    {responseMessage && <Alert variant='success'>{responseMessage}</Alert>}
                    {errorMsg && <Alert variant='danger'>{errorMsg}</Alert>}
                </div>
                <Form.Group className="mb-3 centering flex-column" controlId="formBasicMpesaNo">
                    <Form.Label>Enter your Mpesa Number</Form.Label>
                    <Form.Control type="text" placeholder="Mpesa phone number" value={mpesaNumber} onChange={e => setMpesaNumber(e.target.value)} />
                </Form.Group>
                <Button type="submit">Pay Ksh 100</Button>
            </Form>
        </div>
        </div>
    )
}