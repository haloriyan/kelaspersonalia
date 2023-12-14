import React, { useEffect, useState } from "react";
import styles from "./styles/Login.module.css";
import Input from "../components/Input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import config from "../config";
import Button from "../components/Button";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);

    const submit = (e) => {
        console.log('submitting', email, password);
        axios.post(`${config.baseUrl}/api/user/login`, {
            email, password
        })
        .then(response => {
            let res = response.data;
            
            setMessage({
                body: res.message,
                status: res.status,
            });
            if (res.status === 200 && res.user.role === "administrator") {
                window.localStorage.setItem('admin_data', JSON.stringify(res.user));
                navigate('/admin/dashboard');
            }
        });
        e.preventDefault();
    }

    return (
        <div className={styles.Area}>
            <div className={styles.Container}>
                <form action="#" className={styles.Form} onSubmit={submit}>
                    <Input label="Email" value={email} onInput={e => setEmail(e.currentTarget.value)} type="email" />
                    <Input label="Password" value={password} onInput={e => setPassword(e.currentTarget.value)} type="password" />

                    <Button>Login</Button>
                </form>

                {
                    message !== null &&
                    <Alert message={message.body} status={message.status} setMessage={setMessage} />
                }
            </div>
        </div>
    )
}

export default Login