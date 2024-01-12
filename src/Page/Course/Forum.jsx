import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderPage from "../../partials/HeaderPage";
import axios from "axios";
import config from "../../config";
import styles from "../styles/Forum.module.css";
import Popup from "../../components/Popup";
import Button from "../../components/Button";
import { BiComment, BiDownArrow, BiUpArrow, BiX } from "react-icons/bi";
import Separator from "../../components/Separator";
import Input from "../../components/Input";
import useUser from "../../Hooks/useUser";
import InputFile from "../../components/InputFile";
import Footer from "../../partials/Footer";

const getInitial = name => {
    let names = name.split(' ');
    let toReturn = names[0][0];
    if (names.length > 1) {
        toReturn += names[names.length - 1][0];
    }
    return toReturn.toUpperCase();
}

const CourseForum = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useUser();
    const [isLoading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [threads, setThreads] = useState([]);
    const [page, setPage] = useState(1);
    const [raw, setRaw] = useState(null);
    const [ableToPost, setAbleToPost] = useState(false);

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [attachmentCounter, setAttachmentCounter] = useState(['cok']);
    const [attachments, setAttachments] = useState([]);

    const [isWriting, setWriting] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/page/forum/${id}`, {
                token: user?.token
            })
            .then(response => {
                let res = response.data;
                setCourse(res.course);
                setThreads(res.threads.data);
                setRaw(res.threads)
                setAbleToPost(res.able_to_post);
            })
        }
    }, [isLoading]);

    const post = (e) => {
        let formData = new FormData();
        formData.append('token', user.token);
        formData.append('course_id', id);
        formData.append('title', title);
        formData.append('body', body);

        axios.post(`${config.baseUrl}/api/forum/thread/post`, formData)
        .then(response => {
            let res = response.data;
            setWriting(false);
            setLoading(true);
        });

        e.preventDefault();
    }

    const vote = (threadID, type) => {
        let endpoint = `${config.baseUrl}/api/forum/thread/${threadID}/vote/${type}`;

        axios.post(endpoint, {
            token: user?.token,
        })
        .then(response => {
            let res = response.data;
            setLoading(true);
        })
    }

    return (
        <>
            <HeaderPage />
            <div className="content">
                <div className="inner_content">
                    <div className={styles.Container}>
                        <div className={styles.LeftContent}>
                            <div className={styles.CourseInfoCard}>
                                <img src={`${config.baseUrl}/storage/cover_images/${course?.cover_image}`} alt={course?.title} className={styles.CourseCover} />
                                <div className="inline">
                                    <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1}}>
                                        <div style={{fontSize: 12,color: '#666'}}>Forum untuk Kursus</div>
                                        <div className={styles.CourseTitle}>{course?.title}</div>
                                    </div>
                                    {
                                        (user !== null && user !== 'unauthenticated' && ableToPost) &&
                                        <button className={styles.CreateButton} onClick={() => setWriting(true)}>
                                            Buat
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={styles.RightContent}>
                            {
                                threads.map((thread, t) => {
                                    let colorKeys = Object.keys(config.colors);
                                    let theColor = colorKeys[Math.floor(Math.random() * colorKeys.length)];
                                    let userColor = config.colors[theColor];
                                    let user = thread.user;
                                    return (
                                        <div key={t} className={styles.PostBox}>
                                            <div className="inline">
                                                <div className={styles.UserIcon} style={{
                                                    backgroundColor: config.colors.blue
                                                }}>{getInitial(user.name)}</div>
                                                <div className={styles.UserName}>{user.name}</div>
                                            </div>
                                            <Separator />
                                            <div className={styles.Title}>{thread.title}</div>
                                            <pre className={styles.Body}>{thread.body}</pre>

                                            <div className="inline">
                                                <div className={styles.ControlButton} style={{
                                                    color: thread.i_have_upvoted ? config.colors.blue : '#666',
                                                    fontWeight: thread.i_have_upvoted ? '700' : '400',
                                                }} onClick={() => vote(thread.id, 'upvote')}>
                                                    <BiUpArrow color={config.colors.blue} />
                                                    Upvote ({thread.upvote_count})
                                                </div>
                                                <div className={styles.ControlButton} style={{
                                                    color: thread.i_have_downvoted ? config.colors.blue : '#666',
                                                    fontWeight: thread.i_have_downvoted ? '700' : '400',
                                                }} onClick={() => vote(thread.id, 'downvote')}>
                                                    <BiDownArrow color={config.colors.blue} />
                                                    Upvote ({thread.downvote_count})
                                                </div>
                                                <div className={styles.ControlButton} onClick={() => navigate(`/thread/${thread.id}`)}>
                                                    <BiComment color={config.colors.blue} />
                                                    Balasan ({thread.comments_count})
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>

                <Footer />
            </div>

            {
                isWriting &&
                <Popup onDismiss={() => setWriting(false)}>
                    <div className="inline">
                        <h4 style={{margin: 0,display: 'flex',flexGrow: 1}}>Tanyakan ke Forum</h4>
                        <Button circle accent="secondary" color="muted" height={36} onClick={() => setWriting(false)}>
                            <BiX size={24} />
                        </Button>
                    </div>
                    <Separator />
                    <form action="#" onSubmit={post}>
                        <Input label="Judul Pertanyaan" value={title} onInput={e => setTitle(e.currentTarget.value)} />
                        <Input label="Jelaskan pertanyaan lebih detail" value={body} onInput={e => setBody(e.currentTarget.value)} multiline />
                        <Button>Submit</Button>
                    </form>
                </Popup>
            }
        </>
    )
}

export default CourseForum;