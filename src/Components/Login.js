import React, { useRef, useEffect, useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import SocialButton from "./SocialButton";
import { Link, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js'
import axios from 'axios';
const client = axios.create({
    baseURL: "http://localhost:3001/EmpData"
})
export default function Login() {
    const email = useRef(null);
    const pass = useRef(null);
    const [error, setError] = useState(null);
    const [empList, setEmpList] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        client.get()
            .then(res => { setEmpList(res.data) })
        sessionStorage.removeItem('user')

    }, [])
    const handleSocialLogin = async (user) => {
        console.log(user._profile);
        let e = await empList.find(x => x.email === user._profile.email)
        let eindex = empList.indexOf(e);
        if (eindex + 1) {
            sessionStorage.setItem('user', JSON.stringify(empList[eindex]));
            navigate('/home/add')
        }
        else {
            let newUser = { id: empList.length + 1, name: user._profile.firstName + user._profile.lastName, user: user._profile.id, email: user._profile.email, password: "loged", total: 0, passbook: [], expense: 0, balance: 0 };
            client.post('', newUser);
            sessionStorage.setItem('user', JSON.stringify(newUser));
            navigate('/home/add')
        }

    };
    const handleSocialLoginFailure = (err) => {
        console.error(err);
    };
    const validate = async (event) => {
        event.preventDefault();
        setError({ msg: '', check: false })
        let e = await empList.find(x => x.email === email.current.value)
        let eindex = empList.indexOf(e);
        if (eindex + 1) {
            const bytes = CryptoJS.AES.decrypt(empList[eindex].password, empList[eindex].user);
            const decryptedPass = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            if (decryptedPass === pass.current.value) {
                sessionStorage.setItem('user', JSON.stringify(empList[eindex]));
                alert('done')
                navigate('/home/add')
            }
            else {
                setError({ msg: 'password not match', check: true })

            }
        }
        else {
            setError({ msg: 'Enter vaild email address', check: true })

        }
    }

    return (
        <div style={{ height: "100vh", background: "linear-gradient(to right, #414345, #232526)" }}>
            <h1 className='title'>Log in</h1>
            <form className="blurform" onSubmit={validate}>
                {error && error.check && <Alert variant="danger" onClose={() => setError({ msg: '', check: false })} dismissible>
                    <Alert.Heading>{error.msg}</Alert.Heading>
                </Alert>}
                <Form.Floating className="mb-4">
                    <Form.Control
                        type="email"
                        placeholder="paras@gmail.com"
                        ref={email}
                    />
                    <label>Email ID</label>
                </Form.Floating>
                <Form.Floating className="mb-4">
                    <Form.Control
                        type="password"
                        placeholder="Paras@123"
                        ref={pass}
                    />
                    <label>Create Password</label>
                </Form.Floating>
                <Button style={{
                    background: '#E84855', border: 'none', height: "55px", width: '100%', fontSize: '30px'
                }} type="submit">
                    Login
                </Button>
            </form>

            <div style={{ width: "35%", margin: "0 auto", padding: 10 }}>
                <SocialButton
                    provider="facebook"
                    appId="421486192823061"
                    onLoginSuccess={handleSocialLogin}
                    onLoginFailure={handleSocialLoginFailure}
                    className="btn btn-primary  w-100 my-4"
                    style={{ background: '#4267B2', border: 'none', height: "55px", fontSize: '30px' }}
                >
                    Login with facebook <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                    </svg>
                </SocialButton>
                <SocialButton
                    provider="google"
                    appId="1037363085127-oleb96q178chc62acem4luibpd3m7lqd.apps.googleusercontent.com"
                    onLoginSuccess={handleSocialLogin}
                    onLoginFailure={handleSocialLoginFailure}
                    className="btn btn-light w-100 mb-4"
                    style={{ border: 'none', height: "55px", fontSize: '30px' }}
                >
                    Login with google <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                        <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                    </svg>
                </SocialButton>
                <h6>Don't have an account? <Link to='/sign'>Sign up</Link></h6>
            </div>
        </div>
    )
}
