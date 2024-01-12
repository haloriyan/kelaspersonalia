import React, { useEffect, useState } from "react";
import HeaderPage from "../partials/HeaderPage";
import styles from "./styles/Course.module.css";
import axios from "axios";
import config from "../config";
import { useNavigate, useParams } from "react-router-dom";
import { BiChevronRight } from "react-icons/bi";
import Button from "../components/Button";
import Footer from "../partials/Footer";
import useUser from "../Hooks/useUser";
import useLocation from "../Hooks/useLocation";

const Course = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [pageTitle, setPageTitle] = useState("Detail Pelatihan - Kelas Personalia");
    
    const [user, setUser] = useUser('');
    const location = useLocation();
    const [hasEnrolled, setHasEnrolled] = useState(false);

    const [viewing, setViewing] = useState('Deskripsi');

    useEffect(() => {
        document.title = pageTitle;
    }, [pageTitle])

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            let payload = {
                with: 'moduls.videos'
            };
            if (user !== 'unauthenticated') {
                payload['user_id'] = user.id;
            }
            axios.post(`${config.baseUrl}/api/course/${id}`, payload)
            .then(response => {
                let res = response.data;
                setCourse(res.course);
                setHasEnrolled(res.course.has_enrolled);
                setPageTitle(`${res.course.title} - Kelas Personalia`);
            })
        }
    }, [isLoading]);

    if (course !== null) {
        return (
            <>
                <HeaderPage />
                <div className="content">
                    <div className={styles.BreadCrumb}>
                        <a href="/" className={styles.BreadCrumbItem}>Home</a>
                        <BiChevronRight />
                        <a href={`/category/${course.category}`} className={styles.BreadCrumbItem}>{course.category}</a>
                        <BiChevronRight />
                        <a href="#" className={styles.BreadCrumbItem}>{course.title}</a>
                    </div>

                    <div className={styles.JumboContainer}>
                        <div className={styles.JumboContent}>
                            <div className={styles.JumboTitle}>{course.title}</div>
                        </div>
                        <div className={styles.JumboCover}>
                            <img src={`${config.baseUrl}/storage/cover_images/${course.cover_image}`} className={styles.JumboCoverImage} />
                        </div>

                        <div className={styles.JumboCard}>
                            <img src={`${config.baseUrl}/storage/cover_images/${course.cover_image}`} className={styles.JumboCardImage} />

                            <Button onClick={() => {
                                if (hasEnrolled) {
                                    navigate(`/learn/${course.enroll.id}?i=0`)
                                } else {
                                    navigate('enroll')
                                }
                            }}>
                                {
                                    hasEnrolled ? "Lihat Pelajaran" : "Dapatkan Pelatihan"
                                }
                            </Button>
                        </div>
                    </div>

                    <div className={`inner_content ${styles.InnerContent}`}>
                        <h3 className={styles.JumboTitle} style={{marginTop: 40}}>Deskripsi Pelatihan</h3>
                        <pre style={{marginTop: 20}}>{course.description}</pre>

                        <h3 className={styles.JumboTitle} style={{marginTop: 20}}>Materi Pelatihan</h3>
                        <div className={styles.MateriArea}>
                            {
                                course.moduls.map((materi, m) => (
                                    <div key={m} className={styles.MateriItem}>
                                        {
                                            materi.videos.length > 0 &&
                                            <img src={`${config.baseUrl}/storage/thumbs/${materi.videos[0]?.thumbnail}`} className={styles.MateriImage} />
                                        }
                                        <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column'}}>
                                            <div style={{fontSize: 16,fontWeight: 600}}>{materi.title}</div>
                                            <div style={{fontSize: 12,color: '#666',marginTop: 5}}>{materi.description}</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className={styles.JumboContainer}>
                        <div className={styles.JumboContent}>
                            <div className={styles.JumboTitle}>{course.title}</div>
                            <div style={{display: 'flex',flexDirection: 'row',marginTop: 10}}>
                                <Button onClick={() => navigate('enroll')}>Dapatkan Sekarang</Button>
                            </div>
                        </div>
                        <div className={styles.JumboCover}>
                            <img src={`${config.baseUrl}/storage/cover_images/${course.cover_image}`} className={styles.JumboCoverImage} />
                        </div>
                    </div>

                    <Footer />
                </div>
            </>
        )
    }
}

export default Course;