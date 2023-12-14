import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserMiddleware = ({children}) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (user === null) {
            let myData = JSON.parse(window.localStorage.getItem('user_data'));
            if (myData === null) {
                navigate('/login');
            } else {
                setUser(myData)
            }
        }
    }, [user]);

    if (user !== null) {
        return children;
    }
}

export default UserMiddleware;