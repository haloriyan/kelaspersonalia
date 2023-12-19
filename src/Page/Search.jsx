import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import HeaderPage from "../partials/HeaderPage";
import axios from "axios";
import config from "../config";
import courseStyles from "../Admin/styles/Course.module.css";
import Substring from "../components/Substring";
import { BiListCheck, BiTime } from "react-icons/bi";
import Footer from "../partials/Footer";

const getDuration = duration => {
    let menit = duration / 60;
    let detik = duration % 20;
    return `${Math.floor(menit)}m ${detik}d`;
}

const Search = () => {
    const [searchParams] = useSearchParams();
    const [isLoading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [raw, setRaw] = useState(null);

    useEffect(() => {
        document.title = `Mencari '${searchParams.get('q')}' - Kelas Personalia`;
    }, [searchParams])

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/page/search`, {
                q: searchParams.get('q'),
            })
            .then(response => {
                let res = response.data;
                setRaw(res.courses);
                setCourses(res.courses.data);
            })
        }
    }, [isLoading])

    return (
        <>
            <HeaderPage />
            <div className="content">
                <div className="inner_content">
                    <h2 style={{marginTop: 0,marginBottom: 40,fontSize: 24}}>Mencari '{searchParams.get('q')}'</h2>
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

                <div style={{height: 60}}></div>

                <Footer />
            </div>
        </>
    )
}

export default Search;