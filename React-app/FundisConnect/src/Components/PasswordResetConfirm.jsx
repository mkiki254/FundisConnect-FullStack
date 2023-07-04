import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

const PasswordResetConfirm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [errorMsg, setErrorMsg] = useState()
  const [responseMessage, setResponseMessage] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    // Extract token from URL
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');
    setToken(token);
  }, []);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMsg("")
    setResponseMessage("")
    if(password != confirmPassword){
      setErrorMsg("Passwords do not match!!")
    }else{
      client.post("/api/password_reset_confirm/", {
        password: password,
        token: token
      }).then(res => {
        const msg = res.data.message
        setResponseMessage(msg)
      }).catch(({ response }) => {
        console.log(response)
        const msg = response.data.message
        setResponseMessage(msg)
      })
    }
  };

  return (
    <div className='text-center pass-resq'>
      <h2 className='pass-resq-title'>Reset Password</h2>
      <Form id="pass-res-req" onSubmit={handleSubmit}>
          <div className='d-flex justify-content-center align-items-center"'>
              {errorMsg && <Alert variant='danger'>{errorMsg}</Alert>}
              {responseMessage && <Alert variant='success'>{responseMessage}</Alert>}
          </div>
          <Form.Group className="mb-3 centering flex-column" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3 centering flex-column" controlId="formBasicPassword2">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </Form.Group>
          <Button type="submit">Reset Password</Button>
      </Form>
    </div>
  );
};

export default PasswordResetConfirm;
