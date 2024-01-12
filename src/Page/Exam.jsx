import React, { useEffect, useState } from "react";
import HeaderPage from "../partials/HeaderPage";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import config from "../config";
import styles from "./styles/Exam.module.css";
import Radio from "../components/Radio";
import Button from "../components/Button";

const Exam = () => {
    const navigate = useNavigate();
    const { enrollID } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [isLoadingQuestion, setLoadingQuestion] = useState(false);
    const [user, setUser] = useState(null);
    const [enroll, setEnroll] = useState(null);

    const [quizID, setQuizID] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        if (user === null) {
            setUser(
                JSON.parse(window.localStorage.getItem('user_data'))
            )
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
                res.enrolls.map(enr => {
                    if (enr.id == enrollID) {
                        setEnroll(enr);
                    }
                });
                setLoadingQuestion(true);
            })
        }
    }, [isLoading, user]);

    useEffect(() => {
        if (isLoadingQuestion && enroll !== null && user !== null) {
            setLoadingQuestion(false);
            axios.post(`${config.baseUrl}/api/course/${enroll.course_id}/exam`, {
                user_id: user.id,
                course_id: enroll.course_id,
            })
            .then(response => {
                let res = response.data;
                let qs = res.course.quiz.questions;
                let qID = res.course.quiz.id;
                setQuestions(qs);
                setQuizID(qID);
                let a = [];

                let temp = JSON.parse(window.localStorage.getItem(`answer_temp_${enroll.id}`));
                if (temp === null) {
                    qs.map(quest => {
                        a.push({
                            quiz_id: qID,
                            question_id: quest.id,
                            user_id: user.id,
                            answer: null,
                            is_correct: null,
                        })
                    });
                } else {
                    a = temp;
                }
                setAnswers(a);
            })
        }
    }, [isLoadingQuestion, enroll, user]);

    const chooseOption = (index, value) => {
        let as = [...answers];
        if (as[index] === undefined) {
            as.push({
                quiz_id: quizID,
                question_id: questions[index].id,
                user_id: user.id,
                answer: value,
                is_correct: null,
            })
        } else {
            as[index].answer = value;
        }
        window.localStorage.setItem(`answer_temp_${enroll.id}`, JSON.stringify(as));
        setAnswers(as);
    }

    const submitAnswer = () => {
        axios.post(`${config.baseUrl}/api/course/${enroll.course_id}/exam/submit-answer`, {
            answers,
            enroll_id: enrollID,
        })
        .then(response => {
            let res = response.data;
            navigate('/my-course')
        })
    }

    return (
        <>
            <HeaderPage />
            <div className="content">
                <div className="inner_content">
                    {
                        questions.map((quest, q) => {
                            if (q === questionIndex) return (
                                <div key={q} className={styles.Area}>
                                    <div className={styles.Nomor}>{q + 1}</div>
                                    <div className={styles.Content}>
                                        <h2 className={styles.Question}>{quest.body}</h2>
                                        <div className={styles.OptionArea}>
                                            {
                                                JSON.parse(quest.options).map((opt, o) => (
                                                    <div key={o} className={styles.Option} onClick={() => chooseOption(questionIndex, opt)}>
                                                        <Radio active={answers[questionIndex]?.answer === opt} label={null} />
                                                        {opt}
                                                    </div>
                                                ))
                                            }
                                        </div>

                                        <div className={styles.ControlArea}>
                                            {
                                                questionIndex > 0 &&
                                                <Button accent="secondary" style={{width: 'auto',flexGrow: 0}} onClick={() => setQuestionIndex(questionIndex - 1)}>
                                                    Sebelumnya
                                                </Button>
                                            }
                                            <div className={styles.ControlSpacer}></div>
                                            {
                                                (questionIndex !== questions.length - 1) &&
                                                <Button accent="secondary" style={{width: 'auto',flexGrow: 0}} onClick={() => setQuestionIndex(questionIndex + 1)}>
                                                    Berikutnya
                                                </Button>
                                            }
                                            {
                                                (questionIndex === questions.length - 1) &&
                                                <Button style={{width: 'auto',flexGrow: 0}} onClick={submitAnswer}>
                                                    Submit
                                                </Button>
                                            }
                                        </div>
                                        {questions.length}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default Exam;