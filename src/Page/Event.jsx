import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from "../config";
import HeaderPage from "../partials/HeaderPage";
import styles from "./styles/Event.module.css";
import { BiCalendar, BiChalkboard, BiGroup } from "react-icons/bi";
import moment from "moment";
import Button from "../components/Button";
import Footer from "../partials/Footer";
import useUser from "../Hooks/useUser";

const Event = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [user, setUser] = useUser(false);
    const [ableToJoin, setAbleToJoin] = useState(false);
    const [isLoading, setLoading] = useState(true);

    const [pageTitle, setPageTitle] = useState(`Event - ${config.appName}`);

    useEffect(() => {
        document.title = pageTitle;
    }, [pageTitle]);

    useEffect(() => {
        if (isLoading && user !== null) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/page/event`, {
                id,
                token: user.token,
            })
            .then(response => {
                let res = response.data;
                setEvent(res.event);
                setAbleToJoin(res.able_to_join);
                setPageTitle(`${res.event.title} - ${config.appName}`)
            })
        }
    }, [isLoading, user]);

    const join = () => {
        axios.post(`${config.baseUrl}/api/course/${event.course_id}/event/join`, {
            token: user.token,
            event_id: id,
        })
        .then(response => {
            let res = response.data;
            window.open(event.stream_url, '_blank');
        })
    }

    return (
        <>
            <HeaderPage />
            <div className="content">
                <div className={styles.CoverContainer}>
                    <img src={`${config.baseUrl}/storage/event_covers/${event?.cover}`} alt={event?.title} className={styles.CoverImage} />
                    <div className={styles.CoverContent}>
                        <div className={styles.CoverTitle}>{event?.title}</div>
                        <div className={styles.CoverInfoContainer}>
                            <div className={`inline ${styles.CoverInfo}`}>
                                <BiCalendar />
                                {moment(event?.start_date).format('DD MMM Y')}
                            </div>
                            <div className={`inline ${styles.CoverInfo}`}>
                                <BiGroup />
                                {event?.users.length} Peserta
                            </div>
                            <div className={`inline ${styles.CoverInfo}`}>
                                <BiChalkboard />
                                {event?.course.title}
                            </div>
                        </div>
                        {
                            ableToJoin &&
                            <Button onClick={() => {
                                join()
                            }}>Gabung Event</Button>
                        }
                    </div>
                </div>

                <div className={`inner_content ${styles.DescriptionSection}`}>
                    <div style={{fontSize: 12,color: '#666'}}>DESKRIPSI</div>
                    <pre>{event?.description}</pre>
                </div>

                <Footer />
            </div>
        </>
    )
}

export default Event;