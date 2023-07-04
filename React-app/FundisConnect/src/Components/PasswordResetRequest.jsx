import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [responseMessage, setResponseMessage] = useState()
  const navigate = useNavigate()

  // Redirecting users after sending email
  // timeout of 4 seconds to allow reading success message
  useEffect(() => {
      let timeoutId;
  
      if (responseMessage) {
        timeoutId = setTimeout(() => {
          navigate("/signup");
        }, 4000);
      }
  
      return () => {
        clearTimeout(timeoutId);
      };
    }, [responseMessage]);    


  const handleSubmit = (e) => {
    e.preventDefault();
    setResponseMessage("")
    client.post(
        "/api/password_reset/",
        {
            email: email
        }
    ).then(
        res => {
            const msg = res.data.message
            setResponseMessage(msg)
        }
    ).catch(({ response }) => {
        const msg = response.data.message
        setResponseMessage(msg)
    })
  };
//   console.log(responseMessage)

  return (
    <div className='text-center pass-resq'>
        <h1 className='pass-resq-title'>Password Reset Request</h1>
        <Form id="pass-res-req" onSubmit={handleSubmit}>
            <div className='d-flex justify-content-center align-items-center"'>
                {responseMessage && <Alert variant='success'>{responseMessage}</Alert>}
            </div>
            <Form.Group className="mb-3 centering flex-column" controlId="formBasicEmail">
                <Form.Label>Registered Email</Form.Label>
                <Form.Control type="email" placeholder="Enter the email registered on platform" value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>
            <Button type="submit">Reset Password</Button>
        </Form>
    </div>
  );
};

export default PasswordResetRequest;
