import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from "../../../config";
import Header from "../../../partials/Header";
import AdminMenuSimple from "../../../partials/AdminMenuSimple";
import CourseMenu from "../../../partials/CourseMenu";
import Button from "../../../components/Button";
import Popup from "../../../components/Popup";
import { BiX } from "react-icons/bi";
import Input from "../../../components/Input";
import InputFile from "../../../components/InputFile";
import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";

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
        formData.append('title', title);
        formData.append('description', description);

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
                            <InputFile aspectRatio="5/2" size={120} labelStyle={{fontSize: 12}} />
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
                                    />
                                </InputContainer>
                            </div>
                        </div>

                        <Button>Submit</Button>
                    </form>
                </Popup>
            }
        </>
    )
}

export default CourseEvent;