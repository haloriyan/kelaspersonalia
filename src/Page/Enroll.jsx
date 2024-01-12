import React, { useEffect, useState } from "react";
import useUser from "../Hooks/useUser";
import HeaderPage from "../partials/HeaderPage";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import config from "../config";
import Footer from "../partials/Footer";
import styles from "./styles/Enroll.module.css";
import moment from "moment";
import Separator from "../components/Separator";
import { BiCheck, BiCheckCircle, BiFile, BiPlay, BiPlayCircle, BiVideo, BiXCircle } from "react-icons/bi";
import Button from "../components/Button";
import Toggler from "../components/Toggler";
import Substring from "../components/Substring";

const Enroll = () => {
    const { enrollID } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useUser(true);
    const [isLoading, setLoading] = useState(true);
    const [viewing, setViewing] = useState('Modul');
    const [ableToDownloadCertificate, setAbleToDownloadCertificate] = useState(false);

    const [enroll, setEnroll] = useState(null);
    const [course, setCourse] = useState(null);
    const [presences, setPresences] = useState([]);
    const [moduls, setModuls] = useState([]);
    const [modulPosition, setModulPosition] = useState(0);
    const [paths, setPaths] = useState([]);
    const [calculating, setCalculating] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [correctAnswer, setCorrectAnswer] = useState(0);
    const [score, setScore] = useState(0);

    const getPath = modulID => {
        let toReturn = null;
        paths.map(path => {
            if (path.modul_id === modulID) {
                toReturn = path;
            }
        })
        return toReturn;
    }

    useEffect(() => {
        if (isLoading && typeof user === 'object' && user !== null) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/page/enroll`, {
                enroll_id: enrollID,
            })
            .then(response => {
                let res = response.data;
                setEnroll(res.enroll);
                setCourse(res.enroll.course);
                setPresences(res.presences);
                setModuls(res.enroll.course.moduls);
                setModulPosition(res.enroll.modul_position);
                setPaths(res.paths);
                setAnswers(res.answers);
                setCalculating(true);
            })
        }
    }, [isLoading, user]);

    useEffect(() => {
        if (paths.length > 0 && presences.length > 0 && calculating) {
            setCalculating(false);
            let completedPaths = [];
            let completedPresences = [];
            let corAnswer = 0;
            paths.map((pat, p) => {
                if (pat.is_complete) {
                    completedPaths.push(pat.id);
                }
            });
            
            presences.map(pre => {
                if (pre.checked_in) {
                    completedPresences.push(pre.id);
                }
            });

            answers.map(ans => {
                if (ans.is_correct) {
                    corAnswer += 1;
                }
            });

            let totalQuestions = enroll.course.quiz.questions.length;
            setScore(
                corAnswer / totalQuestions * 100
            );

            let pathPercentage = completedPaths.length / paths.length * 100;
            let presencePercentage = completedPresences.length / presences.length * 100;

            if (
                pathPercentage >= 100 &&
                presencePercentage >= 100 &&
                corAnswer >= enroll.course.minimum_correct_answer
            ) {
                setAbleToDownloadCertificate(true);
            }

            setCorrectAnswer(corAnswer);
        }
    }, [paths, presences, calculating, enroll]);

    const presenceCheck = id => {
        axios.post(`${config.baseUrl}/api/presence/check`, {id})
        .then(response => {
            setLoading(true);
        })
    }

    return (
        <>
            <HeaderPage />
            <div className="content">
                <div className="inner_content">
                    <div className={styles.Area}>
                        {
                            course !== null &&
                            <div className={styles.CourseCard}>
                                <img src={`${config.baseUrl}/storage/cover_images/${course.cover_image}`} alt={course.title} className={styles.CourseCover} />
                                <h3 className={styles.CourseTitle}>{course.title}</h3>
                                <div className={styles.CourseDescription}>{Substring(course.description, 25, true)}</div>
                                {
                                    ableToDownloadCertificate ?
                                    <Button height={36} style={{marginTop: 20,width: '100%'}} onClick={() => {
                                        window.open(`${config.baseUrl}/export/certificate/${enrollID}`, '_blank');
                                    }}>Unduh Sertifikat</Button>
                                    :
                                    <div className={styles.CourseDescription}>Untuk mendapatkan sertifikat, pastikan Anda telah membuka semua modul, menghadiri presensi, dan menjawab uji kompetensi</div>
                                }
                            </div>
                        }
                        <div className={styles.RightArea}>
                            <Toggler value={viewing} setValue={setViewing} options={['Modul', 'Presensi', 'Uji Kompetensi']} />
                            <div style={{height: 40}}></div>

                            {
                                viewing === 'Uji Kompetensi' &&
                                <>
                                    {
                                        !enroll.has_answered_exam ?
                                            <>
                                                <div className="inline">
                                                    <div style={{display: 'flex',flexGrow: 1}}>Jumlah Pertanyaan</div>
                                                    <div>{course.quiz.questions.length}</div>
                                                </div>
                                                <Separator />
                                                <div className="inline">
                                                    <div style={{display: 'flex',flexGrow: 1}}>Minimal Jawaban Benar</div>
                                                    <div>{course.minimum_correct_answer}</div>
                                                </div>
                                                <Button style={{marginTop: 20}} onClick={() => navigate(`/exam/${enrollID}`)}>Mulai Uji Kompetensi</Button>
                                            </>
                                        :
                                        <>
                                            <div className="inline">
                                                <div style={{display: 'flex',flexGrow: 1}}>Jawaban Benar</div>
                                                <div>{correctAnswer}</div>
                                            </div>
                                            <Separator />
                                            <div className="inline">
                                                <div style={{display: 'flex',flexGrow: 1}}>Skor Uji Kompetensi</div>
                                                <div>{course.minimum_correct_answer}</div>
                                            </div>
                                        </>
                                    }
                                </>
                            }

                            {
                                viewing === 'Modul' &&
                                <div>
                                    <div className={styles.PresenceContainer}>
                                        {
                                            moduls.map((mod, m) => (
                                                <>
                                                    <div key={m} className={styles.PresenceItem}>
                                                        <div className={styles.PresenceDate} style={{flexDirection: 'column'}}>
                                                            <div>{mod.title}</div>
                                                            <div style={{fontSize: 12,color: '#666',marginTop: 5}}>{mod.description}</div>
                                                            <div className="inline">
                                                                <div className="inline" style={{gap: 5,fontSize: 12,color: '#666'}}>
                                                                    <BiPlay />
                                                                    {mod.videos.length} Video
                                                                </div>
                                                                <div className="inline" style={{gap: 5,fontSize: 12,color: '#666'}}>
                                                                    <BiFile />
                                                                    {mod.documents.length} Document
                                                                </div>
                                                                {
                                                                    getPath(mod.id).is_complete ?
                                                                    <div className="inline" style={{gap: 5,fontSize: 12,color: '#2ecc71'}}>
                                                                        <BiCheckCircle />
                                                                        Selesai
                                                                    </div>
                                                                    : ''
                                                                }
                                                            </div>
                                                        </div>
                                                        <Button onClick={() => navigate(`learn/${mod.id}`)}>
                                                            Buka
                                                        </Button>
                                                    </div>
                                                    {
                                                        m !== moduls.length - 1 &&
                                                        <Separator />
                                                    }
                                                </>
                                            ))
                                        }
                                    </div>
                                </div>
                            }

                            {
                                viewing === 'Presensi' &&
                                <div className={styles.Card}>
                                    <div className={styles.PresenceContainer}>
                                        {
                                            presences.map((pres, p) => {
                                                let diffTime = moment().diff(moment(pres.presence_date), 'day', true);
                                                return (
                                                    <>
                                                        <div className={`${styles.PresenceItem} ${pres.checked_in ? styles.PresenceChecked : ''}`} key={p}>
                                                            <div className={styles.PresenceDate}>
                                                                {moment(pres.presence_date).format('D MMM Y')}
                                                            </div>
                                                            <div className={styles.PresenceAction}>
                                                                {
                                                                    pres.checked_in ?
                                                                    <div className={styles.PresenceChecked}>
                                                                        <BiCheckCircle size={18} />
                                                                        Hadir
                                                                    </div>
                                                                    :
                                                                        <>
                                                                        {
                                                                            moment().format('DD MMM Y') == moment(pres.presence_date).format('DD MMM Y') ?
                                                                                <Button onClick={() => presenceCheck(pres.id)}>
                                                                                    Check in
                                                                                </Button>
                                                                            :
                                                                            diffTime > 0 ?
                                                                            <div className={styles.PresenceAbsence}>
                                                                                <BiXCircle size={18} />
                                                                                Tidak hadir
                                                                            </div>
                                                                            : '-'
                                                                        }
                                                                        </>
                                                                }
                                                            </div>
                                                        </div>
                                                        {
                                                            p !== presences.length -1 &&
                                                            <Separator />
                                                        }
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div style={{height: 40}}></div>
                <Footer />
            </div>
        </>
    )
}

export default Enroll;