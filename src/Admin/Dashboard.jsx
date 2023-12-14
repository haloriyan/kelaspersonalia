import React from "react";
import Header from "../partials/Header";
import AdminMenu from "../partials/AdminMenu";

const Dashboard = () => {
    return (
        <>
            <Header />
            <AdminMenu active={'dashboard'} />
            Dashboard
        </>
    )
}

export default Dashboard;