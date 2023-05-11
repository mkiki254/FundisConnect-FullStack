import '../Styles/Signup.css'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert';
import { useState, useEffect } from 'react'
import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})


export default function Signup(){

    const [currentUser, setCurrentUser] = useState()
    const [registrationToggle, setRegistrationToggle] = useState(false)
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [usertype, setUsertype] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        client.get("/api/user").then(
            function(res){
                setCurrentUser(true)
            }
        ).catch(function(error){
            setCurrentUser(false)
        })
    }, [])

    function update_form_btn(){
        if (registrationToggle){
            setRegistrationToggle(false)
        }else{
            setRegistrationToggle(true)
        }
    }

    function submitRegistration(e) {
        e.preventDefault();
        if (password != confirmPassword){
           setError(true)
           setErrorMsg("Passwords do not match")
        }else{
            setError(false)
            client.post(
                    "/api/register",
                    {
                        email: email,
                        username: username,
                        usertype: usertype,
                        password: password
                    }
                ).then(function(res){
                    client.post(
                        "/api/login",
                        {
                            email: email,
                            password: password
                        }
                    ).then(function(res){
                        const usr = res.data
                        setCurrentUser(usr)
                        setEmail("")
                        setUsername("")
                        setUsertype("")
                        setPassword("")
                        setConfirmPassword("")
                    })
                }).catch(({ response }) => {
                    const msg = response.data.join(", ");  
                    setError(true);
                    setErrorMsg(msg);
                })
            }
        }
        

    function submitLogin(e){
        e.preventDefault()
        setError(false)
        client.post(
            "/api/login",
            {
                email: email,
                password: password
            }
        ).then(function(res){
            const usr = res.data;
            setCurrentUser(usr);
            setEmail("");
            setPassword("");
        }).catch(({ response }) => {
            const msg = response.data.join(", ");  
            setError(true);
            setErrorMsg(msg);
        })
    }

    function submitLogout(e){
        e.preventDefault()
        client.get(
            "/api/logout",
            {withCredentials: true}
        ).then(function(res){
            setCurrentUser(false)
        })
    }

    //handling the radio button
    function handleUsertype(e){
        setUsertype(e.target.value)
    }

    if (currentUser) {
        return (
            <>
            <Form onSubmit={e => submitLogout(e)} className="my-form">
            <Button variant="primary" type="submit">Logout</Button>
            </Form>
            <h3 class="about-title">You are Logged In</h3>
            </>
        )
    }
    return (
        <>   
        {
            registrationToggle ? (
                <div>
                    <h3 className="form-title">Registration</h3>
                    <Form className="my-form" onSubmit={e => submitRegistration(e)}>
                        {error && <Alert variant="danger" className="msg-alert">{errorMsg}</Alert>}
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
                            <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicText">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicRadio">
                            <Form.Label>Register As:</Form.Label>
                            <div className="radio-options">
                                <Form.Group className="mb-3 option-1" controlId="customer-option">
                                    <Form.Check type="radio" label="Customer" name="user-type" value="Customer" checked={usertype === "Customer"} onChange={handleUsertype} />
                                </Form.Group> 
                                <Form.Group className="mb-3" controlId="artisan-option">
                                    <Form.Check type="radio" label="Artisan" name="user-type" value="Artisan" checked={usertype === "Artisan"} onChange={handleUsertype} />
                                </Form.Group> 
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword2">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
                        </Form.Group>

                        <div className="alternative">
                            <div className="form-submit">
                                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    <Form.Check type="checkbox" label="Check me out" />
                                </Form.Group>

                                <Button variant="primary" type="submit">Register</Button>
                            </div>
                            <div className="form-submit">
                                <p id="form_prompt">Have an account?</p> 
                                <Button id="form_btn" onClick={update_form_btn} variant="primary">Log in</Button>
                            </div>
                        </div>
                    </Form>
                </div>
            ) : (
                <div>
                     <h3 className="form-title">Login</h3>
                    <Form className="my-form" onSubmit={e => submitLogin(e)}>
                    {error && <Alert variant="danger" className="msg-alert">{errorMsg}</Alert>}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
                        <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                    </Form.Group>
                    <div className="alternative">
                        <div className="form-submit">
                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                <Form.Check type="checkbox" label="Check me out" />
                            </Form.Group>

                            <Button variant="primary" type="submit">Log in</Button>
                        </div>
                        <div className="form-submit">
                            <p id="form_prompt">Dont have an account?</p> 
                            <Button id="form_btn" onClick={update_form_btn} variant="primary">Register</Button>
                        </div>
                    </div>
                    </Form>
                </div>
            )
        }
        </>
    )

}