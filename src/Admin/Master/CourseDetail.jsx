import React, { useEffect, useState } from "react";
import Header from "../../partials/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import AdminMenuSimple from "../../partials/AdminMenuSimple";
import CourseMenu from "../../partials/CourseMenu";
import styles from "../styles/Course.module.css";
import { BiChevronRight } from "react-icons/bi";

const CourseDetail = () => {
    const { id } = useParams();
    const [viewing, setViewing] = useState('Materi');
    const [admin, setAdmin] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [enrolls, setEnrolls] = useState([]);
    const [completeds, setCompleteds] = useState([]);

    useEffect(() => {
        if (admin === null) {
            setAdmin(JSON.parse(window.localStorage.getItem('admin_data')));
        }
    }, [admin]);

    useEffect(() => {
        if (isLoading && admin !== null) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/course/${id}/dashboard`)
            .then(response => {
                let res = response.data;
                setCourse(res.course);
                setEnrolls(res.enrolls);
                setCompleteds(res.completed);
            })
        }
    }, [isLoading, admin]);

    return (
        <>
            <Header />
            <AdminMenuSimple active={'course'} />
            <CourseMenu course={course} active={'dashboard'} />
            <div className="content organizer">
                <div className={styles.CardContainer}>
                    <a href={`/admin/master/course/${course?.id}/peserta`} className={styles.Card}>
                        <div className={styles.CardNumber}>{enrolls.length}</div>
                        <div className={styles.CardBottom}>
                            <div style={{display: 'flex',flexGrow:1}}>
                                Peserta
                            </div>
                            <BiChevronRight />
                        </div>
                    </a>
                    <a href={`/admin/master/course/${course?.id}/peserta`} className={styles.Card}>
                        <div className={styles.CardNumber}>{completeds.length}x</div>
                        <div className={styles.CardBottom}>
                            <div style={{display: 'flex',flexGrow:1}}>
                                Diselesaikan
                            </div>
                            <BiChevronRight />
                        </div>
                    </a>
                    <a href={`/admin/master/course/${course?.id}/peserta`} className={styles.Card}>
                        <div className={styles.CardNumber}>{enrolls.length}</div>
                        <div className={styles.CardBottom}>
                            <div style={{display: 'flex',flexGrow:1}}>
                                Peserta
                            </div>
                            <BiChevronRight />
                        </div>
                    </a>
                </div>
            </div>
        </>
    )
}

export default CourseDetail;