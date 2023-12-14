import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderPage from "../partials/HeaderPage";
import config from "../config";
import styles from "./styles/Category.module.css";

const Category = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/page/category`, {
                id: id
            })
            .then(response => {
                let res = response.data;
                if (res.category === null) {
                    navigate('/error/404');
                } else {
                    setCategory(res.category);
                    setCourses(res.courses);
                    setCategories(res.categories);
                }
            })
        }
    }, [isLoading]);

    return (
        <>
            <HeaderPage />
            {
                category !== null &&
                <div className="content">
                    <div className={styles.Jumbo}>
                        <img src={`${config.baseUrl}/storage/category_covers/${category.cover}`} alt={category.name} className={styles.JumboCover} />
                        <div className={styles.JumboContent}>
                            <h2 className={styles.JumboTitle}>{category.name}</h2>
                            <div>{courses.length} pelatihan</div>
                        </div>
                    </div>

                    <div className={styles.Section}>
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
                </div>
            }
        </>
    )
}

export default Category;