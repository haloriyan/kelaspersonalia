import React, { useEffect, useState } from "react";
import Header from "../../../partials/Header";
import CourseMenu from "../../../partials/CourseMenu";
import AdminMenuSimple from "../../../partials/AdminMenuSimple";
import { useParams } from "react-router-dom";
import axios from "axios";
import config from "../../../config";
import Button from "../../../components/Button";
import { BiCog, BiTrash, BiX } from "react-icons/bi";
import Popup from "../../../components/Popup";
import Input from "../../../components/Input";
import styles from "../../styles/Course.module.css";
import InputFile from "../../../components/InputFile";

const CourseExam = () => {
    const { id } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [controllable, setControllable] = useState(true);
    const [course, setCourse] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState(null);
    const [quiz, setQuiz] = useState(null);

    const [type, setType] = useState('option');
    const [body, setBody] = useState('What is the capital of Thailand?');
    const [expected, setExpected] = useState('');
    const [options, setOptions] = useState(['Bangkok', 'Bangdik', 'Bangpusi', 'Bangtits']);
    const [img, setImg] = useState(null);

    const [isAdding, setAdding] = useState(false);
    const [isDeleting, setDeleting] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/course/${id}/exam`)
            .then(response => {
                let res = response.data;
                setCourse(res.course);
                setQuiz(res.course.quiz);
                setQuestions(res.course.quiz?.questions);
                if (res.answers_count.length > 0) {
                    setControllable(false);
                }
            })
        }
    }, [isLoading]);

    const submit = e => {
        let formData = new FormData();
        formData.append('type', type);
        formData.append('body', body);
        formData.append('options', options);
        formData.append('image', img);
        formData.append('expected_answer', options[expected]);
        formData.append('create_quiz', quiz === null ? '1' : '0');

        axios.post(`${config.baseUrl}/api/course/${id}/exam/question/store`, formData)
        .then(response => {
            let res = response.data;
            setLoading(true);
            setAdding(false);
            setBody('');
            setOptions([]);
            setImg(null);
            setExpected(null);
        })
        e.preventDefault();
    }

    const del = e => {
        axios.post(`${config.baseUrl}/api/course/${id}/exam/question/delete`, {
            id: question.id,
        })
        .then(response => {
            let res = response.data;
            setLoading(true);
            setDeleting(false);
        })
        e.preventDefault();
    }

    return (
        <>
            <Header />
            <CourseMenu active={'exam'} course={course} />
            <AdminMenuSimple active={'course'} />
            <div className="content organizer">
                <div className="inline">
                    <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1}}>
                        <h2 style={{margin: 0}}>Pertanyaan Ujian</h2>
                        <div style={{fontSize: 14,color: '#666',marginTop: 5}}>Daftar pertanyaan yang akan dijawab setelah penyelesaian</div>
                    </div>
                    {
                        (controllable && quiz !== null) &&
                        <Button accent="secondary" circle onClick={() => setAdding(true)}>
                            <BiCog />
                        </Button>
                    }
                </div>

                <div style={{height: 40}}></div>

                <table>
                    <thead>
                        <tr>
                            <th>Pertanyaan</th>
                            <th>Opsi</th>
                            <th>Jawaban</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            questions?.map((quest, q) => {
                                let opts = JSON.parse(quest.options)
                                return (
                                    <tr key={q}>
                                        <td>{quest.body}</td>
                                        <td>
                                            <ol type="A">
                                                {opts.map((opt, o) => (
                                                    <li key={o}>{opt}</li>
                                                ))}
                                            </ol>
                                        </td>
                                        <td>{quest.expected_answer}</td>
                                        <td>
                                            {
                                                controllable &&
                                                <Button color="red" onClick={() => {
                                                    setQuestion(quest);
                                                    setDeleting(true);
                                                }}>
                                                    <BiTrash />
                                                </Button>
                                            }
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                {
                    controllable &&
                    <Button accent="secondary" onClick={() => setAdding(true)}>
                        Tambah
                    </Button>
                }
            </div>

            {
                isAdding &&
                <Popup onDismiss={() => setAdding(false)}>
                    <div className="inline">
                        <h3 style={{display: 'flex',flexGrow: 1,margin: 0}}>Tambah Pertanyaan</h3>
                        <Button circle accent="secondary" color="muted" onClick={() => setAdding(false)}>
                            <BiX />
                        </Button>
                    </div>
                    <form action="#" onSubmit={submit} style={{marginTop: 20,display: 'flex',flexDirection: 'column',gap: 20}}>
                        <div className="inline">
                            <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1,gap: 5}}>
                                <div>Sisipkan Gambar</div>
                                <div style={{fontSize: 12,color: '#666'}}>Opsional</div>
                            </div>
                            <InputFile size={80} label="Pilih Gambar" labelStyle={{fontSize: 12}} aspectRatio="16/9" onChange={(input, e) => {
                                setImg(input.files[0]);
                            }} />
                        </div>
                        <Input label="Pertanyaan :"  value={body} onInput={e => setBody(e.currentTarget.value)} required />

                        <div className={styles.ExamOptionArea}>
                            <div className={styles.ExamOptionItem}>
                                <Input label="Opsi Jawaban A :" value={options[0]} onInput={e => {
                                    let opts = [...options];
                                    opts[0] = e.currentTarget.value;
                                    setOptions(opts);
                                }} />
                                <Input label="Opsi Jawaban C :" value={options[2]} onInput={e => {
                                    let opts = [...options];
                                    opts[2] = e.currentTarget.value;
                                    setOptions(opts);
                                }} />
                            </div>
                            <div className={styles.ExamOptionItem}>
                                <Input label="Opsi Jawaban B :" value={options[1]} onInput={e => {
                                    let opts = [...options];
                                    opts[1] = e.currentTarget.value;
                                    setOptions(opts);
                                }} />
                                <Input label="Opsi Jawaban D :" value={options[3]} onInput={e => {
                                    let opts = [...options];
                                    opts[3] = e.currentTarget.value;
                                    setOptions(opts);
                                }} />
                            </div>
                        </div>

                        <div className="inline">
                            <div style={{display: 'flex',flexGrow: 1}}>Jawaban Benar</div>
                            <select required onChange={e => {
                                setExpected(e.currentTarget.value);
                            }}>
                                <option value="">Pilih Opsi...</option>
                                <option value="0">Opsi A {options[0] ? `(${options[0]})` : ''}</option>
                                <option value="1">Opsi B {options[1] ? `(${options[1]})` : ''}</option>
                                <option value="2">Opsi C {options[2] ? `(${options[2]})` : ''}</option>
                                <option value="3">Opsi D {options[3] ? `(${options[3]})` : ''}</option>
                            </select>
                        </div>

                        <Button style={{marginTop: 20}}>Tambahkan</Button>
                    </form>
                </Popup>
            }

            {
                isDeleting &&
                <Popup onDismiss={() => setDeleting(false)}>
                    <div className="inline">
                        <h3 style={{display: 'flex',flexGrow: 1,margin: 0}}>Hapus Pertanyaan</h3>
                        <Button circle accent="secondary" color="muted" onClick={() => setDeleting(false)}>
                            <BiX />
                        </Button>
                    </div>

                    <p>
                        Yakin ingin menghapus pertanyaan <i>{question.body}</i>?
                    </p>

                    <form action="#" onSubmit={del}>
                        <Button>Ya, hapus</Button>
                    </form>
                </Popup>
            }
        </>
    )
}

export default CourseExam;