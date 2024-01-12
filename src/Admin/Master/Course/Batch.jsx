import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import config from "../../../config";
import Header from "../../../partials/Header";
import AdminMenuSimple from "../../../partials/AdminMenuSimple";
import CourseMenu from "../../../partials/CourseMenu";
import Button from "../../../components/Button";
import moment from "moment";
import { BiEdit, BiX } from "react-icons/bi";
import Input from "../../../components/Input";
import Popup from "../../../components/Popup";
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

const CourseBatch = () => {
    const { id } = useParams();
    const [isLoading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [batches, setBatches] = useState([]);

    const [startDate, setStartDate] = useState(moment().format('Y-MM-DD'));
    const [endDate, setEndDate] = useState(moment().add(1, 'day').format('Y-MM-DD'));
    const [capacity, setCapacity] = useState(100);

    const [isAdding, setAdding] = useState(false);
    const [isEditing, setEditing] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/course/${id}/batch`)
            .then(response => {
                let res = response.data;
                setBatches(res.batches);
                setCourse(res.course);
            })
        }
    }, [isLoading])

    const submit = e => {
        axios.post(`${config.baseUrl}/api/course/${id}/batch/create`, {
            start_date: startDate,
            end_date: endDate,
            quantity: capacity,
        })
        .then(response => {
            setLoading(true);
            setAdding(false);
            setCapacity(100);
            setStartDate(moment().format('Y-MM-DD'));
            setEndDate(moment().add(1, 'day').format('Y-MM-DD'));
        })
        e.preventDefault();
    }

    return (
        <>
            <Header />
            <AdminMenuSimple />
            <CourseMenu active={'batch'} course={course} />
            <div className="content organizer">
                <div className="inline">
                    <div style={{display: 'flex',flexDirection: 'column',flexGrow: 1}}>
                        <h2 style={{margin: 0}}>Batch Pendaftaran</h2>
                        <div style={{fontSize: 14,color: '#666',marginTop: 5}}>Tentukan kapan saja pengguna dapat mendaftar pelatihan</div>
                    </div>
                    <Button accent="secondary" onClick={() => setAdding(true)}>
                        Tambah
                    </Button>
                </div>

                <div style={{height: 40}}></div>

                <table>
                    <thead>
                        <tr>
                            <th>Batch</th>
                            <th>Tanggal</th>
                            <th>Peserta</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            batches.map((bat, b) => (
                                <tr key={b}>
                                    <td>Batch ke-{b + 1}</td>
                                    <td>
                                        {moment(bat.start_date).format('D MMM Y')} -
                                        {moment(bat.end_date).format('D MMM Y')}
                                    </td>
                                    <td>
                                        {bat.start_quantity - bat.quantity} dari total {bat.start_quantity}
                                    </td>
                                    <td>
                                        <Button color="green" height={36}>
                                            <BiEdit />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                {
                    isAdding &&
                    <Popup onDismiss={() => setAdding(false)}>
                        <div className="inline">
                            <h2 style={{margin: 0,display: 'flex',flexGrow: 1}}>Buat Batch Baru</h2>
                            <Button accent="secondary" color="muted" circle onClick={() => setAdding(false)}>
                                <BiX />
                            </Button>
                        </div>
                        <form action="#" onSubmit={submit}>
                            <div className="inline">
                                <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column'}}>
                                    <div style={{fontSize: 12,color: '#666'}}>Tanggal Mulai :</div>
                                    <InputContainer>
                                        <Flatpickr
                                            style={{height: 40}}
                                            defaultValue={startDate}
                                            onChange={([date]) => {
                                                let dt = moment(date);
                                                setStartDate(dt.format('Y-MM-DD'));
                                                setEndDate(moment(date).add(1, 'day').format('Y-MM-DD'));
                                            }}
                                            options={{
                                                enableTime: false,
                                            }}
                                        />
                                    </InputContainer>
                                </div>
                                <div style={{display: 'flex',flexGrow: 1,flexDirection: 'column'}}>
                                    <div style={{fontSize: 12,color: '#666'}}>Tanggal Berakhir :</div>
                                    <InputContainer>
                                        <Flatpickr
                                            style={{height: 40}}
                                            defaultValue={endDate}
                                            onChange={([date]) => {
                                                let dt = moment(date);
                                                setEndDate(dt.format('Y-MM-DD'));
                                            }}
                                            options={{
                                                enableTime: false,
                                                minDate: moment(startDate).add(1, 'day').format('Y-MM-DD'),
                                            }}
                                        />
                                    </InputContainer>
                                </div>
                            </div>

                            <Input type="number" label="Kapasitas Peserta" value={capacity} onInput={e => setCapacity(e.currentTarget.value)} required right={'peserta'} />

                            <Button>Submit</Button>
                        </form>
                    </Popup>
                }
            </div>
        </>
    )
}

export default CourseBatch;