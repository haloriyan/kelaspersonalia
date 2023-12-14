import React, { useEffect, useState } from "react";
import Header from "../../partials/Header";
import AdminMenu from "../../partials/AdminMenu";
import Toggler from "../../components/Toggler";
import CourseMaterial from "./Course/Material";
import CourseMedia from "./Course/Media";
import CourseParticipant from "./Course/Participant";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import AdminMenuSimple from "../../partials/AdminMenuSimple";
import CourseMenu from "../../partials/CourseMenu";

const CourseDetail = () => {
    const { id } = useParams();
    const [viewing, setViewing] = useState('Materi');
    const [admin, setAdmin] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);

    useEffect(() => {
        if (admin === null) {
            setAdmin(JSON.parse(window.localStorage.getItem('admin_data')));
        }
    }, [admin]);

    useEffect(() => {
        if (isLoading && admin !== null) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/course/${id}`)
            .then(response => {
                let res = response.data;
                setCourse(res.course);
            })
        }
    }, [isLoading, admin]);

    return (
        <>
            <Header />
            <AdminMenuSimple active={'course'} />
            <CourseMenu course={course} active={'dashboard'} />
            <div className="content organizer">
                Lorem ipsum
            </div>
        </>
    )
}

export default CourseDetail;