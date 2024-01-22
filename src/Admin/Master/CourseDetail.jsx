import React, { useEffect, useState } from "react";
import Header from "../../partials/Header";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../config";
import AdminMenuSimple from "../../partials/AdminMenuSimple";
import CourseMenu from "../../partials/CourseMenu";
import styles from "../styles/Course.module.css";
import { BiChevronRight } from "react-icons/bi";
import { Card, CardContainer } from "../../components/Card";

const CourseDetail = () => {
    const { id } = useParams();
    const [viewing, setViewing] = useState('Materi');
    const [admin, setAdmin] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [enrolls, setEnrolls] = useState([]);
    const [completeds, setCompleteds] = useState([]);

    useEffect(() => {
        document.title = `Dashboard - ${config.appName}`
    }, []);

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
                <CardContainer>
                    <Card link={`/admin/master/course/${course?.id}/peserta`} label={'Peserta'} number={enrolls.length} />
                    <Card link={`/admin/master/course/${course?.id}/peserta`} label={'Penyelesaian'} number={completeds.length} />
                    <Card link={`/admin/master/course/${course?.id}/peserta`} label={'Peserta'} number={enrolls.length} />
                </CardContainer>
            </div>
        </>
    )
}

export default CourseDetail;