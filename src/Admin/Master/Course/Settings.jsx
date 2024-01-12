import React, { useEffect, useState } from "react";
import Header from "../../../partials/Header";
import AdminMenuSimple from "../../../partials/AdminMenuSimple";
import CourseMenu from "../../../partials/CourseMenu";
import axios from "axios";
import config from "../../../config";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/Button";
import Popup from "../../../components/Popup";
import { BiX } from "react-icons/bi";
import Separator from "../../../components/Separator";
import Input from "../../../components/Input";
import InputFile from "../../../components/InputFile";

const CourseSettings = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [isLoadingCategories, setLoadingCategories] = useState(true);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [cover, setCover] = useState(null);
    const [minCompleteMod, setMinCompleteMod] = useState(0);
    const [minCorrect, setMinCorrect] = useState(0);

    const [isDeletingCourse, setDeletingCourse] = useState(false);

    useEffect(() => {
        if (admin === null) {
            setAdmin(JSON.parse(window.localStorage.getItem('admin_data')));
        }
    }, [admin]);

    useEffect(() => {
        if (isLoadingCategories) {
            setLoadingCategories(false);
            axios.get(`${config.baseUrl}/api/category`)
            .then(response => {
                let res = response.data;
                setCategories(res.categories);
            })
        }
    }, [isLoadingCategories]);

    useEffect(() => {
        if (isLoading && admin !== null) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/course/${id}`)
            .then(response => {
                let res = response.data;
                let cour = res.course;
                setCourse(cour);
                setTitle(cour.title);
                setDescription(cour.description);
                setCategory(cour.category);
                setCover(cour.cover_image);
                setMinCompleteMod(cour.minimum_completing_modul);
                setMinCorrect(cour.minimum_correct_answer);
            })
        }
    }, [isLoading, admin]);

    const doDeleting = () => {
        axios.post(`${config.baseUrl}/api/course/${id}/delete`)
        .then(response => {
            let res = response.data;
            navigate('/admin/master/course');
        })
    }

    const update = (e) => {
        let formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('cover', cover);
        formData.append('minimum_correct_answer', minCorrect);
        formData.append('minimum_completing_modul', minCompleteMod);

        axios.post(`${config.baseUrl}/api/course/${id}/update`, formData)
        .then(response => {
            let res = response.data;
            alert(res.message);
        });

        e.preventDefault();
    }

    return (
        <>
            <Header />
            <AdminMenuSimple />
            <CourseMenu active={'settings'} course={course} />
            <div className="content organizer">
                <h3 style={{display: 'flex',flexGrow: 1,margin: 0}}>Pengaturan</h3>

                <div style={{height: 40}}></div>

                <form action="#" onSubmit={update} style={{display: 'flex',flexDirection: 'column',gap: 20}}>
                    <div className="inline">
                        <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1}}>
                            <div style={{fontSize: 16,fontWeight: 700}}>Gambar Cover</div>
                            <div style={{fontSize: 12,color: '#777',marginTop: 10}}>Ukuran 1600 x 900 pixels, PNG / JPG</div>
                        </div>
                        {
                            cover === null || cover?.name !== undefined ?
                            <InputFile aspectRatio="16/9" size={150} onChange={(input, e) => {
                                setCover(input.files[0]);
                            }} />
                            :
                            <div style={{height: 150,aspectRatio: 16/9,cursor: 'pointer'}} onClick={() => setCover(null)}>
                                <img src={`${config.baseUrl}/storage/cover_images/${course.cover_image}`} alt={course.title} style={{borderRadius: 8}} />
                            </div>
                        }
                    </div>
                    <Input label="Judul Pelatihan" value={title} onInput={e => setTitle(e.currentTarget.value)} required />
                    <Input label="Deskripsi" value={description} onInput={e => setDescription(e.currentTarget.value)} required multiline />
                    
                    <div style={{fontSize: 12,color: '#888'}}>Kategori :</div>
                    <select name="category" id="category" defaultValue={category} required onChange={e => setCategory(e.currentTarget.value)}>
                        {
                            categories.map((cat, c) => (
                                <option key={c} value={cat.name}>{cat.name}</option>
                            ))
                        }
                    </select>

                    <div className="inline" style={{marginTop: 20}}>
                        <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column'}}>
                            <div style={{fontWeight: 700,marginBottom: 5}}>Penyelesaian Modul</div>
                            <div style={{fontSize: 14,color: '#666'}}>Persentase minimum untuk dianggap selesai menyelesaikan modul</div>
                        </div>
                        <Input label="Persentase Penyelesaian" right={'%'} value={minCompleteMod} onInput={e => setMinCompleteMod(e.currentTarget.value)} required />
                    </div>
                    <div className="inline" style={{marginTop: 20}}>
                        <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column'}}>
                            <div style={{fontWeight: 700,marginBottom: 5}}>Jawaban Benar</div>
                            <div style={{fontSize: 14,color: '#666'}}>Jumlah minimum jawaban yang benar saat mengisi uji kompetensi</div>
                        </div>
                        <Input label="Minimal Jawaban Benar" value={minCorrect} onInput={e => setMinCorrect(e.currentTarget.value)} required />
                    </div>

                    <div style={{display: 'flex',justifyContent: 'flex-end',flexDirection: 'row',marginTop: 20}}>
                        <Button>Simpan Perubahan</Button>
                    </div>
                </form>

                <Separator margin="50px 0px" />

                <div className="inline" style={{marginTop: 40}}>
                    <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column'}}>
                        <div style={{fontWeight: 700,marginBottom: 5}}>Hapus Pelatihan</div>
                        <div style={{fontSize: 14,color: '#666'}}>Semua data terkait akan dihapus dan tindakan ini tidak dapat dipulihkan</div>
                    </div>
                    <Button color="red" onClick={() => {
                        setDeletingCourse(true);
                    }}>
                        Hapus
                    </Button>
                </div>

                <div style={{height: 40}}></div>
            </div>

            {
                isDeletingCourse &&
                <Popup onDismiss={() => setDeletingCourse(false)}>
                    <div className="inline">
                        <h3 style={{display: 'flex',flexGrow: 1,margin: 0}}>Hapus Course</h3>
                        <Button circle color="muted" accent="secondary" onClick={() => setDeletingCourse(false)}>
                            <BiX />
                        </Button>
                    </div>

                    <p>
                        Yakin ingin menghapus course? Tindakan ini tidak dapat dibatalkan dan akan menghapus seluruh data yang terkait
                    </p>

                    <Button color="red" onClick={doDeleting}>Ya, Hapus Course</Button>
                </Popup>
            }
        </>
    )
}

export default CourseSettings;