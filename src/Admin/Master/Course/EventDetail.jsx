import React, { useEffect, useState } from "react";
import Header from "../../../partials/Header";
import AdminMenuSimple from "../../../partials/AdminMenuSimple";
import CourseMenu from "../../../partials/CourseMenu";
import axios from "axios";
import config from "../../../config";
import { useParams } from "react-router-dom";
import Toggler from "../../../components/Toggler";
import { MdWest } from "react-icons/md";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import Switch from "../../../components/Switch";
import { BiCheck, BiX } from "react-icons/bi";

const EventDetail = () => {
    const { id, eventID } = useParams();
    const [course, setCourse] = useState(null);
    const [event, setEvent] = useState(null);
    const [viewing, setViewing] = useState('Overview');
    const [isLoading, setLoading] = useState(true);
    const [isEditing, setEditing] = useState(false);

    const [updateText, setUpdateText] = useState('Simpan Perubahan');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [cover, setCover] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [joinRule, setJoinRule] = useState('private');
    const [streamURL, setStreamURL] = useState('');

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/course/${id}/event/${eventID}`, {
                with: ['course', 'users.user']
            })
            .then(response => {
                let res = response.data;
                let evt = res.event;
                setEvent(res.event);
                setCourse(res.event.course);

                setTitle(evt.title);
                setDescription(evt.description);
                setJoinRule(evt.join_rule);
                setStreamURL(evt.stream_url);
            })
        }
    }, [isLoading]);

    const update = e => {
        let formData = new FormData();
        formData.append('id', eventID);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('join_rule', joinRule);
        formData.append('stream_url', streamURL);

        setUpdateText('Menyimpan...');

        axios.post(`${config.baseUrl}/api/course/${id}/event/update`, formData)
        .then(response => {
            let res = response.data;
            setLoading(true);
            setEvent(null);
            setEditing(false);
            setUpdateText('Simpan Perubahan');
        })

        e.preventDefault();
    }

    return (
        <>
            <Header />
            <AdminMenuSimple />
            <CourseMenu active={'event'} course={course} />
            {
                event !== null &&
                <div className="content organizer">
                <div className="inline" style={{marginBottom: 20,marginTop: 20,fontSize: 24}}>
                    <a href={`/admin/master/course/${id}/event`}>
                        <MdWest />
                    </a>
                    {event.title}
                </div>

                <Toggler value={viewing} setValue={setViewing} options={['Overview', 'Peserta']} />
                <div style={{height: 40}}></div>

                {
                    viewing === 'Overview' &&
                    <>
                    {
                        isEditing ?
                            <form onSubmit={update}>
                                <Input label="Judul Webinar" value={title} onInput={e => setTitle(e.currentTarget.value)} required />
                                <Input label="Deskripsi" value={description} onInput={e => setDescription(e.currentTarget.value)} multiline required />
                                <Input label="Stream URL" value={streamURL} onInput={e => setStreamURL(e.currentTarget.value)} required />

                                <div className="inline">
                                    <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column',gap: 5}}>
                                        <div style={{fontSize: 16,color: '#232323',fontWeight: '700'}}>Event Publik</div>
                                        <div style={{fontSize: 12,color: '#666'}}>Izinkan semua orang dapat mengikuti event ini meskipun tidak tergabung pada kelas</div>
                                    </div>
                                    <Switch active={joinRule === 'public'} onChange={() => setJoinRule(joinRule === 'public' ? 'private' : 'public')} />
                                </div>

                                <Button>{updateText}</Button>
                            </form>
                        :
                        <>
                            <div style={{position: 'relative',marginBottom: 40}}>
                                <img src={`${config.baseUrl}/storage/event_covers/${event.cover}`} alt={event.title} style={{
                                    width: '100%',
                                    aspectRatio: 5/2,
                                    objectFit: 'cover',
                                    borderRadius: 12,
                                }} />
                                <Button color="white" onClick={() => setEditing(true)} style={{
                                    position: 'absolute',
                                    top: 0,right: 0,
                                    margin: 20,
                                }}>
                                    Edit Event
                                </Button>
                            </div>
                            
                            <div style={{fontSize: 12,color: '#666'}}>JUDUL EVENT</div>
                            <div style={{marginTop: 5,fontSize: 20,fontWeight: '700',color: '#212121'}}>{event.title}</div>

                            <div style={{fontSize: 12,color: '#666',marginTop: 20}}>DESKRIPSI</div>
                            <div style={{marginTop: 5,fontSize: 15,fontWeight: '400',color: '#212121'}}>{event.description}</div>

                            <div style={{fontSize: 12,color: '#666',marginTop: 20}}>STREAM URL</div>
                            <div style={{marginTop: 5,fontSize: 15,fontWeight: '400',color: '#212121'}}>{event.stream_url}</div>

                            <div style={{fontSize: 12,color: '#666',marginTop: 20}}>EVENT TERBUKA</div>
                            <div style={{marginTop: 5,fontSize: 15,fontWeight: '400',color: '#212121'}}>{event.join_rule === 'public' ? 'Ya' : 'Tidak'}</div>

                            <div style={{height: 60}}></div>
                        </>
                    }
                    </>
                }

                {
                    viewing === 'Peserta' &&
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nama</th>
                                    <th>Email</th>
                                    <th>Enroll Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    event.users.map((usr, u) => (
                                        <tr key={u}>
                                            <td>{usr.user.name}</td>
                                            <td>{usr.user.email}</td>
                                            <td>
                                                {
                                                    usr.enroll_id === null ?
                                                        <BiX color={config.colors.red} />
                                                    :
                                                        <BiCheck color={config.colors.green} />
                                                }
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </>
                }
            </div>
            }
        </>
    )
}

export default EventDetail;