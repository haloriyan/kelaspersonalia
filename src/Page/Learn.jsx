import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderPage from "../partials/HeaderPage";
import useUser from "../Hooks/useUser";
import axios from "axios";
import config from "../config";
import styles from "./styles/Learn.module.css";
import Radio from "../components/Radio";
import Separator from "../components/Separator";
import { BiFastForward, BiFile, BiPause, BiPlay, BiRewind } from "react-icons/bi";
import InArray from "../components/InArray";
import Button from "../components/Button";

const getDuration = duration => {
    let menit = duration / 60;
    let detik = duration % 20;
    return `${Math.floor(menit)}m ${detik}d`;
}

const Learn = () => {
    const { modulID, enrollID } = useParams();
    const [user, setUser] = useUser();
    const [isLoading, setLoading] = useState(true);

    const [modul, setModul] = useState(null);
    const [progress, setProgess] = useState([0]);
    const [totalProgress, setTotalProgress] = useState(0);
    const [contents, setContents] = useState([]);
    const [contentIndex, setContentIndex] = useState(0);
    const [ableToChange, setAbleToChange] = useState(false);
    const [docPageNumber, setDocPageNumber] = useState(1);

    const videoRef = useRef(null);
    const documentRef = useRef(null);

    useEffect(() => {
        let interval = setInterval(() => {
            let ability = window.localStorage.getItem('able_to_change');
            setAbleToChange(ability === "1");
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // handling video
    useEffect(() => {
        if (videoRef.current !== null) {
            let duration = Math.floor(videoRef.current?.duration);
            let interval = setInterval(() => {
                let currentTime = Math.floor(videoRef.current?.currentTime);

                if ((duration - currentTime) < 3) {
                    setAbleToChange(true);
                } else {
                    setAbleToChange(false);
                }
            }, 1000);
            
            return () => clearInterval(interval);
        }
    }, [videoRef])

    useEffect(() => {
        if (isLoading && user !== null) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/page/learn`, {
                enroll_id: enrollID,
                modul_id: modulID,
                token: user?.token,
            })
            .then(response => {
                let res = response.data;
                setModul(res.modul);
                let totProg = 0;
                totProg += res.modul.documents.length;
                totProg += res.modul.videos.length;
                setTotalProgress(totProg);

                let theContents = [];
                res.modul.documents.map(doc => {
                    let theDoc = doc;
                    theDoc['content_type'] = 'document';
                    theContents.push(theDoc);
                });
                res.modul.videos.map(vid => {
                    let theVid = vid;
                    theVid['content_type'] = 'video';
                    theContents.push(vid);
                });
                setContents(theContents);
            })
        }
    }, [isLoading]);

    const togglePlayPause = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    }

    const done = () => {
        axios.post(`${config.baseUrl}/api/page/learn/done`, {
            modul_id: modulID,
            enroll_id: enrollID, 
        })
        .then(response => {
            let res = response.data;
        })
    }
    const changeContent = (targetIndex) => {
        setContentIndex(targetIndex);
        let prog = [...progress];
        if (!InArray(targetIndex, progress)) {
            prog.push(targetIndex);
        }
        setProgess(prog);

        if (prog.length >= totalProgress) {
            done();
        }
        setAbleToChange(false);
    }
    const getChangeContentCondition = (targetIndex) => {
        if (targetIndex > contentIndex) {
            if (!InArray(targetIndex, progress)) {
                if (ableToChange) {
                    changeContent(targetIndex);
                }
            } else {
                changeContent(targetIndex);
            }
        } else {
            changeContent(targetIndex);
        }
    }

    return (
        <>
            <HeaderPage />
            <div className="content">
                {
                    contents.length > 0 &&
                    <div className={styles.Top}>
                        {
                            contents[contentIndex].content_type === 'document' &&
                            <div className={styles.LeftArea}>
                                <iframe src={`/pdf-view/${contents[contentIndex].filename}`} ref={documentRef} width={'100%'} frameBorder={0}></iframe>
                            </div>
                        }
                        {
                            contents[contentIndex].content_type === 'video' &&
                            <div className={styles.LeftArea}>
                                <video className={styles.Player} ref={videoRef}>
                                    <source src={`${config.baseUrl}/api/page/stream/${contents[contentIndex].id}`} />
                                </video>
                                <div className={styles.VideoControl}>
                                    <div className={styles.ControlButton} onClick={togglePlayPause}>
                                        <BiPlay size={24} />/<BiPause size={24} />
                                    </div>
                                </div>
                            </div>
                        }
                        <div className={styles.Right}>
                            <h3 style={{margin: 0}}>Materi</h3>
                            <div className={styles.MaterialContainer}>
                                {
                                    contents.map((cont, c) => (
                                        <>
                                            <div className={styles.MaterialItem} key={c} onClick={() => {
                                                changeContent(c)
                                            }}>
                                                <Radio active={c == contentIndex} label={null} />
                                                <div style={{display: 'flex',flexDirection: 'column',gap: 5,flexGrow: 1}}>
                                                    <div>{cont.title}</div>
                                                    {
                                                        cont.content_type === 'video' &&
                                                        <div style={{fontSize: 12,color: '#666'}}>{getDuration(cont.duration)}</div>
                                                    }
                                                </div>
                                                <Button height={30} accent="secondary">Buka</Button>
                                            </div>
                                            {
                                                c !== contents.length - 1 &&
                                                <Separator margin="0px" />
                                            }
                                        </>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                }

                {
                    modul !== null &&
                    <div className="inner_content">
                        <div className="inline" style={{marginBottom: 40}}>
                            <h3 style={{margin: 0,display: 'flex',flexGrow: 1}}>{contents[contentIndex].title}</h3>
                        </div>
                        <div style={{fontSize: 12,color: '#666',marginBottom: 5}}>Deskripsi Modul</div>
                        <div>{modul.description}</div>
                    </div>
                }
            </div>
        </>
    )
}

export default Learn;