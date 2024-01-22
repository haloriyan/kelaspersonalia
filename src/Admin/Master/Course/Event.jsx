import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from "../../../config";
import Header from "../../../partials/Header";
import AdminMenuSimple from "../../../partials/AdminMenuSimple";
import CourseMenu from "../../../partials/CourseMenu";
import Button from "../../../components/Button";
import Popup from "../../../components/Popup";
import { BiCalendar, BiX } from "react-icons/bi";
import Input from "../../../components/Input";
import InputFile from "../../../components/InputFile";
import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import Switch from "../../../components/Switch";
import styles from "../../styles/Course.module.css";
import Substring from "../../../components/Substring";

const inputStyles = Input({exportStyles: true});
const InputContainer = ({children}) => {
    return (
        <div className={inputStyles.styles.Wrapper}>
            <div className={inputStyles.styles.Area}>
                {children}
            </div>
            {inputStyles.bottomLine}
        </div>
    )
}

const CourseEvent = () => {
    const { id } = useParams();
    const [isLoading, setLoading] = useState(true);

    const [events, setEvents] = useState([]);
    const [course, setCourse] = useState(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cover, setCover] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [joinRule, setJoinRule] = useState('private');
    const [streamURL, setStreamURL] = useState('');

    const [isAdding, setAdding] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/course/${id}/event`)
            .then(response => {
                let res = response.data;
                setEvents(res.events);
                setCourse(res.course);
            })
        }
    }, [isLoading]);

    const submit = e => {
        let formData = new FormData();
        formData.append('course_id', id);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('cover', cover);
        formData.append('start_time', moment(startTime).format('HH:mm'));
        formData.append('end_time', moment(endTime).format('HH:mm'));
        formData.append('start_date', moment(startDate).format('Y-MM-DD'));
        formData.append('end_date', moment(startDate).format('Y-MM-DD'));

        axios.post(`${config.baseUrl}/api/course/${id}/event/create`, formData)
        .then(response => {
            let res = response.data;
            setLoading(true);
            setAdding(false);
            setTitle('');
            setDescription('');
        })
        e.preventDefault();
    }

    return (
        <>
            <Header />
            <AdminMenuSimple />
            <CourseMenu active={'event'} course={course} />
            <div className="content organizer">
                <div className="inline">
                    <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1}}>
                        <h2 style={{margin: 0}}>Event / Webinar</h2>
                        <div style={{fontSize: 14,color: '#666',marginTop: 5}}>Event / webinar yang terkait dengan pelatihan {course?.title}</div>
                    </div>
                    <Button accent="secondary" onClick={() => setAdding(true)}>
                        Tambah
                    </Button>
                </div>

                <div className={styles.ListContainer} style={{marginTop: 20}}>
                    {
                        events.map((evt, e) => (
                            <a href={`event/${evt.id}`} className={styles.ListItem} key={e}>
                                <img src={`${config.baseUrl}/storage/event_covers/${evt.cover}`} alt={evt.title} className={styles.CourseCover} />
                                <div className={styles.CourseTitle}>{Substring(evt.title, 8, true)}</div>
                                <div className="inline" style={{marginTop: 10,fontSize: 12,color: '#666',gap: 10}}>
                                    <BiCalendar />
                                    {moment(evt.start_date).format('DD MMM Y')}
                                </div>
                            </a>
                        ))
                    }
                </div>
            </div>

            {
                isAdding &&
                <Popup onDismiss={() => setAdding(false)}>
                    <div className="inline">
                        <h4 style={{display: 'flex',flexGrow: 1,margin: 0}}>Buat Event Baru</h4>
                        <Button circle accent="secondary" color="muted" onClick={() => setAdding(false)}>
                            <BiX size={20} />
                        </Button>
                    </div>

                    <form action="#" onSubmit={submit} style={{marginTop: 20}}>
                        <div className="inline">
                            <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1}}>
                                <div>Cover</div>
                                <div style={{fontSize: 12, color: '#666',marginTop: 5}}>Gambar utama yang ditampilkan</div>
                            </div>
                            <InputFile aspectRatio="5/2" size={120} labelStyle={{fontSize: 12}} onChange={(inp, e) => {
                                setCover(inp.files[0]);
                            }} />
                        </div>
                        <Input label="Judul Webinar" value={title} onInput={e => setTitle(e.currentTarget.value)} required />
                        <Input label="Deskripsi" value={description} onInput={e => setDescription(e.currentTarget.value)} required multiline />

                        <div style={{fontSize: 12,color: '#666'}}>Tanggal :</div>
                        <InputContainer>
                            <Flatpickr
                                style={{height: 40}}
                                defaultValue={startDate}
                                options={{
                                    enableTime: false,
                                }}
                                onChange={([date]) => {
                                    let dt = moment(date);
                                    setStartDate(dt.format('Y-MM-DD'));
                                }}
                            />
                        </InputContainer>

                        <div className="inline">
                            <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1}}>
                                <div style={{fontSize: 12,color: '#666'}}>Waktu Mulai :</div>
                                <InputContainer>
                                    <Flatpickr
                                        style={{height: 40}}
                                        value={startTime}
                                        options={{
                                            enableTime: true,
                                            noCalendar: true,
                                            dateFormat: 'H:i'
                                        }}
                                        onChange={([date]) => {
                                            let dt = moment(date);
                                            setStartTime(dt.format('HH:mm'));
                                        }}
                                    />
                                </InputContainer>
                            </div>
                            <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1}}>
                                <div style={{fontSize: 12,color: '#666'}}>Waktu Berakhir :</div>
                                <InputContainer>
                                    <Flatpickr
                                        style={{height: 40}}
                                        value={endTime}
                                        options={{
                                            enableTime: true,
                                            noCalendar: true,
                                            dateFormat: 'H:i',
                                            minTime: startTime
                                        }}
                                        onChange={([date]) => {
                                            let dt = moment(date);
                                            setEndTime(dt.format('HH:mm'));
                                        }}
                                    />
                                </InputContainer>
                            </div>
                        </div>

                        <Input label="Stream URL" value={streamURL} onInput={e => setStreamURL(e.currentTarget.value)} />

                        <div className="inline">
                            <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column',gap: 5}}>
                                <div style={{fontSize: 16,color: '#232323',fontWeight: '700'}}>Event Publik</div>
                                <div style={{fontSize: 12,color: '#666'}}>Izinkan semua orang dapat mengikuti event ini meskipun tidak tergabung pada kelas</div>
                            </div>
                            <Switch active={joinRule === 'public'} onChange={() => setJoinRule(joinRule === 'public' ? 'private' : 'public')} />
                        </div>

                        <Button>Submit</Button>
                    </form>
                </Popup>
            }
        </>
    )
}

export default CourseEvent;