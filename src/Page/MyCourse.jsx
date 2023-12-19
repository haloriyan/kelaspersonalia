import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPage from "../partials/HeaderPage";
import axios from "axios";
import config from "../config";
import styles from "./styles/MyCourse.module.css";
import Footer from "../partials/Footer";
import Button from "../components/Button";

const MyCourse = () => {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [enrolls, setEnrolls] = useState([]);

    useEffect(() => {
        if (user === null) {
            setUser(
                JSON.parse(window.localStorage.getItem('user_data'))
            );
        }
    }, [user]);

    useEffect(() => {
        if (isLoading && user !== null) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/page/my-course`, {
                token: user.token,
            })
            .then(response => {
                let res = response.data;
                setEnrolls(res.enrolls);
            })
        }
    }, [isLoading, user]);

    return (
        <>
            <HeaderPage />
            <div className="content">
                <div className="inner_content">
                    <h2>Pelatihan Saya</h2>
                    <div className={styles.Area}>
                        {
                            enrolls.map((enr, e) => {
                                let course = enr.course;
                                let percentage = enr.paths.length / course.materials.length * 100;
                                return (
                                    <div key={e} className={styles.Container}>
                                        <a href={`/learn/${enr.id}?i=0`} key={e} className={styles.Item}>
                                            <img src={`${config.baseUrl}/storage/cover_images/${course.cover_image}`} alt={course.title} className={styles.Cover} />
                                            <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1,gap: 10}}>
                                                <div className={styles.CourseTitle}>{course.title}</div>
                                                <div className={styles.ProgressArea}>
                                                    <div className={styles.ProgressBar} style={{
                                                        width: percentage > 15 ? `${percentage}%` : '15%',
                                                        backgroundColor: percentage > 0 ? '#2ecc71' : '#888',
                                                    }}>
                                                        {Math.floor(percentage)}%
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                        {
                                            percentage === 0 &&
                                            <Button onClick={() => navigate(`/learn/${enr.id}?i=0`)}>
                                                Mulai
                                            </Button>
                                        }
                                        {
                                            (percentage === 100 && !enr.has_answered_exam) &&
                                            <Button onClick={() => navigate(`/exam/${enr.id}`)}>
                                                Isi Ujian
                                            </Button>
                                        }
                                        {
                                            (percentage > 0 && percentage< 100) &&
                                            <Button accent="secondary" onClick={() => navigate(`/learn/${enr.id}?i=0`)}>
                                                Lanjutkan
                                            </Button>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                    
                <div style={{height: 150}}></div>
                <Footer />
            </div>
        </>
    )
}

export default MyCourse;