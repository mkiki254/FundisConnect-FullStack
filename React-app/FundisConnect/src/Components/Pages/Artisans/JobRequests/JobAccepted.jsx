import { Form, Button, Alert } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

export default function JobAccepted(props){
    const [changedNumber, setChangedNumber] = useState()
    const [paymentResponse, setPaymentResponse] = useState()
    const [phoneChangeResponse, setPhoneChangeResponse] = useState()
    const [artisanPhone, setArtisanPhone] = useState()
    const [errorMsg, setErrorMsg] = useState()
    const [artisanNumber, setArtisanNumber] = useState()
    const [isClicked, setIsClicked] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState()
    const job_id = props.job_id

    useEffect(() => {
        client.get("/api/user/").then(
            res => {
                const user = res.data.user.phone
                setArtisanPhone(user)
            }
        )
    },[phoneChangeResponse])

    useEffect(() => {
        let timeoutId;

        if (phoneChangeResponse) {
            timeoutId = setTimeout(() => {
            setArtisanNumber("yes")
            setPhoneChangeResponse("")
            }, 3000);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [phoneChangeResponse]);

    function handleISArtisanNumber(){
        setPaymentResponse("")
        setPhoneChangeResponse("")
        setArtisanNumber("yes")
    }

    function handleIsNotArtisanNumber(){
        setPaymentResponse("")
        setPhoneChangeResponse("")
        setArtisanNumber("no")
    }

    function handleMakePayment(){
        setPaymentResponse("")
        setErrorMsg("")
        if(artisanPhone){
            client.post(
                "/api/payment/",{
                    mpesa_number:artisanPhone,
                    job_request_id: job_id
                }
            ).then(
                res => {
                    console.log(res)
                    setPaymentResponse("Please Enter your pin to complete your transaction")
                    setIsClicked(true)
                }
            ).catch(({response}) => {
                console.log(response)
                // const msg = response.data[0]
                setIsClicked(true)
                setErrorMsg(msg)
            })
        }
    }

    function handleChangeNumber(event){
        event.preventDefault()
        setPhoneChangeResponse("")
        setErrorMsg("")
        client.put(
            "/api/user/",{
                phone:changedNumber
            }
        ).then(
            res => {
                console.log(res)
                setPhoneChangeResponse("The phone number has been updated successfully")
            }
        ).catch(({response}) => {
            console.log(response)
            const msg = response.data[0]
            setErrorMsg(msg)
        })
    }

    return (
        <div className='artisan-payment'>
        <h1 className='text-center'>
            Payment for Connection
        </h1>
        <p>Our business model is pay per lead model. We charge you a hundred bob for every customer we connect you with. After you make the payment, we will share the contact details of the customer which comprises of the phone number and email so that you can reach out to them and proceed with your business transaction. </p>
        <br></br>
        <div className='d-flex justify-content-center align-items-center"'>
            {paymentResponse && <Alert variant='success'>{paymentResponse}</Alert>}
            {phoneChangeResponse && <Alert variant='success'>{phoneChangeResponse}</Alert>}
            {errorMsg && <Alert variant='danger'>{errorMsg}</Alert>}
        </div>
        {!artisanNumber && (<div className='text-center'>
            <p>Is <span className='mpesa-num'>{artisanPhone}</span> your Mpesa number?</p>
            <Button onClick={handleISArtisanNumber}>Yes</Button>
            <Button onClick={handleIsNotArtisanNumber} className='req-btn'>No</Button>
        </div>)}
        {artisanNumber == 'yes' && 
        (<div className='text-center'>
            <h3>Please complete the payment to get the customer's contact details</h3>
            <Button variant={isClicked ? 'success' : 'primary'} onClick={handleMakePayment}>Pay Ksh 100</Button>
        </div>)} 
        {artisanNumber == 'no' && 
        (<div className='text-center'>
            <h3>Update your phone number to match your mpesa number</h3>
            <Form id="pass-res-req" onSubmit={handleChangeNumber}>
                <Form.Group className="mb-3 centering flex-column" controlId="formBasicMpesaNo">
                    <Form.Label>Enter your Mpesa Number</Form.Label>
                    <Form.Control type="text" placeholder="Mpesa phone number" value={changedNumber} onChange={e => setChangedNumber(e.target.value)} />
                </Form.Group>
                <Button type="submit">Change Phone Number</Button>
            </Form>            
        </div>
        )}
        </div>
    )
}