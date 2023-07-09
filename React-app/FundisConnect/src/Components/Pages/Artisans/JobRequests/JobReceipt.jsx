import { Button } from 'react-bootstrap'
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PrintableReceipt from './PrintableReceipt';
import { useReactToPrint } from 'react-to-print';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: 'http://127.0.0.1:8000'
});

const JobReceipt = ({ job_id, customer, job_title }) => {
  const [allAcceptedJobs, setAllAcceptedJobs] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [reading, setReading] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [customerDetails, setCustomerDetails] = useState([]);


  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    removeAfterPrint: true,
    print: async (printIframe) => {
      const document = printIframe.contentDocument;
      if (document) {
        const html = document.getElementsByTagName("html")[0];

        try {
          const canvas = await html2canvas(html);
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF();
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save("FundisConnectReceipt.pdf");
        } catch (error) {
          console.log("Error generating PDF:", error);
        }
      }
    },
  });


  useEffect(() => {
    client.get('/api/payment/results/').then((res) => {
      const dta = res.data;
      setAllAcceptedJobs(dta);
    });
  }, []);

  useEffect(() => {
    client.get('/api/customer/jobrequest/customer-details/').then((res) => {
      const dta = res.data;
      setCustomerData(dta);
    });
  }, []);

  useEffect(() => {
    let timeoutId;

    timeoutId = setTimeout(() => {
      setReading((prevRead) => !prevRead);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [allAcceptedJobs && customerData]);

  useEffect(() => {
    const job = allAcceptedJobs.filter((acceptedJob) => acceptedJob.job_request_id === job_id);
    setPaymentDetails(job);
    const cust = customerData.filter((client) => client.user_id === customer);
    setCustomerDetails(cust);
  }, [reading]);

  if (paymentDetails.length > 0) {
    return (
        <div>           
            <Button onClick={handlePrint}>Download Receipt</Button>          
            <PrintableReceipt 
            paymentDetails={paymentDetails} 
            customerDetails={customerDetails} 
            jobTitle={job_title}
            ref={componentRef}
            />
        </div>
    )
  } else {
    return (
      <>
        <h2>Loading ...</h2>
      </>
    );
  }
};

export default JobReceipt;
