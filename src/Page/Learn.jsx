import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Learn.module.css";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import config from "../config";
import HeaderPage from "../partials/HeaderPage";
import Radio from "../components/Radio";
import Separator from "../components/Separator";
import { BiFastForward, BiPause, BiPlay, BiRewind } from "react-icons/bi";

const getDuration = duration => {
    let menit = duration / 60;
    let detik = duration % 20;
    return `${Math.floor(menit)}m ${detik}d`;
}

const Learn = () => {
    const { enrollID } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [index, setIndex] = useState(searchParams.get('i'));
    const [isLoading, setLoading] = useState(true);
    const [hittingPath, setHittingPath] = useState(false);
    const videoRef = useRef(null);
    const [material, setMaterial] = useState(null);

    const [enroll, setEnroll] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyboard);
        return () => document.removeEventListener('keydown', handleKeyboard);
    }, []);

    useEffect(() => {
        if (user === null) {
            setUser(
                JSON.parse(window.localStorage.getItem('user_data'))
            );
        }
    }, [user]);

    useEffect(() => {
        if (isLoading && user !== null) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/page/learn`, {
                enroll_id: enrollID,
                hit_path: false,
            })
            .then(response => {
                let res = response.data;
                if (res.enroll.user_id !== user.id) {
                    navigate('/error/401');
                }
                setEnroll(res.enroll);
                setMaterial(res.enroll.course.materials[index]);
                setHittingPath(true);
            })
        }
    }, [isLoading, user]);

    useEffect(() => {
        if (hittingPath && material !== null) {
            setHittingPath(false);
            axios.post(`${config.baseUrl}/api/page/learn`, {
                enroll_id: enrollID,
                material_id: material.id,
                hit_path: true,
            })
            .then(response => {
                let res = response.data;
            })
        }
    }, [hittingPath, material]);

    const togglePlayPause = () => {
        if (videoRef.current.paused) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    }
    const handleKeyboard = (event) => {
        if (event.key === " ") {
            togglePlayPause();
        }
    }

    return (
        <>
            <HeaderPage />
            {
                (enroll !== null && material !== null) &&
                <div className="content" style={{top: 75}}>
                    <div className={styles.Top}>
                        <div className={styles.VideoArea}>
                            <video className={styles.Player} ref={videoRef}>
                                <source src={`${config.baseUrl}/api/page/stream/${material.id}`} />
                            </video>
                            <div className={styles.VideoControl}>
                                <div className={styles.ControlButton} onClick={() => {
                                    videoRef.current.currentTime -= 5;
                                }}>
                                    <BiRewind size={24} />
                                </div>
                                <div className={styles.ControlButton} onClick={togglePlayPause}>
                                    <BiPlay size={24} />/<BiPause size={24} />
                                </div>
                                <div className={styles.ControlButton} onClick={() => {
                                    videoRef.current.currentTime += 5;
                                }}>
                                    <BiFastForward size={24} />
                                </div>
                            </div>
                        </div>
                        <div className={styles.Right}>
                            <h3 style={{margin: 0}}>Materi</h3>
                            <div className={styles.MaterialContainer}>
                                {
                                    enroll.course.materials.map((mat, m) => (
                                        <>
                                            <a href={`/learn/${enrollID}?i=${m}`} className={styles.MaterialItem} key={m}>
                                                <Radio active={m == index} label={null} />
                                                <div style={{display: 'flex',flexDirection: 'column',gap: 5,flexGrow: 1}}>
                                                    <div>{mat.title}</div>
                                                    <div style={{fontSize: 12,color: '#666'}}>{getDuration(mat.duration)}</div>
                                                </div>
                                            </a>
                                            {
                                                m !== enroll.course.materials.length - 1 &&
                                                <Separator margin="0px" />
                                            }
                                        </>
                                    ))
                                }
                            </div>
                        </div>
                    </div>

                    <div className="inner_content">
                        <h2>{material.title}</h2>
                        <pre className={styles.Description}>{material.description}</pre>
                    </div>
                </div>
            }
        </>
    )
}

export default Learn;