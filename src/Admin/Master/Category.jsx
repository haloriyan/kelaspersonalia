import React, { useEffect, useState } from "react";
import Header from "../../partials/Header";
import AdminMenu from "../../partials/AdminMenu";
import axios from "axios";
import config from "../../config";
import Button from "../../components/Button";
import Popup from "../../components/Popup";
import { BiTrash, BiX } from "react-icons/bi";
import Input from "../../components/Input";
import InputFile from "../../components/InputFile";

const Category = () => {
    const [isLoading, setLoading] = useState(true);
    const [admin, setAdmin] = useState(null);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);

    const [name, setName] = useState('');
    const [icon, setIcon] = useState(null);
    const [cover, setCover] = useState(null);

    const [isAdding, setAdding] = useState(false);
    const [isDeleting, setDeleting] = useState(false);
    const [addButton, setAddButton] = useState('Tambahkan');

    useEffect(() => {
        if (admin === null) {
            setAdmin(JSON.parse(window.localStorage.getItem('admin_data')));
        }
    }, [admin]);

    useEffect(() => {
        if (isLoading && admin !== null) {
            setLoading(false);
            axios.get(`${config.baseUrl}/api/category`)
            .then(response => {
                let res = response.data;
                setCategories(res.categories);
            })
        }
    }, [isLoading, admin]);

    const submit = e => {
        setAddButton('Menambahkan...');
        let formData = new FormData();
        formData.append('name', name);
        formData.append('icon', icon);
        formData.append('cover', cover);

        axios.post(`${config.baseUrl}/api/category/create`, formData)
        .then(response => {
            let res = response.data;
            setAddButton('Tambahkan');
            setName('');
            setIcon(null);
            setCover(null);
            setAdding(false);
            setLoading(true);
        })
        .catch(e => {
            setAddButton('Tambahkan');
        })
        e.preventDefault();
    }
    const del = () => {
        axios.post(`${config.baseUrl}/api/category/delete`, {
            id: category.id,
        })
        .then(response => {
            let res = response.data;
            setLoading(true);
            setDeleting(false);
            setCategory(null);
        })
    }

    return (
        <>
            <Header />
            <AdminMenu active={'category'} />
            <div className="content user">
                <div className="inline">
                    <h2 style={{margin: 0,display: 'flex',flexGrow: 1}}>Kategori Pelatihan</h2>
                    <Button accent="secondary" onClick={() => setAdding(true)}>
                        Tambah
                    </Button>
                </div>

                <div style={{height: 40}}></div>

                <table>
                    <thead>
                        <tr>
                            <th>Icon</th>
                            <th>Cover</th>
                            <th>Nama Kategori</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            categories.map((cat, c) => (
                                <tr key={c}>
                                    <td>
                                        <img src={`${config.baseUrl}/storage/category_icons/${cat.icon}`} alt={`icon ${cat.name}`} style={{
                                            height: 80,
                                            aspectRatio: 1,
                                            borderRadius: 6,
                                        }} />
                                    </td>
                                    <td>
                                        <img src={`${config.baseUrl}/storage/category_covers/${cat.cover}`} alt={`cover ${cat.name}`} style={{
                                            height: 80,
                                            aspectRatio: 16/9,
                                            borderRadius: 6,
                                        }} />
                                    </td>
                                    <td>{cat.name}</td>
                                    <td>
                                        <Button color="red" height={40} onClick={() => {
                                            setCategory(cat);
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
                    <div className="inline" style={{marginBottom: 20}}>
                        <h2 style={{margin: 0,display: 'flex',flexGrow: 1}}>Tambah Kategori</h2>
                        <Button accent="secondary" color="muted" circle onClick={() => setAdding(false)}>
                            <BiX />
                        </Button>
                    </div>
                    <form action="#" onSubmit={submit}>
                        <Input label="Nama Kategori" value={name} onInput={e => setName(e.currentTarget.value)} required />
                        <div className="inline" style={{marginTop: 20}}>
                            <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column'}}>
                                <div>Icon</div>
                                <div style={{fontSize: 12,color: '#555',marginTop: 5}}>Gambar persegi (100 x 100 pixel)</div>
                            </div>
                            <InputFile label="" onChange={(input, e) => {
                                setIcon(input.files[0]);
                            }} />
                        </div>
                        <div className="inline" style={{marginTop: 20}}>
                            <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column'}}>
                                <div>Cover</div>
                                <div style={{fontSize: 12,color: '#555',marginTop: 5}}>Gambar panjang (rasio 16:9)</div>
                            </div>
                            <InputFile label="" aspectRatio="16/9" onChange={(input, e) => {
                                setCover(input.files[0]);
                            }} />
                        </div>

                        <Button height={40} style={{width: '100%',marginTop: 20}}>{addButton}</Button>
                    </form>
                </Popup>
            }
            {
                isDeleting &&
                <Popup onDismiss={() => setDeleting(false)}>
                    <div className="inline">
                        <h2 style={{margin: 0,display: 'flex',flexGrow: 1}}>Hapus Kategori</h2>
                        <Button circle color="muted" accent="secondary" onClick={() => setDeleting(false)}>
                            <BiX />
                        </Button>
                    </div>

                    <p>
                        Yakin ingin menghapus kategori {category.name}? Pelatihan yang terkait tidak akan terhapus
                    </p>

                    <Button color="red" onClick={del}>Ya, Hapus {category.name}</Button>
                </Popup>
            }
        </>
    )
}

export default Category;