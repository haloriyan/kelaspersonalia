import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import axios from "axios";
import config from "../config";
import AdminMenu from "../partials/AdminMenu";
import Button from "../components/Button";
import { BiShow, BiTrash, BiX } from "react-icons/bi";
import Popup from "../components/Popup";

const ContactMessage = () => {
    const [isLoading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [raw, setRaw] = useState(null);

    const [message, setMessage] = useState(null);
    const [isDeleting, setDeleting] = useState(false);
    const [isViewing, setViewing] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.get(`${config.baseUrl}/api/contact`)
            .then(response => {
                let res = response.data;
                setRaw(res.messages);
                setMessages(res.messages.data);
            })
        }
    }, [isLoading]);

    const doDelete = () => {
        axios.post(`${config.baseUrl}/api/contact/delete`, {
            id: message.id,
        })
        .then(response => {
            let res = response.data;
            setLoading(true);
            setDeleting(false);
        })
    }

    return (
        <>
            <Header active={'contact-message'} />
            <AdminMenu />
            <div className="content user">
                <h2 style={{marginBottom: 10}}>Pesan Kontak</h2>
                <div style={{fontSize: 12,color: '#666'}}>Pesan yang masuk melalui halaman Hubungi Kami</div>

                <div style={{height: 40}}></div>

                <table>
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Email</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            messages?.map((msg, m) => (
                                <tr key={m}>
                                    <td>{msg.name}</td>
                                    <td>{msg.email}</td>
                                    <td style={{display: 'flex',gap: 10}}>
                                        <Button height={36} onClick={() => {
                                            setMessage(msg);
                                            setViewing(true);
                                        }}>
                                            <BiShow size={20} />
                                        </Button>
                                        <Button height={36} color="red" onClick={() => {
                                            setMessage(msg);
                                            setDeleting(true);
                                        }}>
                                            <BiTrash size={20} />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {
                isViewing &&
                <Popup onDismiss={() => setViewing(false)}>
                    <div className="inline">
                        <h4 style={{margin: 0,display: 'flex',flexGrow: 1}}>Pesan Kontak dari {message.name}</h4>
                        <Button circle color="muted" accent="secondary" onClick={() => setViewing(false)}>
                            <BiX />
                        </Button>
                    </div>

                    <div className="inline" style={{marginTop: 20}}>
                        <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column',gap: 5}}>
                            <div style={{fontSize: 12,color: '#666'}}>Nama</div>
                            <div>{message.name}</div>
                        </div>
                        <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column',gap: 5}}>
                            <div style={{fontSize: 12,color: '#666'}}>Email</div>
                            <div>{message.email}</div>
                        </div>
                    </div>

                    <div style={{fontSize: 12,color: '#666',marginTop: 20,marginBottom: 5}}>Isi Pesan</div>
                    <pre style={{margin: 0}}>{message.body}</pre>
                </Popup>
            }
            {
                isDeleting &&
                <Popup onDismiss={() => setDeleting(false)}>
                    <div className="inline">
                        <h4 style={{margin: 0,display: 'flex',flexGrow: 1}}>Hapus Pesan</h4>
                        <Button circle color="muted" accent="secondary" onClick={() => setDeleting(false)}>
                            <BiX />
                        </Button>
                    </div>

                    <div>Yakin ingin menghapus pesan dari {message.name}?</div>

                    <Button color="red" style={{width: '100%',marginTop: 20}} onClick={doDelete}>Ya, Hapus Pesannya</Button>
                    <Button color="muted" accent="secondary" style={{width: '100%',marginTop: 10}} onClick={() => setDeleting(false)}>batalkan</Button>
                </Popup>
            }
        </>
    )
}

export default ContactMessage;