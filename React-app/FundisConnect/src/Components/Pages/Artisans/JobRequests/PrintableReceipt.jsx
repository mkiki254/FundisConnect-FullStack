import { forwardRef } from 'react';
import { Row, Col } from 'react-bootstrap';

const PrintableReceipt = forwardRef(({ paymentDetails, customerDetails, jobTitle }, ref) => {
    return (
        <div ref={ref} className="receipt">
            <div className="receipt-header">
            <div className="logo">
                <h2>FundisConnect</h2>
                <p>An artisan just a click away</p>
            </div>
            <div className="receipt-title">
                <h1>Customer Connection Payment Receipt</h1>
            </div>
            </div>
            <div className="receipt-body">
            <Row>
                <Col>
                <h3 className="pay-sect">Payment Details</h3>
                <div>
                    <Row>
                    <Col className="first-col">
                        <p>Receipt Number</p>
                        <h5>{paymentDetails[0].transaction_code}</h5>
                        <p>Mpesa Number</p>
                        <h5>{paymentDetails[0].artisan_number}</h5>
                    </Col>
                    <Col>
                        <p>Amount Paid</p>
                        <h5>Ksh {paymentDetails[0].amount_paid}</h5>
                        <p>Transaction Date</p>
                        <h5>
                        {new Date(paymentDetails[0].transaction_date).toLocaleString('en-ke', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                        })}
                        </h5>
                    </Col>
                    </Row>
                </div>
                </Col>
                <Col>
                <h3 className="cust-sect">Customer Details</h3>
                <div>
                    <Row>
                    <Col className="second-col">
                        <p>Name</p>
                        <h5>{customerDetails[0].username}</h5>
                        <p>Email</p>
                        <h5>{customerDetails[0].email}</h5>
                    </Col>
                    <Col>
                        <p>Phone Number</p>
                        <h5>{customerDetails[0].phone}</h5>
                        <p>Job Title</p>
                        <h5>{jobTitle}</h5>
                    </Col>
                    </Row>
                </div>
                </Col>
            </Row>
            </div>
        </div>
    )
});

export default PrintableReceipt;
