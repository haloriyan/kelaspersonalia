import React from "react";
import HeaderPage from "../partials/HeaderPage";
import Footer from "../partials/Footer";

const About = () => {
    return (
        <>
            <HeaderPage />
            <div className="content">
                <div className="inner_content">
                    <div className="inline">
                        <img src="/logo-removebg.png" alt="Icon Personalia" />
                        <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column'}}>
                            <h2>Tentang Kami</h2>
                            <p>
                                PT. Kelas Personalia Indonesia adalah Lembaga Pelatihan Kerja Swasta berbasis online yang memberikan pendidikan Ilmu Manajemen dan Perbankan yang dipandu oleh pengajar dari universitas terkemuka dan bersertifikasi kompetensi nasional dan internasional
                            </p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default About;