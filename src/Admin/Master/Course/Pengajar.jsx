import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from "../../../config";
import Header from "../../../partials/Header";
import CourseMenu from "../../../partials/CourseMenu";
import AdminMenuSimple from "../../../partials/AdminMenuSimple";
import Button from "../../../components/Button";
import { BiCog, BiImage, BiTrash, BiX } from "react-icons/bi";
import Popup from "../../../components/Popup";
import Input from "../../../components/Input";
import InputFile from "../../../components/InputFile";

const CoursePengajar = () => {
    const { id } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [pengajars, setPengajars] = useState([]);
    const [pengajar, setPengajar] = useState(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [photo , setPhoto] = useState(null);

    const [isAdding, setAdding] = useState(false);
    const [isDeleting, setDeleting] = useState(false);

    useEffect(() => {
        document.title = `Pengajar - ${config.appName}`
    }, []);

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/course/${id}/pengajar`)
            .then(response => {
                let res = response.data;
                setPengajars(res.pengajar);
                setCourse(res.course);
            })
        }
    }, [isLoading]);

    const submit = e => {
        let formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('photo', photo);

        axios.post(`${config.baseUrl}/api/course/${id}/pengajar/create`, formData)
        .then(response => {
            let res = response.data;
            setLoading(true);
            setAdding(false);
            setName('');
            setDescription('');
            setPhoto(null);
        })
        e.preventDefault();
    }

    const del = e => {
        axios.post(`${config.baseUrl}/api/course/${id}/pengajar/delete`, {
            id: pengajar.id,
        })
        .then(response => {
            let res = response.data;
            setLoading(true);
            setDeleting(false);
            setPengajar(null);
        })
        e.preventDefault();
    }

    return (
        <>
            <Header />
            <AdminMenuSimple />
            <CourseMenu active={'pengajar'} course={course} />
            <div className="content organizer">
                <div className="inline">
                    <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1}}>
                        <h2 style={{margin: 0}}>Pengajar</h2>
                        <div style={{fontSize: 14,color: '#666',marginTop: 5}}>Data pengajar di pelatihan {course?.title}</div>
                    </div>
                    <Button accent="secondary" onClick={() => setAdding(true)}>
                        Tambah
                    </Button>
                </div>

                <div style={{height: 40}}></div>

                <table>
                    <thead>
                        <tr>
                            <th><BiImage /></th>
                            <th>Nama</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pengajars.map((peng, p) => (
                                <tr key={p}>
                                    <td>
                                        <img src={`${config.baseUrl}/storage/pengajar_photos/${peng.photo}`} alt={peng.name} style={{
                                            height: 60,aspectRatio: 1,
                                            borderRadius: 8,objectFit: 'cover'
                                        }} />
                                    </td>
                                    <td>{peng.name}</td>
                                    <td>
                                        <Button color="red" onClick={() => {
                                            setPengajar(peng);
                                            setDeleting(true);
                                        }}>
                                            <BiTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {
                isAdding &&
                <Popup onDismiss={() => setAdding(false)}>
                    <div className="inline">
                        <h2 style={{margin: 0,display: 'flex',flexGrow: 1}}>Tambah Data Pengajar</h2>
                        <Button accent="secondary" color="muted" circle onClick={() => setAdding(false)}>
                            <BiX />
                        </Button>
                    </div>
                    <form action="#" onSubmit={submit} style={{marginTop: 20}}>
                        <div className="inline">
                            <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1}}>
                                <div>Foto Pengajar</div>
                                <div style={{fontSize: 12,color: '#666',marginTop: 5}}>PNG/JPG, Rasio 1:1</div>
                            </div>
                            <InputFile size={100} aspectRatio="1/1" labelStyle={{fontSize: 12,margin: 0}} onChange={(input, e) => {
                                setPhoto(input.files[0]);
                            }} />
                        </div>
                        <Input label="Nama" value={name} onInput={e => setName(e.currentTarget.value)} required />
                        <Input label="Tentang Pengajar" value={description} onInput={e => setDescription(e.currentTarget.value)} multiline required />

                        <Button>Tambahkan</Button>
                    </form>
                </Popup>
            }

            {
                isDeleting &&
                <Popup onDismiss={() => setDeleting(false)}>
                    <div className="inline">
                        <h2 style={{margin: 0,display: 'flex',flexGrow: 1}}>Hapus Data Pengajar</h2>
                        <Button accent="secondary" color="muted" circle onClick={() => setDeleting(false)}>
                            <BiX />
                        </Button>
                    </div>
                    <form action="#" onSubmit={del}>
                        <div>Yakin ingin menghapus pengajar {pengajar.name}?</div>
                        <Button color="red">Ya, hapus</Button>
                    </form>
                </Popup>
            }
        </>
    )
}

export default CoursePengajar;