import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Login from "../partials/Login";
import Register from "../partials/Register";
import styles from "./styles/Enroll.module.css";
import HeaderPage from "../partials/HeaderPage";
import Alert from "../components/Alert";

const Auth = () => {
    const navigate = useNavigate();
    const { action } = useParams();

    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const callback = (res) => {
        if (res.status === 200) {
            setMessage(res.message);
            let u = res.user;
            
            if (u.role === "administrator") {
                window.localStorage.setItem('admin_data', JSON.stringify(u));
                navigate('/admin/dashboard');
            } else {
                window.localStorage.setItem('user_data', JSON.stringify(u));
                navigate('/');
            }
        } else {
            setErrorMessage(res.message);
        }
    }

    return (
        <>
            <HeaderPage />
            <div className="content">
                <div className={styles.Area}>
                    <div className={styles.Content}>
                        {
                            action === 'login' &&
                            <Login callback={callback} />
                        }
                        {
                            action === 'register' &&
                            <Register callback={callback} />
                        }

                        <div style={{height: 20}}></div>

                        {
                            message !== '' &&
                            <Alert message={message} setMessage={setMessage} status={200} />
                        }
                        {
                            errorMessage !== '' &&
                            <Alert message={errorMessage} setMessage={setErrorMessage} status={500} />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Auth;