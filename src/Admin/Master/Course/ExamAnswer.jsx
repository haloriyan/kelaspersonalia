import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../../partials/Header";
import axios from "axios";
import config from "../../../config";
import CourseMenu from "../../../partials/CourseMenu";
import AdminMenuSimple from "../../../partials/AdminMenuSimple";

const ExamAnswer = () => {
    const { id } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        document.title = `Hasil Uji Kompetensi - ${config.appName}`
    }, []);

    useEffect(() => {
        if (isLoading) {
            setLoading(true);
            axios.post(`${config.baseUrl}/api/course/${id}/exam/answer`)
            .then(response => {
                let res = response.data;
                let users = res.users;
                let course = res.course;

                users.map((usr, u) => {
                    let corAnswers = 0;
                    usr.answers.map((ans, a) => {
                        if (ans.is_correct) {
                            corAnswers += 1;
                        }
                    });

                    users[u]['correct_answer'] = corAnswers;
                    users[u]['score'] = corAnswers / course.quiz.questions.length * 100;
                })

                setCourse(course);
                setUsers(users);
            })
        }
    }, [isLoading]);

    return (
        <>
            <Header />
            <AdminMenuSimple />
            <CourseMenu course={course} active={'answer'} />
            <div className="content organizer">
                <h2 style={{margin: 0}}>Pertanyaan Ujian</h2>
                <div style={{fontSize: 14,color: '#666',marginTop: 5}}>Daftar pertanyaan yang akan dijawab setelah penyelesaian</div>

                <div style={{height: 40}}></div>
                <table>
                    <thead>
                        <tr>
                            <th>Peserta</th>
                            <th>Jawaban Benar</th>
                            <th>Skor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((usr, u) => (
                                <tr key={u}>
                                    <td>{usr.name}</td>
                                    <td>{usr.correct_answer}</td>
                                    <td>{usr.score}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ExamAnswer;