import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPage from "../partials/HeaderPage";
import axios from "axios";
import config from "../config";
import styles from "./styles/MyCourse.module.css";
import Footer from "../partials/Footer";

const MyCourse = () => {
    const navigation = useNavigate();
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
                                return (
                                    <a href={`/learn/${enr.id}`} key={e} className={styles.Item}>
                                        <img src={`${config.baseUrl}/storage/cover_images/${course.cover_image}`} alt={course.title} className={styles.Cover} />
                                        <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1,gap: 10}}>
                                            <div className={styles.CourseTitle}>{course.title}</div>
                                            <div className={styles.CourseDetail}>{course.materials.length} materi</div>
                                        </div>
                                    </a>
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