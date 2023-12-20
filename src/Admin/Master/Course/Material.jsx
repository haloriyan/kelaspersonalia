import React, { useEffect, useRef, useState } from "react";
import Header from "../../../partials/Header";
import AdminMenuSimple from "../../../partials/AdminMenuSimple";
import CourseMenu from "../../../partials/CourseMenu";
import axios from "axios";
import config from "../../../config";
import { useNavigate, useParams } from "react-router-dom";
import Popup from "../../../components/Popup";
import Button from "../../../components/Button";
import styles from "../../styles/Course.module.css";
import Input from "../../../components/Input";
import { BiTime, BiTrash, BiX } from "react-icons/bi";

const getDuration = duration => {
    let menit = duration / 60;
    let detik = duration % 20;
    return `${Math.floor(menit)}m ${detik}d`;
}

const CourseMaterial = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [materials, setMaterials] = useState([]);
    const [material, setMaterial] = useState(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [video, setVideo] = useState(null);
    const inputRef = useRef(null);

    const [uploadButton, setUploadButton] = useState('Upload');
    
    const [isAdding, setAdding] = useState(false);
    const [isDeleting, setDeleting] = useState(false);

    useEffect(() => {
        if (admin === null) {
            setAdmin(JSON.parse(window.localStorage.getItem('admin_data')));
        }
    }, [admin]);

    useEffect(() => {
        if (isLoading && admin !== null) {
            setLoading(false);
            axios.get(`${config.baseUrl}/api/course/${id}/material`)
            .then(response => {
                let res = response.data;
                setCourse(res.course);
                setMaterials(res.materials);
                console.log(res);
            })
        }
    }, [isLoading, admin]);

    const submit = e => {
        setUploadButton('Mengupload...');
        let formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('video', video);

        axios.post(`${config.baseUrl}/api/course/${id}/material/store`, formData)
        .then(response => {
            let res = response.data;
            setTitle('');
            setDescription('');
            setVideo(null);
            setLoading(true);
            setAdding(false);
            setUploadButton('Upload');
        })
        .catch(e => {
            setUploadButton('Upload');
        })
        e.preventDefault();
    }

    const del = () => {
        axios.post(`${config.baseUrl}/api/course/${id}/material/delete`, {
            id: material.id,
        })
        .then(response => {
            let res = response.data;
            setLoading(true);
            setDeleting(false);
        })
    }

    return (
        <>
            <Header />
            <AdminMenuSimple />
            <CourseMenu active={'materi'} course={course} />
            <div className="content organizer">
                <div className="inline">
                    <h3 style={{display: 'flex',flexGrow: 1,margin: 0}}>Materi Pembelajaran</h3>
                    <Button accent="secondary" onClick={() => setAdding(true)}>Tambah</Button>
                </div>

                <div className={styles.MaterialContainer}>
                    {
                        materials.map((mat, m) => (
                            <div key={m} className={styles.MaterialItem}>
                                <img src={`${config.baseUrl}/storage/thumbs/${mat.thumbnail}`} alt={mat.title} className={styles.MaterialThumb} />
                                <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column'}}>
                                    <h4 style={{margin: 0,marginBottom: 10}}>{mat.title}</h4>
                                    <div className="inline">
                                        <div className="inline" style={{gap: 5,fontSize: 12,color: '#666'}}>
                                            <BiTime />
                                            {getDuration(mat.duration)}
                                        </div>
                                    </div>
                                </div>
                                <div style={{display: 'flex',flexDirection: 'row'}}>
                                    <Button color="red" onClick={() => {
                                        setMaterial(mat);
                                        setDeleting(true);
                                    }}>
                                        <BiTrash />
                                    </Button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            {
                isAdding &&
                <Popup onDismiss={() => setAdding(false)}>
                    <div className="inline">
                        <h3 style={{display: 'flex',flexGrow: 1,margin: 0}}>Tambah Materi</h3>
                        <Button circle accent="secondary" color="muted" onClick={() => setAdding(false)}>
                            <BiX size={20} />
                        </Button>
                    </div>

                    <form action="#" onSubmit={submit} style={{marginTop: 20,display: 'flex',flexDirection: 'column',gap: 20}}>
                        <Input label="Judul Materi" value={title} onInput={e => setTitle(e.currentTarget.value)} required={true} />
                        <Input label="Deskripsi" value={description} onInput={e => setDescription(e.currentTarget.value)} required={true} multiline />

                        <div className={styles.VideoInput}>
                            <input type="file" ref={inputRef} className={styles.TheVideoInput} onChange={e => {
                                setVideo(inputRef.current.files[0]);
                            }} />
                            <div className={styles.VideoInputFileName}>
                                {video === null ? 'Pilih File Video' : video.name}
                            </div>
                            <Button type="button" height={36} onClick={() => inputRef.current.click()}>Pilih File</Button>
                        </div>

                        <Button>{uploadButton}</Button>
                    </form>
                </Popup>
            }

            {
                isDeleting &&
                <Popup onDismiss={() => setDeleting(false)}>
                    <div className="inline">
                        <h3 style={{display: 'flex',flexGrow: 1,margin: 0}}>Hapus Materi</h3>
                        <Button circle accent="secondary" color="muted" onClick={() => setDeleting(false)}>
                            <BiX size={20} />
                        </Button>
                    </div>

                    <p>
                        Yakin ingin menghapus materi {material.title}? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data yang terkait
                    </p>

                    <Button color="red" onClick={del}>Ya, hapus</Button>
                </Popup>
            }
        </>
    )
}

export default CourseMaterial;