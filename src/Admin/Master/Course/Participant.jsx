import React, { useEffect, useState } from "react";
import Header from "../../../partials/Header";
import AdminMenuSimple from "../../../partials/AdminMenuSimple";
import CourseMenu from "../../../partials/CourseMenu";
import axios from "axios";
import config from "../../../config";
import { useNavigate, useParams } from "react-router-dom";

const CourseParticipant = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (admin === null) {
            setAdmin(JSON.parse(window.localStorage.getItem('admin_data')));
        }
    }, [admin]);

    useEffect(() => {
        if (isLoading && admin !== null) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/course/${id}`, {
                with: 'enrolls.user'
            })
            .then(response => {
                let res = response.data;
                setCourse(res.course);
            })
        }
    }, [isLoading, admin]);

    const enrolls = course?.enrolls;

    return (
        <>
            <Header />
            <AdminMenuSimple />
            <CourseMenu active={'peserta'} course={course} />
            <div className="content organizer">
                <h3 style={{margin: 0,marginBottom: 20}}>Peserta Pelatihan</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            enrolls?.map((enr, e) => (
                                <tr key={e}>
                                    <td>{enr.user.name}</td>
                                    <td>{enr.user.email}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default CourseParticipant;