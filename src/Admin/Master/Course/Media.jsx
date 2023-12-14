import axios from "axios";
import React, { useEffect, useState } from "react";
import config from "../../../config";
import InputFile from "../../../components/InputFile";
import styles from "../../styles/Course.module.css";
import { BiTrash } from "react-icons/bi";
import Header from "../../../partials/Header";
import AdminMenuSimple from "../../../partials/AdminMenuSimple";
import CourseMenu from "../../../partials/CourseMenu";
import { useParams } from "react-router-dom";

const CourseMedia = () => {
    const { id } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [isUploading, setUploading] = useState(false);
    const [medias, setMedias] = useState([]);
    const [course, setCourse] = useState(null);

    const [media, setMedia] = useState(null);

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.get(`${config.baseUrl}/api/course/${id}/media`)
            .then(response => {
                let res = response.data;
                setMedias(res.medias);
                setCourse(res.course);
            })
        }
    }, [isLoading])

    useEffect(() => {
        if (isUploading && media !== null) {
            let formData = new FormData();
            formData.append('media', media);
            formData.append('media_type', 'image');

            console.log(media);
            
            axios.post(`${config.baseUrl}/api/course/${course.id}/media/store`, formData)
            .then(response => {
                let res = response.data;
                setLoading(true);
                setMedia(null);
                setUploading(false);
            })
        }
    }, [isUploading, media]);

    const del = (id) => {
        axios.post(`${config.baseUrl}/api/course/${course.id}/media/delete`, {
            id: id,
        })
        .then(response => {
            let res = response.data;
            setLoading(true);
        })
    }

    return (
        <>
            <Header />
            <AdminMenuSimple />
            <CourseMenu active={'media'} course={course} />
            <div className="content organizer">
                <InputFile autoClear={true} aspectRatio="16/9" size={150} onChange={(input, e) => {
                    setMedia(input.files[0]);
                    setUploading(true);
                }} />
                <div style={{height: 40}}></div>
                
                <div className={styles.ListContainer}>
                    {
                        medias.map((med, m) => (
                            <div key={m} className={styles.MediaItem}>
                                <img src={`${config.baseUrl}/storage/medias/${med.filename}`} alt={med.filename} className={styles.MediaImage} />
                                <div className={styles.DeleteFloating} onClick={() => del(med.id)}>
                                    <BiTrash />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default CourseMedia;