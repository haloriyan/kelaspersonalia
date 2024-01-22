import React, { useEffect, useRef, useState } from "react";
import Header from "../../../partials/Header";
import AdminMenuSimple from "../../../partials/AdminMenuSimple";
import CourseMenu from "../../../partials/CourseMenu";
import axios from "axios";
import config from "../../../config";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/Button";
import Popup from "../../../components/Popup";
import { BiChevronDown, BiChevronUp, BiFile, BiTime, BiTrash, BiX } from "react-icons/bi";
import Input from "../../../components/Input";
import styles from "../../styles/Course.module.css";
import Toggler from "../../../components/Toggler";
import Separator from "../../../components/Separator";

const getDuration = duration => {
    let menit = duration / 60;
    let detik = duration % 20;
    return `${Math.floor(menit)}m ${detik}d`;
}

const CourseModul = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [moduls, setModuls] = useState([]);
    const [modul, setModul] = useState(null);
    const [viewing, setViewing] = useState('Video');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [video, setVideo] = useState(null);
    const [doc, setDoc] = useState(null);
    const inputRef = useRef(null);
    const docRef = useRef(null);

    const [isAdding, setAdding] = useState(false);

    useEffect(() => {
        document.title = `Modul - ${config.appName}`
    }, []);

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/course/${id}/modul`)
            .then(response => {
                let res = response.data;
                setCourse(res.course);
                setModuls(res.moduls);

                if (modul !== null) {
                    res.moduls.map(mod => {
                        if (mod.id === modul.id) {
                            setModul(mod);
                        }
                    })
                }
            })
        }
    }, [isLoading, modul]);

    const submit = e => {
        axios.post(`${config.baseUrl}/api/course/${id}/modul/create`, {
            title, description
        })
        .then(response => {
            let res = response.data;
            setLoading(true);
            setAdding(false);
            setTitle('');
            setDescription('');
        })
        e.preventDefault();
    }
    const setModulPriority = (modulID, action) => {
        axios.post(`${config.baseUrl}/api/course/${id}/modul/${modulID}/priority/${action}`)
        .then(response => {
            let res = response.data;
            setLoading(true);
        })
    }

    const storeVideo = (file) => {
        let formData = new FormData();
        formData.append('video', file);

        axios.post(`${config.baseUrl}/api/course/${id}/modul/${modul.id}/video/store`, formData)
        .then(response => {
            let res = response.data;
            setLoading(true);
            setVideo(null);
        })
    }
    const deleteVideo = id => {
        axios.post(`${config.baseUrl}/api/course/${id}/modul/${modul.id}/video/delete`, {id})
        .then(response => {
            let res = response.data;
            setLoading(true);
            setVideo(null);
        })
    }

    const storeDocument = file => {
        let formData = new FormData();
        formData.append('document', file);

        axios.post(`${config.baseUrl}/api/course/${id}/modul/${modul.id}/document/store`, formData)
        .then(response => {
            let res = response.data;
            setLoading(true);
            setDoc(null);
        })
    }
    const deleteDocument = id => {
        axios.post(`${config.baseUrl}/api/course/${id}/modul/${modul.id}/document/delete`, {id})
        .then(response => {
            let res = response.data;
            setLoading(true);
            setDoc(null);
        })
    }

    return (
        <>
            <Header />
            <AdminMenuSimple />
            <CourseMenu active={'modul'} course={course} />
            <div className="content organizer">
                <div className={styles.ModulContainer}>
                    <div className={styles.ModulLeft}>
                        <div className="inline">
                            <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1}}>
                                <h2 style={{margin: 0}}>Modul</h2>
                                <div style={{fontSize: 14,color: '#666',marginTop: 5}}>Unit kompetensi yang akan dipelajari oleh peserta {course?.title}</div>
                            </div>
                            <Button accent="secondary" onClick={() => setAdding(true)}>
                                Tambah
                            </Button>
                        </div>

                        <div className={styles.MaterialContainer}>
                            {
                                moduls.map((mod, m) => (
                                    <div key={m} className={styles.MaterialItem}>
                                        <dir className={styles.MaterialLeftControl}>
                                            {
                                                m !== 0 &&
                                                <div onClick={() => setModulPriority(mod.id, 'decrease')}><BiChevronUp size={20} /></div>
                                            }
                                            {
                                                (m !== moduls.length - 1) &&
                                                <div onClick={() => setModulPriority(mod.id, 'increase')}><BiChevronDown size={20} /></div>
                                            }
                                        </dir>
                                        <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1,gap: 5}}>
                                            <div>{mod.title}</div>
                                            <div style={{fontSize: 13,color: '#666'}}>{mod.description}</div>
                                        </div>
                                        <Button accent="secondary" onClick={() => {
                                            setViewing('Video');
                                            setModul(mod);
                                        }}>
                                            Detail
                                        </Button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    {
                        modul !== null &&
                        <div className={styles.ModulDetail}>
                            <div className="inline" style={{marginBottom: 20}}>
                                <h4 style={{display: 'flex',flexGrow: 1,margin: 0}}>{modul.title}</h4>
                                <Button circle accent="secondary" color="muted" onClick={() => setModul(null)}>
                                    <BiX />
                                </Button>
                            </div>

                            <Toggler options={['Deskripsi', 'Video', 'Dokumen']} value={viewing} setValue={setViewing} />
                            {
                                viewing === 'Deskripsi' &&
                                <div style={{marginTop: 10}}>
                                    <div style={{fontSize: 15,color: '#333'}}>{modul.description}</div>
                                </div>
                            }
                            {
                                viewing === 'Dokumen' &&
                                <div style={{marginTop: 10}}>
                                    {
                                        modul.documents.map((theDoc, d) => (
                                            <>
                                                <div className="inline">
                                                    {/* <img src={`${config.baseUrl}/storage/thumbs/${vid.thumbnail}`} alt={vid.title} className={styles.MaterialThumb} /> */}
                                                    <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column'}}>
                                                        <div>{theDoc.title}</div>
                                                        <div className="inline" style={{fontSize: 12,color: '#666',marginTop: 5,gap: 5}}>
                                                            <BiFile />
                                                            {theDoc.size} MB
                                                        </div>
                                                    </div>
                                                    <Button circle accent="secondary" color="red" height={36} onClick={() => deleteDocument(theDoc.id)}>
                                                        <BiTrash />
                                                    </Button>
                                                </div>
                                            </>
                                        ))
                                    }
                                    <Separator />
                                    <div className={styles.VideoInput}>
                                        <input type="file" ref={docRef} className={styles.TheVideoInput} onChange={e => {
                                            setDoc(docRef.current.files[0]);
                                            storeDocument(docRef.current.files[0]);
                                        }} />
                                        <div className={styles.VideoInputFileName}>
                                            {doc === null ? 'Pilih File Dokumen' : `Mengupload ${doc.name}...`}
                                        </div>
                                        <Button type="button" height={36} onClick={() => docRef.current.click()}>Pilih File</Button>
                                    </div>
                                </div>
                            }
                            {
                                viewing === 'Video' &&
                                <div style={{marginTop: 10}}>
                                    {
                                        modul.videos.map((vid, v) => (
                                            <>
                                                <div className="inline">
                                                    <img src={`${config.baseUrl}/storage/thumbs/${vid.thumbnail}`} alt={vid.title} className={styles.MaterialThumb} />
                                                    <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column'}}>
                                                        <div>{vid.title}</div>
                                                        <div className="inline" style={{fontSize: 12,color: '#666',marginTop: 5,gap: 5}}>
                                                            <BiTime />
                                                            {getDuration(vid.duration)}
                                                        </div>
                                                    </div>
                                                    <Button circle accent="secondary" color="red" height={36} onClick={() => deleteVideo(vid.id)}>
                                                        <BiTrash />
                                                    </Button>
                                                </div>
                                                {
                                                    v !== modul.videos.length - 1 &&
                                                    <Separator margin="10px 0px" color="#fff" />
                                                }
                                            </>
                                        ))
                                    }
                                    <Separator />
                                    <div className={styles.VideoInput}>
                                        <input type="file" ref={inputRef} className={styles.TheVideoInput} onChange={e => {
                                            setVideo(inputRef.current.files[0]);
                                            storeVideo(inputRef.current.files[0]);
                                        }} />
                                        <div className={styles.VideoInputFileName}>
                                            {video === null ? 'Pilih File Video' : `Mengupload ${video.name}...`}
                                        </div>
                                        <Button type="button" height={36} onClick={() => inputRef.current.click()}>Pilih File</Button>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>

            {
                isAdding &&
                <Popup onDismiss={() => setAdding(false)}>
                    <div className="inline">
                        <h2 style={{margin: 0,display: 'flex',flexGrow: 1}}>Tambah Modul</h2>
                        <Button accent="secondary" color="muted" circle onClick={() => setAdding(false)}>
                            <BiX size={24} />
                        </Button>
                    </div>

                    <form action="#" onSubmit={submit}>
                        <Input label="Judul" value={title} onInput={e => setTitle(e.currentTarget.value)} required />
                        <Input label="Deskripsi" value={description} onInput={e => setDescription(e.currentTarget.value)} required multiline />

                        <Button>
                            Submit
                        </Button>
                    </form>
                </Popup>
            }
        </>
    )
}

export default CourseModul;