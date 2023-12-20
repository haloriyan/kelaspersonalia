import React, { useEffect, useState } from "react";
import HeaderPage from "../partials/HeaderPage";
import styles from "./styles/Enroll.module.css";
import axios from "axios";
import config from "../config";
import { useNavigate, useParams } from "react-router-dom";
import Register from "../partials/Register";
import Separator from "../components/Separator";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import Login from "../partials/Login";

const EnrollCourse = () => {
    const { courseID } = useParams();
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [hasLoggedIn, setHasLoggedIn] = useState(null);
    const [course, setCourse] = useState(null);
    const [viewingForm, setViewingForm] = useState('register');
    const [buttonText, setButtonText] = useState('Enroll');
    const [message, setMessage] = useState(null);

    const [code, setCode] = useState('');

    useEffect(() => {
        if (user === null) {
            let u = window.localStorage.getItem('user_data');
            if (u === null) {
                setHasLoggedIn(false);
            } else {
                setHasLoggedIn(true);
                setUser(JSON.parse(u));
            }
        }
    }, [user]);

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/course/${courseID}`)
            .then(response => {
                let res = response.data;
                setCourse(res.course);
            })
        }
    }, [isLoading]);

    const roll = e => {
        setButtonText('Enrolling...');
        axios.post(`${config.baseUrl}/api/course/${courseID}/enroll`, {
            code: code,
            token: user.token,
        })
        .then(response => {
            let res = response.data;
            setButtonText('Enroll');
            setMessage(res);
            if (res.status === 200) {
                navigate('/my-course');
            }
        })
        .catch(e => {
            setButtonText('Enroll');
        })
        e.preventDefault();
    }

    const authCallback = (res) => {
        let u = res.user;
        window.localStorage.setItem('user_data', JSON.stringify(u));
        setHasLoggedIn(true);
        setUser(u);
    }

    return (
        <>
            <HeaderPage />
            <div className="content">
                <div className={styles.Area}>
                    <div className={styles.Content}>
                        <h2 style={{fontSize: 20,fontWeight: 700,margin: 0}}>Enroll Pelatihan</h2>
                        {
                            course !== null &&
                            <div style={{marginTop: 20}}>
                                <img src={`${config.baseUrl}/storage/cover_images/${course.cover_image}`} alt={course.title} className={styles.Cover} />
                                <div className={styles.CourseTitle}>{course.title}</div>

                                <Separator width="20%" />

                                {
                                    hasLoggedIn &&
                                    <form action="#" onSubmit={roll}>
                                        <Input label="Token :" value={code} onInput={e => setCode(e.currentTarget.value)} required />
                                        {
                                            message !== null &&
                                            <Alert message={message.message} setMessage={setMessage} status={message?.status} />
                                        }
                                        <Button style={{marginTop: 20}}>Enroll</Button>
                                    </form>
                                }
                                {
                                    (!hasLoggedIn && viewingForm === 'login') && <>
                                        <Login callback={authCallback} />
                                        <div style={{marginTop: 20}}>
                                            Belum punya akun? <span style={{color: config.primaryColor,cursor: 'pointer',fontWeight: '700'}} onClick={() => setViewingForm('register')}>Register</span>
                                        </div>
                                    </>
                                }
                                {
                                    (!hasLoggedIn && viewingForm === 'register') && <>
                                        <Register callback={authCallback} />
                                        <div style={{marginTop: 20}}>
                                            Sudah punya akun? <span style={{color: config.primaryColor,cursor: 'pointer',fontWeight: '700'}} onClick={() => setViewingForm('login')}>Login</span>
                                        </div>
                                    </>
                                }
                            </div>
                        }
                    </div>
                </div>

                <div style={{height: 40}}></div>
            </div>
        </>
    )
}

export default EnrollCourse;