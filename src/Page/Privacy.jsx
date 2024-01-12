import React, { useEffect } from "react";
import HeaderPage from "../partials/HeaderPage";
import Footer from "../partials/Footer";
import styles from "./styles/Page.module.css";
import config from "../config";

const Privacy = () => {
    useEffect(() => {
        document.title = `Kebijakan Privasi - ${config.appName}`
    })

    return (
        <>
            <HeaderPage />
            <div className="content">
                <div className="inner_content">
                    <h2 className={styles.Title}>Kebijakan Privasi</h2>
                    <div className={styles.Body}>
                        Halaman Kebijakan Privasi ini menjelaskan tentang bagaimana Kami mendapatkan, menggunakan, dan menjaga informasi yang pengguna berikan baik melalui aplikasi maupun layanan pihak ketiga.
                    </div>

                    <div style={{height: 40}}></div>

                    <h3 className={styles.SubTitle}>1. Informasi yang Kami Dapatkan</h3>
                    <div className={styles.Body}>
                        Ketika pengguna mendaftar, menggunakan, dan/atau mengautentikasi layanan pihak ketiga, Kami bisa mendapatkan beberapa data pribadi seperti :
                    </div>
                    <div className={styles.Body}>
                        <span className={styles.Bold}>1.1. Informasi Dasar</span>. Kami berhak mengakses dan menyimpan informasi dasar yang terhubung dengan akun layanan pihak ketiga pengguna seperti (namun tidak terbatas pada) nama dan alamat email.
                    </div>
                    <div className={styles.Body}>
                        <span className={styles.Bold}>1.2. Izin Akses</span>. Kami akan meminta akses spesifik untuk mengakses beberapa data dan layanan dari pihak ketiga.
                    </div>
                    
                    <div style={{height: 40}}></div>

                    <h3 className={styles.SubTitle}>2. Bagaimana Kami Menggunakan Informasi Pengguna</h3>
                    <div className={styles.Body}>Kami akan menggunakan informasi pengguna untuk berbagai layanan pihak ketiga seperti :</div>
                    <div className={styles.Body}>
                        <span className={styles.Bold}>2.1. Akses Layanan Pihak Ketiga</span>. Untuk mengakses dan memproses layanan spesifik yang disediakan oleh pihak ketiga yang telah pengguna izinkan.
                    </div>
                    <div className={styles.Body}>
                        <span className={styles.Bold}>2.2. Komunikasi</span>. Mengirim dan menerima informasi yang terkait dengan akses layanan takotoko dan/atau pihak ketiga
                    </div>
                    
                    <div style={{height: 40}}></div>

                    <h3 className={styles.SubTitle}>3. Pengelolaan dan Pembagian Informasi</h3>
                    <div className={styles.Body}>Kami tidak menjual, menukarkan, atau membagikan data ke pihak manapun di luar kondisi berikut :</div>
                    <div className={styles.Body}>
                        <span className={styles.Bold}>3.1. Penyedia Layanan Tambahan</span>. Kami mungkin membagikan data pengguna kepada pihak ketiga yang hanya untuk kelancaran proses bisnis dan/atau aplikasi
                    </div>
                    <div className={styles.Body}>
                        <span className={styles.Bold}>3.2. Kewajiban Hukum</span>. Kami juga mungkin akan membagikan data pengguna kepada pihak berwenang atau hukum yang berlaku
                    </div>

                    <div style={{height: 40}}></div>

                    <h3 className={styles.SubTitle}>4. Keamanan Data</h3>
                    <div className={styles.Body}>Kami telah mengimplementasikan dan menguji secara teknis dan terorganisir untuk melindungi data pribadi pengguna. Meskipun demikian tidak ada transaksi online yang sepenuhnya aman dan kami tidak menjamin secara absolut terhadap keamanan data pengguna.</div>
                    
                    <div style={{height: 40}}></div>

                    <h3 className={styles.SubTitle}>5. Hak-hak Pengguna</h3>
                    <div className={styles.Body}>Pengguna dapat mengubah maupun menghapus data yang kami simpan kapan saja dan mungkin ada beberapa data yang memerlukan permintaan khusus untuk melakukan perubahan atau penghapusan.</div>

                    <div style={{height: 40}}></div>

                    <h3 className={styles.SubTitle}>6. Perubahan pada Kebijakan Privasi</h3>
                    <div className={styles.Body}>Kami mungkin dan berhak untuk mengubah sebagian atau seluruh kebijakan privasi Kami kapan saja. Kami akan memberitahukan kepada seluruh pengguna beberapa waktu sebelum perubahan tersebut efektif.</div>

                    <div style={{height: 40}}></div>

                    <h3 className={styles.SubTitle}>7. Hubungi Kami</h3>
                    <div className={styles.Body}>Apabila terdapat pertanyaan lebih lanjut pengguna dapat mengirimkan pesan melalui halaman <a href="/hubungi-kami">Hubungi Kami</a></div>
                </div>

                <Footer />
            </div>
        </>
    )
}

export default Privacy;