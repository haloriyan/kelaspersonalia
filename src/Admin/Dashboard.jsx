import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import AdminMenu from "../partials/AdminMenu";
import axios from "axios";
import config from "../config";
import { Card, CardContainer } from "../components/Card";
import { BiUser } from "react-icons/bi";

const Dashboard = () => {
    const [admin, setAdmin] = useState(null);
    const [isLoading, setLoading] = useState(true);

    const [enrollCount, setEnrollCount] = useState(0);

    useEffect(() => {
        document.title = `Dashboard - ${config.appName}`
    }, [])

    useEffect(() => {
        if (admin === null) {
            setAdmin(JSON.parse(window.localStorage.getItem('admin_data')));
        }
    }, [admin]);

    useEffect(() => {
        if (isLoading && admin !== null) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/page/admin/dashboard`)
            .then(response => {
                let res = response.data;
                setEnrollCount(res.enroll_count);
            })
        }
    }, [isLoading, admin]);

    return (
        <>
            <Header />
            <AdminMenu active={'dashboard'} />
            <div className="content user">
                <CardContainer>
                    <Card label={'Pendaftaran'} number={enrollCount} link={`/admin/statistic/enroll`} icon={<BiUser />} />
                    <Card label={'Pendaftaran'} number={enrollCount} link={`/admin/statistic/enroll`} />
                    <Card label={'Pendaftaran'} number={enrollCount} link={`/admin/statistic/enroll`} />
                </CardContainer>
            </div>
        </>
    )
}

export default Dashboard;