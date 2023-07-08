import {useState, useEffect } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})


export default function JobReceipt(props){
    const [allAcceptedJobs, setAllAcceptedJobs] = useState([])
    const [paymentDetails, setPaymentDetails] = useState([])
    const [reading, setReading] = useState(false)
    const [customerData, setCustomerData] = useState([])
    const [customerDetails, setCustomerDetails] = useState([])
    const job_id = props.job_id
    const customer_id = props.customer
    const job_title = props.job_title

    useEffect(() => {
        client.get("/api/payment/results/").then(
            res => {
                const dta = res.data
                setAllAcceptedJobs(dta)
            }
        )
    }, [])

    useEffect(() => {
        client.get("/api/customer/jobrequest/customer-details/").then(
            res => {
                const dta = res.data
                setCustomerData(dta)
            }
        )
    }, [])
    
    // console.log(customerData)

    useEffect(() => {
        let timeoutId;
        
        timeoutId = setTimeout(() => {
            setReading(prevRead => !prevRead)
        }, 1000);
        

        return () => {
            clearTimeout(timeoutId);
        };
    }, [allAcceptedJobs && customerData]);

    
    useEffect(() => {
        const job = allAcceptedJobs.filter(acceptedJob => acceptedJob.job_request_id === job_id)
        setPaymentDetails(job)
        const cust = customerData.filter(client => client.user_id === customer_id)
        setCustomerDetails(cust)
    }, [reading])

    // console.log(customer)
    // console.log(customerDetails)

    if(paymentDetails.length > 0){
        return (
        <div className="receipt">
            <div className="receipt-header">
                <div className="logo">
                    <h2>FundisConnect</h2>
                    <p>An artisan just a click away</p>
                </div>
                <div className="receipt-title">     
                    <h1>Customer Connection Payment Receipt</h1>
                </div> 
            </div>
            <div className='receipt-body'>
                <Row>
                    <Col>
                        <h3 className="pay-sect">Payment Details</h3>
                        <div>
                            <Row>
                                <Col className='first-col'>
                                    <p>Receipt Number</p>
                                    <h5>{paymentDetails[0].transaction_code}</h5>
                                    <p>Mpesa Number</p>
                                    <h5>{paymentDetails[0].artisan_number}</h5>
                                </Col>
                                <Col>
                                    <p>Amount Paid</p>
                                    <h5>Ksh {paymentDetails[0].amount_paid}</h5>
                                    <p>Transaction Date</p>
                                    <h5>{ new Date(paymentDetails[0].transaction_date).toLocaleString('en-ke', {year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true})}</h5>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col>
                        <h3 className="cust-sect">Customer Details</h3>
                        <div>
                            <Row>
                                <Col className='second-col'>
                                    <p>Name</p>
                                    <h5>{customerDetails[0].username}</h5>
                                    <p>Email</p>
                                    <h5>{customerDetails[0].email}</h5>
                                </Col>
                                <Col>
                                    <p>Phone Number</p>
                                    <h5>{customerDetails[0].phone}</h5>
                                    <p>Job Title</p>
                                    <h5>{job_title}</h5>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className='text-center'>
                <Button>Download Receipt</Button>
            </div>
        </div>
        )
    }else{
        return(
            <>
            <h2>Loading ...</h2>
            </>
        )
    }
    
}