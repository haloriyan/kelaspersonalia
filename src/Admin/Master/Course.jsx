import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../partials/Header";
import AdminMenu from "../../partials/AdminMenu";
import Button from "../../components/Button";
import { BiPlus } from "react-icons/bi";
import axios from "axios";
import config from "../../config";
import styles from "../styles/Course.module.css";
import Substring from "../../components/Substring";

const Course = () => {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (admin === null) {
            setAdmin(JSON.parse(window.localStorage.getItem('admin_data')));
        }
    }, [admin]);

    useEffect(() => {
        if (isLoading && admin !== null) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/course`, {
                token: admin.token,
            })
            .then(response => {
                let res = response.data;
                setCourses(res.courses);
            })
        }
    }, [isLoading, admin]);

    return (
        <>
            <Header title="Course" />
            <AdminMenu active={'course'} />
            <div className="content user">
                <div className="inline" style={{marginBottom: 20}}>
                    <h3 style={{display: 'flex',flexGrow: 1,margin: 0}}>Course</h3>
                    <Button onClick={() => navigate('/admin/master/course/create')}>
                        <BiPlus size={24} />
                        Create
                    </Button>
                </div>
                
                <div className={styles.ListContainer}>
                    {
                        courses.map((cour, c) => (
                            <a href={`/admin/master/course/${cour.id}/detail`} key={c} className={styles.ListItem}>
                                <img src={`${config.baseUrl}/storage/cover_images/${cour.cover_image}`} alt={cour.title} className={styles.CourseCover} />
                                <div className={styles.CourseTitle}>{Substring(cour.title, 8, true)}</div>
                            </a>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default Course;