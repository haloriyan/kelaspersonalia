import React, { useEffect, useState } from "react";
import Header from "../../partials/Header";
import AdminMenu from "../../partials/AdminMenu";
import axios from "axios";
import config from "../../config";
import moment from "moment";
import Button from "../../components/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BiDownload } from "react-icons/bi";
import SearchBox from "../../components/SearchBox";

const Enroll = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setLoading] = useState(true);
    const [admin, setAdmin] = useState(null);
    const [datas, setDatas] = useState([]);
    const [raw, setRaw] = useState(null);
    const [page, setPage] = useState(0);
    const [q, setQ] = useState(searchParams.get('q'));

    useEffect(() => {
        document.title = `Enroll Pelatihan - ${config.appName}`
    }, [])

    useEffect(() => {
        if (admin === null) {
            setAdmin(JSON.parse(window.localStorage.getItem('admin_data')));
        }
    }, [admin]);

    useEffect(() => {
        if (isLoading && admin !== null) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/statistic/enroll?page=${page}`, {
                token: admin.token,
                q: q,
            })
            .then(response => {
                let res = response.data;
                setDatas(res.datas.data);
                setRaw(res.datas);
            })
        }
    }, [isLoading, admin]);

    return (
        <>
            <Header />
            <AdminMenu active={'enroll'} />
            <div className="content user">
                <div className="inline">
                    <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1}}>
                        <h2 style={{margin: 0}}>Enroll Pelatihan</h2>
                        <div style={{fontSize: 14,color: '#666',marginTop: 5}}>Data seluruh pendaftaran pelatihan</div>
                    </div>
                    <SearchBox q={q} setQ={setQ} />
                    <Button color="green" onClick={() => window.open(`${config.baseUrl}/export/enroll`, '_blank')}>
                        <BiDownload />
                        Download Excel
                    </Button>
                </div>
                <div style={{height: 40}}></div>
                {
                    datas.length > 0 &&
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Pelatihan</th>
                                <th>Nama Peserta</th>
                                <th>Tanggal Terdaftar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                datas.map((dat, d) => (
                                    <tr key={d}>
                                        <td>{dat.id}</td>
                                        <td>{dat.course.title}</td>
                                        <td>{dat.user.name}</td>
                                        <td>
                                            {moment(dat.created_at).format('DD MMMM Y')}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                }
            </div>
        </>
    )
}

export default Enroll;