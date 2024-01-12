import axios from "axios";
import React, { useEffect, useState } from "react";

const useLocation = () => {
    const [locationState, setLocationState] = useState({
        latitude: '',
        longitude: '',
        address: '',
        permission: null,
    });
    
    const [perm, setPerm] = useState(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (locationState.permission === null) {
            navigator.permissions.query({ name: "geolocation" })
            .then(result => {
                if (result.state === "granted" || result.state === "prompt") {
                    navigator.geolocation.getCurrentPosition(position => {
                        let pos = position.coords;
                        setLocationState({
                            latitude: pos.latitude,
                            longitude: pos.longitude,
                            address: '',
                            permission: 'granted'
                        });
                        setLoading(true);
                    })
                } else if (result.state === "denied") {
                    setLocationState({
                        latitude: '',
                        longitude: '',
                        address: '',
                        permission: 'denied',
                    })
                }
            })
        }
    }, [locationState]);

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${locationState.latitude}&longitude=${locationState.longitude}`)
            .then(response => {
                let res = response.data;
                let infos = res.localityInfo.administrative;
                let theInfos = [];

                infos = infos.splice(0, 4);
                infos = infos.reverse();
                infos.map(info => {
                    theInfos.push(info.name);
                })
                
                let st = {...locationState};
                st['address'] = theInfos.join(', ');
                setLocationState(st);
            });
        }
    }, [isLoading])

    return locationState
}

export default useLocation;