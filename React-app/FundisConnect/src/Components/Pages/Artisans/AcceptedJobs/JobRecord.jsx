import { useState, useEffect } from 'react'
import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

export default function JobRecord(props){
    const customer_id = props.customer_id
    const [customerData, setCustomerData] = useState();
    const [customerDetails, setCustomerDetails] = useState();

    useEffect(() => {
        client.get('/api/customer/jobrequest/customer-details/').then((res) => {
          const dta = res.data;
          setCustomerData(dta);
        });
      }, []);

    useEffect(() => {
        if(customerData){
            const cust = customerData.filter((client) => client.user_id === customer_id);
            setCustomerDetails(cust[0]);
        }
    }, [customerData]);

    const isoDateString = props.schedule
    const dateObject = new Date(isoDateString);

    const formattedDate = dateObject.toLocaleString('en-KE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    
    return (
        <>
        {customerDetails && 
        (<div className="d-flex">
            <p className="schedule">{formattedDate}</p>
            <p className="title">{props.job_title}</p>
            <p className="name">{customerDetails.username.charAt(0).toUpperCase() + customerDetails.username.slice(1)}</p>
            <p className="phone">{customerDetails.phone}</p>
            <p className="email">{customerDetails.email}</p>
        </div>)}
        </>
    )
}