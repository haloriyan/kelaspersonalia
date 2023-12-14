import React from "react";
import styles from "./styles/Error.module.css";
import HeaderPage from "../partials/HeaderPage";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";

const Error = () => {
    const { code } = useParams();
    const navigate = useNavigate();

    const theErrors = {
        404: {
            title: "Tidak Dapat Menemukan",
            description: "Maaf, kami tidak dapat menemukan yang Anda cari",
            action:  (
                <Button onClick={() => navigate('/')}>Kembali ke Home</Button>
            )
        },
        401: {
            title: "Tidak Dapat Mengautentikasi",
            description: "Maaf, Anda tidak dapat membuka laman yang Anda tuju",
            action:  (
                <Button onClick={() => navigate('/')}>Kembali ke Home</Button>
            )
        }
    }

    return (
        <>
            <HeaderPage />
            <div className={styles.Content}>
                <div className={styles.Code}>{code}</div>
                <div className={styles.Title}>{theErrors[code].title}</div>
                <div className={styles.Description}>{theErrors[code].description}</div>
                {theErrors[code].action}
            </div>
        </>
    )
}

export default Error;