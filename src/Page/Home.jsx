import React, { useEffect, useState } from "react";
import styles from "./styles/Home.module.css";
import HeaderPage from "../partials/HeaderPage";
import axios from "axios";
import config from "../config";
import Footer from "../partials/Footer";

const Home = () => {
    const [isLoading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/page/home`)
            .then(response => {
                let res = response.data;
                setCategories(res.categories);
                setCourses(res.courses);
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
                            <button className={styles.JumboButton}>Lihat Kelas</button>
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

                <div className={styles.Section}>
                    <h3 style={{marginTop: 0}}>Pelatihan Terbaru</h3>
                    <div className={styles.CourseContainer}>
                        {
                            courses.map((cour, c) => (
                                <a key={c} className={styles.CourseItem} href={`/course/${cour.id}`}>
                                    <img src={`${config.baseUrl}/storage/cover_images/${cour.cover_image}`} alt={cour.title} className={styles.CourseCover} />
                                    <h4 className={styles.CourseTitle}>{cour.title}</h4>
                                </a>
                            ))
                        }
                    </div>
                </div>

                <Footer />
            </div>
        </>
    )
}

export default Home;