import React, { useEffect, useRef, useState } from "react";
import Header from "../../partials/Header";
import AdminMenu from "../../partials/AdminMenu";
import { useNavigate } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import { MdWest } from "react-icons/md";
import Button from "../../components/Button";
import axios from "axios";
import config from "../../config";
import Input from "../../components/Input";
import InputFile from "../../components/InputFile";
import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import Separator from "../../components/Separator";

const inputStyles = Input({exportStyles: true});
const InputContainer = ({children}) => {
    return (
        <div className={inputStyles.styles.Wrapper}>
            <div className={inputStyles.styles.Area}>
                {children}
            </div>
            {inputStyles.bottomLine}
        </div>
    )
}

const CourseCreate = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cover, setCover] = useState(null);
    const [category, setCategory] = useState(null);
    const [startDate, setStartDate] = useState(moment().format('Y-MM-DD'));
    const [endDate, setEndDate] = useState(moment().add(1, 'day').format('Y-MM-DD'));
    const [capacity, setCapacity] = useState(100);

    useEffect(() => {
        document.title = `Buat Pelatihan Baru - ${config.appName}`;
        if (token === null) {
            setToken(
                JSON.parse(window.localStorage.getItem('admin_data')).token
            );
        }
    }, [token]);

    useEffect(() => {
        if (isLoading && token !== null) {
            setLoading(false);
            axios.get(`${config.baseUrl}/api/category`)
            .then(response => {
                let res = response.data;
                setCategories(res.categories);
            })
        }
    }, [isLoading, token]);

    const submit = e => {
        const formData = new FormData();
        formData.append('token', token);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('cover_image', cover);
        formData.append('category', category);
        formData.append('quantity', capacity);
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);

        axios.post(`${config.baseUrl}/api/course/create`, formData)
        .then(response => {
            let res = response.data;
            navigate(`/admin/master/course/${res.course.id}/materi`);
        })
        e.preventDefault();
    }

    return (
        <>
            <Header />
            <AdminMenu active={'course'} />
            <div className="content user">
                <div className="inline">
                    <a href="/admin/master/course">
                        <MdWest />
                    </a>
                    <h3 style={{display: 'flex',flexGrow: 1,margin: 0}}>Buat Course</h3>
                </div>

                <form action="#" onSubmit={submit} style={{marginTop: 40,display: 'flex',flexDirection: 'column',gap: 20}}>
                    <div className="inline">
                        <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1}}>
                            <div style={{fontSize: 16,fontWeight: 700}}>Gambar Cover</div>
                            <div style={{fontSize: 12,color: '#777',marginTop: 10}}>Ukuran 1600 x 900 pixels, PNG / JPG</div>
                        </div>
                        <InputFile aspectRatio="16/9" size={150} onChange={(input, e) => {
                            setCover(input.files[0]);
                        }} />
                    </div>
                    
                    <Input label="Judul Course" value={title} onInput={e => setTitle(e.currentTarget.value)} />
                    <Input label="Deskripsi" value={description} onInput={e => setDescription(e.currentTarget.value)} multiline />

                    <div style={{fontSize: 12,color: '#888'}}>Kategori :</div>
                    <select name="category" id="category" required onChange={e => setCategory(e.currentTarget.value)}>
                        <option value="">Pilih Kategori...</option>
                        {
                            categories.map((cat, c) => (
                                <option key={c} value={cat.name}>{cat.name}</option>
                            ))
                        }
                    </select>

                    <Separator width="70%" />

                    <div className="inline">
                        <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column'}}>
                            <div style={{fontSize: 12,color: '#666'}}>Tanggal Mulai Batch Pertama :</div>
                            <InputContainer>
                                <Flatpickr
                                    style={{height: 40}}
                                    defaultValue={startDate}
                                    onChange={([date]) => {
                                        let dt = moment(date);
                                        setStartDate(dt.format('Y-MM-DD'));
                                        setEndDate(moment(date).add(1, 'day').format('Y-MM-DD'));
                                    }}
                                    options={{
                                        enableTime: false,
                                    }}
                                />
                            </InputContainer>
                        </div>
                        <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column'}}>
                            <div style={{fontSize: 12,color: '#666'}}>Tanggal Berakhir Batch Pertama:</div>
                            <InputContainer>
                                <Flatpickr
                                    style={{height: 40}}
                                    defaultValue={endDate}
                                    onChange={([date]) => {
                                        let dt = moment(date);
                                        setEndDate(dt.format('Y-MM-DD'));
                                    }}
                                    options={{
                                        enableTime: false,
                                        minDate: moment(startDate).add(1, 'day').format('Y-MM-DD'),
                                    }}
                                />
                            </InputContainer>
                        </div>
                        <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column'}}>
                            <Input type="number" label="Kapasitas Peserta" value={capacity} onInput={e => setCapacity(e.currentTarget.value)} required right={'peserta'} />
                        </div>
                    </div>

                    <Button>
                        Submit
                    </Button>
                </form>
            </div>
        </>
    )
}

export default CourseCreate;