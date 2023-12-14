import React from "react";
import styles from "./styles/Footer.module.css";

const Footer = () => {
    return (
        <div className={styles.Footer}>
            <div className={styles.Info}>
                <img src="/logo.jpg" alt="Logo on Footer" className={styles.Logo} />
                <div className={styles.InfoDescription}>
                    PT. Kelas Personalia Indonesia adalah Lembaga Pelatihan Kerja Swasta berbasis online yang memberikan pendidikan Ilmu Manajemen dan Perbankan yang dipandu oleh pengajar dari universitas terkemuka dan bersertifikasi kompetensi nasional dan internasional
                </div>
            </div>
            <div className={styles.Section}>
                <div className={styles.Title}>Laman</div>
                <div className={styles.LinkArea}>
                    <a href="#" className={styles.Link}>Tentang</a>
                    <a href="#" className={styles.Link}>Kebijakan</a>
                    <a href="#" className={styles.Link}>Hubungi</a>
                </div>
            </div>
        </div>
    )
}

export default Footer;