import React, { useEffect, useState } from "react";
import Header from "../../../partials/Header";
import AdminMenuSimple from "../../../partials/AdminMenuSimple";
import CourseMenu from "../../../partials/CourseMenu";
import axios from "axios";
import config from "../../../config";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Button from "../../../components/Button";
import SearchBox from "../../../components/SearchBox";

const CourseParticipant = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [course, setCourse] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [q, setQ] = useState(searchParams.get('q'));
    const [enrolls, setEnrolls] = useState([]);

    useEffect(() => {
        if (admin === null) {
            setAdmin(JSON.parse(window.localStorage.getItem('admin_data')));
        }
    }, [admin]);

    useEffect(() => {
        if (course === null) {
            setCourse(
                JSON.parse(window.localStorage.getItem('selected_course'))
            );
        }
    }, [course]);

    useEffect(() => {
        if (isLoading && admin !== null) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/course/${id}`, {
                with: ['enrolls.user', 'enrolls.presences', 'enrolls.paths'],
                q: q,
                searching: 'enrolls.user'
            })
            .then(response => {
                let res = response.data;
                if (res.course !== null) {
                    setCourse(res.course);
                    setEnrolls(res.course.enrolls);
                    window.localStorage.setItem('selected_course', JSON.stringify(res.course));
                }
            })
        }
    }, [isLoading, admin]);

    const completeEnroll = enrollID => {
        axios.post(`${config.baseUrl}/api/course/${id}/enroll/complete`, {
            enroll_id: enrollID,
        })
        .then(response => {
            let res = response.data;
            setLoading(true);
        })
    }

    return (
        <>
            <Header />
            <AdminMenuSimple />
            <CourseMenu active={'peserta'} course={course} />
            <div className="content organizer">
                <div className="inline">
                    <h3 style={{margin: 0,display: 'flex',flexGrow: 1}}>Peserta Pelatihan</h3>
                    <SearchBox q={q} setQ={setQ} />
                </div>
                <div style={{height: 40}}></div>
                <table>
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            enrolls?.map((enr, e) => {
                                let status = false;
                                let completedPaths = [];
                                let completedPresences = [];
                                enr.paths.map(pat => pat.is_complete && completedPaths.push(pat));
                                enr.presences.map(pres => pres.checked_in && completedPresences.push(pres));

                                if (completedPaths.length >= enr.paths.length && completedPresences.length >= enr.presences.length) {
                                    status = true;
                                } 
                                
                                return (
                                    <tr key={e}>
                                        <td>{enr.user.name}</td>
                                        <td>{enr.user.email}</td>
                                        <td>
                                            {status ? 'Selesai' : 'Belum Selesai'}
                                        </td>
                                        <td>
                                            {
                                                !status &&
                                                <Button height={36} color="green" onClick={() => completeEnroll(enr.id)}>Selesaikan</Button>
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default CourseParticipant;