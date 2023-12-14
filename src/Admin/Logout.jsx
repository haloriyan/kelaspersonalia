import axios from "axios";
import React, { useEffect, useState } from "react";
import config from "../config";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(() => {
        if (token === null) {
            let data = window.localStorage.getItem('admin_data');
            if (data !== null) {
                data = JSON.parse(data);
                setToken(data.token);
            } else {
                navigate('/admin/login');
            }
        }
    }, [token]);

    useEffect(() => {
        if (isLoading && token !== null) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/user/logout`, {
                token
            })
            .then(response => {
                let res = response.data;
                console.log(res);
                if (response.status === 200) {
                    window.localStorage.removeItem('admin_data');
                    navigate('/admin/login');
                }
            });
        }
    }, [isLoading, token])

    return (
        <>
            Logging out {token}
        </>
    )
}

export default Logout;