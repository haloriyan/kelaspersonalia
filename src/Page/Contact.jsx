import React, { useEffect, useState } from "react";
import HeaderPage from "../partials/HeaderPage";
import Footer from "../partials/Footer";
import styles from "./styles/Page.module.css";
import Input from "../components/Input";
import Button from "../components/Button";
import axios from "axios";
import config from "../config";
import Alert from "../components/Alert";

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [body, setBody] = useState('');
    const [message, setMessage] = useState(null);

    useEffect(() => {
        document.title = `Hubungi Kami - ${config.appName}`
    })

    const submit = e => {
        e.preventDefault();
        axios.post(`${config.baseUrl}/api/contact`, {
            name, email, body
        })
        .then(response => {
            setMessage(response.data.message);
        })
    }

    return (
        <>
            <HeaderPage />
            <div className="content">
                <div className="inner_content">
                    <h2 className={styles.Title}>Hubungi Kami</h2>
                    <div className={styles.Body}>Apabila terdapat kendala atau pertanyaan Anda dapat menyampaikan pada channel sosial media kami atau mengisi formulir berikut</div>
                    <form action="#" onSubmit={submit}>
                        <Input label="Nama Anda" value={name} onInput={e => setName(e.currentTarget.value)} required />
                        <Input label="Alamat Email" value={email} onInput={e => setEmail(e.currentTarget.value)} required />
                        <Input label="Pesan" value={body} onInput={e => setBody(e.currentTarget.value)} required multiline />

                        {
                            message !== null &&
                            <Alert message={message} setMessage={setMessage} status={200} duration={5500} />
                        }

                        <div className="inline">
                            <Button>Kirim</Button>
                        </div>
                    </form>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Contact;