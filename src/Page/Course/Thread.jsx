import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderPage from "../../partials/HeaderPage";
import useUser from "../../Hooks/useUser";
import axios from "axios";
import config from "../../config";
import styles from "../styles/Forum.module.css";
import { BiDownArrow, BiPaperPlane, BiTime, BiUpArrow } from "react-icons/bi";
import moment from "moment";

const getInitial = (name = '') => {
    let names = name.split(' ');
    let toReturn = '';

    if (name !== '') {
        toReturn = names[0][0];
        if (names.length > 1) {
            toReturn += names[names.length - 1][0];
        }
    }
    return toReturn.toUpperCase();
}

const Thread = () => {
    const { threadID } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useUser();
    const [ableToReply, setAbleToReply] = useState(false);
    const [isLoadingReplies, setLoadingReplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const [withLoading, setWithLoading] = useState(true);

    const [body, setBody] = useState('');
    const [thread, setThread] = useState(null);

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/forum/thread/${threadID}`, {
                token: user?.token,
            })
            .then(response => {
                let res = response.data;
                setThread(res.thread);
                setLoadingReplies(true);
            })
        }
    }, [isLoading]);

    useEffect(() => {
        if (isLoadingReplies) {
            setLoadingReplies(false);
            axios.post(`${config.baseUrl}/api/forum/thread/${threadID}/reply`, {
                token: user?.token,
            })
            .then(response => {
                let res = response.data;
                setReplies(res.replies);
                setAbleToReply(res.able_to_reply);
            })
        }
    }, [isLoadingReplies])

    const reply = (e) => {
        axios.post(`${config.baseUrl}/api/forum/thread/${threadID}/reply/post`, {
            token: user.token,
            body: body,
        })
        .then(response => {
            let res = response.data;
            setLoadingReplies(true);
            setBody('');
        });

        e.preventDefault();
    }

    const vote = type => {
        let endpoint = `${config.baseUrl}/api/forum/thread/${threadID}/vote/${type}`;

        axios.post(endpoint, {
            token: user?.token,
        })
        .then(response => {
            let res = response.data;
            setLoading(true);
        })
    }
    const voteReply = (type, replyID) => {
        let endpoint = `${config.baseUrl}/api/forum/thread/${threadID}/reply/${replyID}/vote/${type}`;
        console.log(type, replyID);

        axios.post(endpoint, {
            token: user?.token,
        })
        .then(response => {
            let res = response.data;
            console.log(endpoint);
            console.log(res);
            setLoadingReplies(true);
        })
    }

    return (
        <>
            <HeaderPage />
            <div className="content">
                <div className={`inner_content ${styles.InnerContent}`}>
                    <div className={styles.ContainerDetail}>
                        <div className={styles.PostBox}>
                            <div className="inline">
                                <div className={styles.UserIcon} style={{
                                    backgroundColor: config.colors.blue
                                }}>{getInitial(thread?.user.name)}</div>
                                <div className={styles.PostTop}>
                                    <div className={styles.UserName}>{thread?.user.name}</div>
                                    <div className="inline" style={{gap: 5}}>
                                        <BiTime color="#777" size={12} />
                                        {
                                            moment.duration(
                                                moment(thread?.created_at).diff(moment())
                                            ).humanize()
                                        }
                                    </div>
                                </div>
                            </div>

                            <div style={{height: 30}}></div>
                            <div className={styles.Title}>{thread?.title}</div>
                            <pre className={styles.Body}>{thread?.body}</pre>

                            <div className="inline">
                                <div className={styles.ControlButton} onClick={() => vote('upvote')} style={{
                                    fontWeight: thread?.i_have_upvoted ? '700' : '400',
                                    color: thread?.i_have_upvoted ? config.colors.blue : '#555'
                                }}>
                                    <BiUpArrow color={config.colors.blue} />
                                    Upvote ({thread?.upvote_count})
                                </div>
                                <div className={styles.ControlButton} onClick={() => vote('downvote')} style={{
                                    fontWeight: thread?.i_have_downvoted ? '700' : '400',
                                    color: thread?.i_have_downvoted ? config.colors.blue : '#555'
                                }}>
                                    <BiDownArrow color={config.colors.blue} />
                                    Downvote ({thread?.downvote_count})
                                </div>
                            </div>

                            {
                                ableToReply &&
                                <form className={styles.ReplyArea} onSubmit={reply}>
                                    <input type="text" value={body} onInput={e => setBody(e.currentTarget.value)} className={styles.ReplyInput} placeholder="Ketik balasan..." />
                                    <button className={styles.ReplyButton}>
                                        <BiPaperPlane />
                                    </button>
                                </form>
                            }
                        </div>

                        {
                            replies?.map((rep, r) => (
                                <div className={styles.PostBox} key={r}>
                                    <div className="inline">
                                        <div className={styles.UserIcon} style={{
                                            backgroundColor: config.colors.blue
                                        }}>{getInitial(rep.user.name)}</div>
                                        <div className={styles.PostTop}>
                                            <div className={styles.UserName}>{rep.user.name}</div>
                                            <div className="inline" style={{gap: 5}}>
                                                <BiTime color="#777" size={12} />
                                                {
                                                    moment.duration(
                                                        moment(rep.created_at).diff(moment())
                                                    ).humanize()
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <pre className={styles.Body}>{rep.body}</pre>
                                    <div className="inline">
                                        <div className={styles.ControlButton} onClick={() => voteReply('upvote', rep.id)} style={{
                                            fontWeight: rep.i_have_upvoted ? '700' : '400',
                                            color: rep.i_have_upvoted ? config.colors.blue : '#555'
                                        }}>
                                            <BiUpArrow color={config.colors.blue} />
                                            Upvote ({rep.upvote_count})
                                        </div>
                                        <div className={styles.ControlButton} onClick={() => voteReply('downvote', rep.id)} style={{
                                            fontWeight: rep.i_have_downvoted ? '700' : '400',
                                            color: rep.i_have_downvoted ? config.colors.blue : '#555'
                                        }}>
                                            <BiDownArrow color={config.colors.blue} />
                                            Downvote ({rep.downvote_count})
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Thread;