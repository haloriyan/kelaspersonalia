import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../../../config";
import Header from "../../../partials/Header";
import AdminMenuSimple from "../../../partials/AdminMenuSimple";
import CourseMenu from "../../../partials/CourseMenu";
import InputFile from "../../../components/InputFile";
import Button from "../../../components/Button";
import styles from "../../styles/Certificate.module.css";
import Input from "../../../components/Input";

const CourseCertificate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);
    const fontFamilies = ['Times', 'Arial'];

    const [certificate, setCertificate] = useState(null);
    const [course, setCourse] = useState(null);
    const [fontProps, setFontProps] = useState(null);
    const [position, setPosition] = useState([]);

    const [cert, setCert] = useState(null);

    useEffect(() => {
        document.title = `Sertifikat - ${config.appName}`
    }, []);

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/course/${id}/certificate`)
            .then(response => {
                let res = response.data;
                setCertificate(res.certificate);
                setCourse(res.course);
                if (res.certificate !== null) {
                    setFontProps(JSON.parse(res.certificate.font_properties));
                setPosition(res.certificate.position);
                }
            })
        }
    }, [isLoading]);

    const uploadCertificate = (e) => {
        let formData = new FormData();
        formData.append('file', cert);
        formData.append('course_id', id);

        axios.post(`${config.baseUrl}/api/course/${id}/certificate/put`, formData)
        .then(response => {
            let res = response.data;
            navigate(0);
        })
        e.preventDefault();
    }

    const changeFontProps = (key, value) => {
        let fp = {...fontProps};
        fp[key] = value;
        setFontProps(fp);
    }

    const saveChanges = (e) => {
        axios.post(`${config.baseUrl}/api/course/${id}/certificate/update`, {
            position: position,
            font_properties: fontProps,
        })
        .then(response => {
            let res = response.data;
            navigate(0);
        });
        e.preventDefault();
    }

    return (
        <>
            <Header />
            <AdminMenuSimple />
            <CourseMenu active={'certificate'} course={course} />
            <div className="content organizer">
                {
                    certificate === null ?
                    <form action="#" onSubmit={uploadCertificate}>
                        <InputFile onChange={(input, e)=> setCert(input.files[0])} size={250} aspectRatio="16/9" />
                        <div style={{display: 'flex',justifyContent: 'flex-start'}}>
                            <Button>Upload Template</Button>
                        </div>
                    </form>
                    :
                    <div className={styles.Area}>
                        <div className={styles.Left}>
                            <iframe src={`${config.baseUrl}/export/certificate/${id}/preview#toolbar=0`} width={'100%'} frameborder="0" style={{
                                aspectRatio: 1.414/1
                            }}></iframe>
                            {/* <div className={styles.TemplateContainer}>
                                <div className={styles.TemplateName} style={{
                                    top: `${position}%`,
                                    fontFamily: fontProps.fontFamily,
                                    fontSize: `${fontProps.fontSize}%`,
                                    fontWeight: fontProps.fontWeight,
                                    textAlign: 'center'
                                }}>{namex}</div>
                                <img 
                                    src={`${config.baseUrl}/storage/certificate_templates/${certificate.filename}`} 
                                    alt="Certificate Template" 
                                    className={styles.TemplateImage}
                                />
                            </div> */}

                            <div style={{marginTop: 20,textAlign: 'right',fontSize: 12,cursor: 'pointer'}} onClick={() => setCertificate(null)}>
                                Ganti Template
                            </div>

                        </div>
                        <form onSubmit={saveChanges} style={{display: 'flex',flexDirection: 'column',flexGrow: 1}}>
                            <div style={{fontSize: 18,fontWeight: 700,color: '#888',marginBottom: 10}}>Font Style</div>
                            <div className="inline">
                                <select name="family" id="family" required defaultValue={fontProps.fontFamily} onChange={e => changeFontProps('fontFamily', e.currentTarget.value)}>
                                    <option value="">Pilih Font Family...</option>
                                    {
                                        fontFamilies.map((fam, f) => (
                                            <option key={f} value={fam}>{fam}</option>
                                        ))
                                    }
                                </select>
                                <Input label="Font Size :" value={fontProps.fontSize} onInput={e => changeFontProps('fontSize', e.currentTarget.value)} required />
                                <Input label="Font Weight" value={fontProps.fontWeight} onInput={e => changeFontProps('fontWeight', e.currentTarget.value)} required />
                            </div>

                            <Input label="Posisi Nama" value={position} onInput={e => setPosition(e.currentTarget.value)} required />

                            <Button style={{marginTop: 20}} onClick={saveChanges}>
                                Simpan Perubahan
                            </Button>
                        </form>
                    </div>
                }
            </div>
        </>
    )
}

export default CourseCertificate;