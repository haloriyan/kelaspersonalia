import React, { useEffect, useState } from "react";
import Header from "../../partials/Header";
import AdminMenu from "../../partials/AdminMenu";
import axios from "axios";
import config from "../../config";
import moment from "moment";
import Pagination from "../../components/Pagination";

const Peserta = () => {
    const [isLoading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [raw, setRaw] = useState(null);
    const [users, setUsers] = useState([]);
    const [limit, setLimit] = useState(50);

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.get(`${config.baseUrl}/api/user?page=${page}&limit=${limit}`)
            .then(response => {
                let res = response.data;
                setRaw(res.users);
                setUsers(res.users.data);
            })
        }
    }, [isLoading]);

    return (
        <>
            <Header />
            <AdminMenu active={'peserta'} />
            <div className="content user">
                <h2 style={{margin: 0,marginBottom: 40}}>Peserta Kelas Personalia</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Terdaftar Pada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users?.map((user, u) => (
                                <tr key={u}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {moment(user.created_at).format('DD MMMM Y')}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                <Pagination 
                    next_page_url={raw?.next_page_url} 
                    prev_page_url={raw?.prev_page_url}
                    next={() => {
                        setPage(page + 1);
                        setLoading(true);
                    }}
                    prev={() => {
                        setPage(page - 1);
                        setLoading(true);
                    }}
                />
            </div>
        </>
    )
}

export default Peserta;