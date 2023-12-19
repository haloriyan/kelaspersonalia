import React, { useEffect, useState } from "react";
import HeaderPage from "../partials/HeaderPage";
import Input from "../components/Input";
import axios from "axios";
import config from "../config";
import Button from "../components/Button";

const getInitial = name => {
    let names = name.split(' ');
    let toReturn = names[0][0];
    if (names.length > 1) {
        toReturn += names[names.length - 1][0];
    }
    return toReturn.toUpperCase();
}

const Profile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');

    useEffect(() => {
        document.title = "Profil - Kelas Personalia"
    });

    useEffect(() => {
        if (user === null) {
            let u = JSON.parse(window.localStorage.getItem('user_data'));
            setUser(u);
            setName(u.name);
        }
    }, [user]);

    const submit = e => {
        axios.post(`${config.baseUrl}/api/user/update`, {
            token: user.token,
            name: name,
        })
        .then(response => {
            let res = response.data;
            setUser(res.user);
            window.localStorage.setItem('user_data', JSON.stringify(res.user));
            alert(res.message);
        })
        e.preventDefault();
    }

    if (user !== null) return (
        <>
            <HeaderPage />
            <div className="content">
                <div className="inner_content">
                    <h2 style={{margin: 0}}>Profil</h2>
                    <form action="#" className="inline" onSubmit={submit} style={{gap: 40,marginTop: 40,alignItems: 'flex-start'}}>
                        <div style={{
                            height: 80,
                            aspectRatio: 1,
                            borderRadius: 8,
                            backgroundColor: config.primaryColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: 18,
                            fontWeight: 700
                        }}>
                            {getInitial(user.name)}
                        </div>
                        <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1}}>
                            <Input label="Nama" value={name} onInput={e => setName(e.currentTarget.value)} required />
                            <div style={{fontSize: 12,color: '#666',marginTop: 10}}>
                                Nama akan muncul pada sertifikat, mohon gunakan nama asli
                            </div>

                            <div className="inline" style={{marginTop: 40}}>
                                <Button>Simpan Perubahan</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Profile;