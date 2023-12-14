import axios from "axios";
import React, { useEffect, useState } from "react";
import config from "../config";
import Header from "../partials/Header";
import AdminMenu from "../partials/AdminMenu";
import Button from "../components/Button";
import { BiHide, BiPlus, BiShow, BiX } from "react-icons/bi";
import Popup from "../components/Popup";
import Input from "../components/Input";
import Alert from "../components/Alert";

const Peserta = () => {
    const [isLoading, setLoading] = useState(true);
    const [pesertas, setPesertas] = useState([]);
    const [peserta, setPeserta] = useState(null);
    const [grups, setGrups] = useState([]);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [grupID, setGrupID] = useState(null);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);

    const [isAdding, setAdding] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const [isDeleting, setDeleting] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/peserta`)
            .then(response => {
                let res = response.data;
                setPesertas(res.pesertas);
                setGrups(res.grups);
            })
        }
    }, [isLoading])

    const resetForm = () => {
        setLoading(true);
        setName('');
        setUsername('');
        setPassword('');
    }

    const submit = (e) => {
        e.preventDefault()
        axios.post(`${config.baseUrl}/api/peserta/create`, {
            name, username, password,
            grup_id: grupID
        })
        .then(response => {
            let res = response.data;
            if (response.status === 200) {
                resetForm();
                setAdding(false);
                setMessage(res.message);
            } else {
                setErrorMessage(res.message);
            }
        })
    }
    const update = (e) => {
        e.preventDefault()
        axios.post(`${config.baseUrl}/api/peserta/update`, {
            name, username, password,
            grup_id: grupID,
            id: peserta.id,
        })
        .then(response => {
            let res = response.data;
            if (response.status === 200) {
                resetForm();
                setEditing(false);
                setMessage(res.message);
            } else {
                setErrorMessage(res.message);
            }
        })
    }
    const doDelete = () => {
        axios.post(`${config.baseUrl}/api/peserta/delete`, {
            id: peserta.id,
        })
        .then(response => {
            let res = response.data;
            if (response.status === 200) {
                resetForm();
                setDeleting(false);
                setMessage(res.message);
            } else {
                setErrorMessage(res.message);
            }
        })
    }
    
    return (
        <>
            <Header />
            <AdminMenu active={'peserta'} />
            <div className="content user">
                <div className="inline">
                    <h1 style={{display: 'flex',flexGrow: 1}}>Peserta</h1>
                    <Button style={{width: 'auto'}} onClick={() => setAdding(true)}>
                        <BiPlus /> Peserta Baru
                    </Button>
                </div>
                {
                    errorMessage !== "" &&
                    <Alert message={errorMessage} setMessage={setErrorMessage} status={400} />
                }
                {
                    message !== "" &&
                    <Alert message={message} setMessage={setMessage} status={200} />
                }
                <table style={{marginTop: 20}}>
                    <thead>
                        <tr>
                            <th>Grup</th>
                            <th>Nama</th>
                            <th>Username</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pesertas.map((psrt, p) => (
                                <tr key={p}>
                                    <td>{psrt.grup_id === null ? '-' : psrt.grup.name}</td>
                                    <td>{psrt.name}</td>
                                    <td>{psrt.username}</td>
                                    <td style={{display: 'flex',flexDirection: 'row',gap: 20}}>
                                        <Button height={40} color="green" onClick={() => {
                                            setPeserta(psrt);
                                            setName(psrt.name);
                                            setUsername(psrt.username);
                                            setGrupID(psrt.grup_id);
                                            setPassword('');
                                            setEditing(true);
                                        }}>Edit</Button>
                                        <Button height={40} color="red" onClick={() => {
                                            setPeserta(psrt);
                                            setDeleting(true);
                                        }}>Hapus</Button>
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
                        <h3 style={{margin: 0,display: 'flex',flexGrow: 1}}>Tambah Peserta Baru</h3>
                        <Button circle={true} style={{width: 'auto'}} accent="secondary" color="muted" onClick={() => setAdding(false)}>
                            <BiX />
                        </Button>
                    </div>

                    <form action="#" style={{display: 'flex',flexDirection: 'column',gap: 20}} onSubmit={submit}>
                        <div style={{fontSize: 12,color: '#888',marginBottom: -10}}>Grup Peserta</div>
                        <select name="grup_id" id="grup_id" onChange={e => setGrupID(e.currentTarget.value)}>
                            <option value="">Tidak ada grup</option>
                            {
                                grups.map((gr, g) => (
                                    <option key={g} value={gr.id}>{gr.name}</option>
                                ))
                            }
                        </select>
                        <Input label="Nama Peserta" value={name} onInput={e => setName(e.currentTarget.value)} />
                        <Input label="Username" value={username} onInput={e => setUsername(e.currentTarget.value)} />
                        <Input label="Password" value={password} onInput={e => setPassword(e.currentTarget.value)} type={hidePassword ? 'password' : 'text'} right={
                            <div style={{cursor: 'pointer'}} onClick={() => setHidePassword(!hidePassword)}>
                                {hidePassword ? <BiShow /> : <BiHide />}
                            </div>
                        } />
                        <Button>Tambahkan Peserta</Button>
                    </form>
                </Popup>
            }
            {
                isEditing &&
                <Popup onDismiss={() => setEditing(false)}>
                    <div className="inline" style={{marginBottom: 20}}>
                        <h3 style={{margin: 0,display: 'flex',flexGrow: 1}}>Edit Peserta</h3>
                        <Button circle={true} style={{width: 'auto'}} accent="secondary" color="muted" onClick={() => setEditing(false)}>
                            <BiX />
                        </Button>
                    </div>

                    <form action="#" style={{display: 'flex',flexDirection: 'column',gap: 20}} onSubmit={update}>
                        <div style={{fontSize: 12,color: '#888',marginBottom: -10}}>Grup Peserta</div>
                        <select name="grup_id" id="grup_id" onChange={e => setGrupID(e.currentTarget.value)}>
                            <option value="">Tidak ada grup</option>
                            {
                                grups.map((gr, g) => (
                                    <option key={g} value={gr.id} selected={gr.id === peserta.grup_id ? 'selected' : ''}>{gr.name}</option>
                                ))
                            }
                        </select>
                        <Input label="Nama Peserta" value={name} onInput={e => setName(e.currentTarget.value)} />
                        <Input label="Username" value={username} onInput={e => setUsername(e.currentTarget.value)} />
                        <Input label="Ubah Password" value={password} onInput={e => setPassword(e.currentTarget.value)} type={hidePassword ? 'password' : 'text'} right={
                            <div style={{cursor: 'pointer'}} onClick={() => setHidePassword(!hidePassword)}>
                                {hidePassword ? <BiShow /> : <BiHide />}
                            </div>
                        } required={false} />
                        <div style={{fontSize: 12,color: '#888',marginTop: -10}}>Biarkan kosong jika tidak ingin mengganti password</div>
                        <Button>Simpan Perubahan</Button>
                    </form>
                </Popup>
            }
            {
                isDeleting &&
                <Popup onDismiss={() => setDeleting(false)}>
                    <div className="inline" style={{marginBottom: 20}}>
                        <h3 style={{margin: 0,display: 'flex',flexGrow: 1}}>Hapus Peserta</h3>
                        <Button circle={true} style={{width: 'auto'}} accent="secondary" color="muted" onClick={() => setDeleting(false)}>
                            <BiX />
                        </Button>
                    </div>

                    <form action="#" onSubmit={doDelete}>
                        <div>Yakin ingin menghapus peserta {peserta.name}? Semua data terkait akan terhapus dan tidak bisa dikembalikan.</div>
                        <Button color="red" style={{marginTop: 20}}>Ya, hapus peserta</Button>
                    </form>
                </Popup>
            }
        </>
    )
}

export default Peserta;