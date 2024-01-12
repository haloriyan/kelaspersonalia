import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import axios from "axios";
import config from "../config";
import { useNavigate } from "react-router-dom";

const Login = ({callback}) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submit = e => {
        axios.post(`${config.baseUrl}/api/user/login`, {
            email, password
        })
        .then(response => {
            let res = response.data;
            callback(res);
        })
        e.preventDefault();
    }

    return (
        <form action="#" onSubmit={submit} style={{display: 'flex',flexDirection: 'column',gap: 20}}>
            <h3>Login</h3>
            <Input label="Email" value={email} onInput={e => setEmail(e.currentTarget.value)} required type="email" />
            <Input label="Password" value={password} onInput={e => setPassword(e.currentTarget.value)} required type="password" />

            <Button>Login</Button>
            <div>belum punya akun?</div>
            <Button type="button" accent="secondary" onClick={() => navigate('/auth/register')}>
                Register
            </Button>
        </form>
    )
}

export default Login;