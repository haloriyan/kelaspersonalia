import React, { useEffect, useState } from "react";
import styles from "./styles/Home.module.css";
import HeaderPage from "../partials/HeaderPage";
import axios from "axios";
import config from "../config";
import Footer from "../partials/Footer";
import courseStyles from "../Admin/styles/Course.module.css";
import { BiCalendar, BiChalkboard, BiListCheck, BiTime } from "react-icons/bi";
import Substring from "../components/Substring";
import moment from "moment";

const getDuration = duration => {
    let menit = duration / 60;
    let detik = duration % 20;
    return `${Math.floor(menit)}m ${detik}d`;
}

const Home = () => {
    const [isLoading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        document.title = "Home - Kelas Personalia"
    });

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/page/home`)
            .then(response => {
                let res = response.data;
                setCategories(res.categories);
                setCourses(res.courses);
                setEvents(res.events);
            })
        }
    }, [isLoading]);

    return (
        <>
            <HeaderPage />
            <div className="content">
                <div className={styles.Jumbo}>
                    <div className={styles.JumboContent}>
                        <h2 className={styles.JumboTitle}>
                            Temukan cara memanage organisasi yang bisa membuat perusahaan Anda bertumbuh
                        </h2>
                        <div style={{display: 'flex',flexDirection: 'row'}}>
                            <a href="#courses_area" className={styles.JumboButton}>Lihat Kelas</a>
                        </div>
                    </div>
                    <div className={styles.JumboIconArea}>
                        <img src="/icon.png" alt="Icon on Jumbo" className={styles.IconOnJumbo} />
                    </div>
                </div>

                <div className={styles.Section}>
                    <h3 style={{marginTop: 0}}>Kategori Kelas</h3>
                    <div className={styles.CategoryContainer}>
                        {
                            categories.map((cat, c) => (
                                <a key={c} className={styles.CategoryItem} href={`/category/${cat.id}`}>
                                    <img src={`${config.baseUrl}/storage/category_covers/${cat.cover}`} alt={cat.name} className={styles.CategoryCover} />
                                    <div className={styles.CategoryName}>{cat.name}</div>
                                </a>
                            ))
                        }
                    </div>
                </div>

                <div className={styles.Section} id="courses_area">
                    <h3 style={{marginTop: 0}}>Pelatihan Terbaru</h3>
                    <div className={courseStyles.ListContainer}>
                        {
                            courses.map((cour, c) => (
                                <a href={`/course/${cour.id}`} className={courseStyles.ListItem} key={c}>
                                    <img src={`${config.baseUrl}/storage/cover_images/${cour.cover_image}`} alt={cour.title} className={courseStyles.CourseCover} />
                                    <div className={courseStyles.CourseTitle}>{Substring(cour.title, 8, true)}</div>
                                    <div className={courseStyles.CourseInfo}>
                                        <div className={courseStyles.InfoItem}>
                                            <BiListCheck />
                                            {cour.materials.length} Materi
                                        </div>
                                        <div className={courseStyles.InfoItem}>
                                            <BiTime />
                                            {getDuration(
                                                cour.materials.reduce((acm, obj) => acm + obj.duration, 0)
                                            )}
                                        </div>
                                    </div>
                                </a>
                            ))
                        }
                    </div>
                </div>

                {
                    events.length > 0 &&
                    <div className={styles.Section}>
                        <h3 style={{marginTop: 0}}>Ikuti Webinar</h3>
                        <div className={courseStyles.ListContainer}>
                            {
                                events.map((evt, e) => (
                                    <a href={`/event/${evt.id}`} key={e} className={courseStyles.ListItem} style={{
                                        flexBasis: '18%',
                                        maxWidth: '20%'
                                    }}>
                                        <img src={`${config.baseUrl}/storage/event_covers/${evt.cover}`} alt={evt.title} className={courseStyles.CourseCover} />
                                        <div className={courseStyles.CourseTitle} style={{marginBottom: 10}}>{Substring(evt.title, 8, true)}</div>
                                        <div className={courseStyles.InfoItem}>
                                            <BiCalendar />
                                            {moment(evt.start_date).format('DD MMM')}
                                        </div>
                                        <div className={courseStyles.InfoItem} style={{marginTop: 5}}>
                                            <BiChalkboard />
                                            {evt.course.title}
                                        </div>
                                    </a>
                                ))
                            }
                        </div>
                    </div>
                }

                <Footer />
            </div>
        </>
    )
}

export default Home;