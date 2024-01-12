import React, { useEffect, useState } from "react";
import AdminMenu from "../../partials/AdminMenu";
import Header from "../../partials/Header";
import axios from "axios";
import config from "../../config";
import styles from "../styles/Coupon.module.css";
import Button from "../../components/Button";
import Popup from "../../components/Popup";
import { BiX } from "react-icons/bi";
import Input from "../../components/Input";
import Toggler from "../../components/Toggler";
import { useDebouncedCallback } from "use-debounce";
import InArray from "../../components/InArray";
import Currency from "../../components/Currency";
import Pagination from "../../components/Pagination";
import SearchBox from "../../components/SearchBox";
import { useSearchParams } from "react-router-dom";

const Coupon = () => {
    const [searchParams] = useSearchParams();
    const [isLoading, setLoading] = useState(true);
    const [admin, setAdmin] = useState(null);
    const [courses, setCourses] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [raw, setRaw] = useState(null);
    const [q, setQ] = useState(searchParams.get('q'));
    const [page, setPage] = useState(1);

    const [code, setCode] = useState('');
    const [type, setType] = useState('%');
    const [amount, setAmount] = useState(100);
    const [quantity, setQuantity] = useState(999);
    const [forCourses, setForCourses] = useState([]);

    const [isAdding, setAdding] = useState(false);
    const [massGenerating, setMassGenerating] = useState(false);
    const [generateButton, setGenerateButton] = useState('Buat Kupon');

    useEffect(() => {
        if (admin === null) {
            setAdmin(JSON.parse(window.localStorage.getItem('admin_data')));
        }
    }, [admin]);

    useEffect(() => {
        if (isLoading && admin !== null) {
            setLoading(false);
            axios.post(`${config.baseUrl}/api/coupon?page=${page}&q=${q}`)
            .then(response => {
                let res = response.data;
                setRaw(res.raw);
                setCoupons(res.coupons);
            })
        }
    }, [isLoading, admin]);

    const submit = e => {
        let theForCourses = [];
        forCourses.map(fc => {
            theForCourses.push(fc.id);
        });

        axios.post(`${config.baseUrl}/api/coupon/create`, {
            code: code,
            quantity: quantity,
            discount_type: type === '%' ? 'percentage' : 'amount',
            discount_amount: amount,
            for_courses_id: theForCourses
        })
        .then(response => {
            let res = response.data;
            setLoading(true);
            setAdding(false);
            setCode('');
            setType('%');
            setAmount(100);
        })
        e.preventDefault();
    }

    const search = useDebouncedCallback(() => {
        axios.post(`${config.baseUrl}/api/course/search`, {
            q: q,
        })
        .then(response => {
            let res = response.data;
            setCourses(res.courses);
        })
    }, 1000);

    const generateMass = e => {
        let theForCourses = [];
        forCourses.map(fc => {
            theForCourses.push(fc.id);
        });
        setGenerateButton('Membuat kupon...');
        axios.post(`${config.baseUrl}/api/coupon/generate-mass`, {
            quantity,
            discount_type: type === '%' ? 'percentage' : 'amount',
            discount_amount: amount,
            for_courses_id: theForCourses
        })
        .then(response => {
            let res = response.data;
            setLoading(true);
            // setMassGenerating(false);
            setGenerateButton('Buat Kupon');
        })
        .catch(e => {
            setGenerateButton('Buat Kupon');
        })
        e.preventDefault();
    }

    return (
        <>
            <Header />
            <AdminMenu active={'coupon'} />
            <div className="content user">
                <div className="inline">
                    <h2 style={{margin: 0,display: 'flex',flexGrow: 1}}>Kupon</h2>
                    <SearchBox q={q} setQ={setQ} />
                    <Button onClick={() => setMassGenerating(true)}>
                        Generate Massal
                    </Button>
                </div>

                <div style={{height: 40}}></div>

                <table>
                    <thead>
                        <tr>
                            <th>Kode</th>
                            <th>Kursus</th>
                            <th>Terpakai</th>
                            <th>Nominal</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            coupons.map((coup, c) => (
                                <tr key={c}>
                                    <td>{coup.code}</td>
                                    <td>
                                        {
                                            coup.courses.map((cour, c) => (
                                                <li key={c}>
                                                    <a href={`/course/${cour.id}`} target="_blank">
                                                        {cour.title}
                                                    </a>
                                                </li>
                                            ))
                                        }
                                    </td>
                                    <td style={{fontSize: 12}}>
                                        {coup.start_quantity - coup.quantity} dari {coup.start_quantity}
                                    </td>
                                    <td>
                                        {
                                            coup.discount_type === 'percentage' ?
                                                `${coup.discount_amount}%`
                                            :
                                                Currency(coup.discount_amount).encode()
                                        }
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                {
                    raw !== null &&
                    <div style={{display: 'flex',gap: 20,marginTop: 20}}>
                        <div style={{display: 'flex',flexGrow: 1}}>
                            <a href={`${config.baseUrl}/export/coupon`} style={{textDecoration: 'none'}}>
                                <Button color="green">Download</Button>
                            </a>
                        </div>
                        <Pagination 
                            style={{marginTop: 0}}
                            next_page_url={raw.next_page_url}
                            prev_page_url={raw.prev_page_url}
                            next={() => {
                                setPage(page + 1);
                                setLoading(true);
                            }}
                            prev={() => {
                                setPage(page - 1);
                                setLoading(true);
                            }}
                        />
                    </div>
                }
            </div>

            {
                isAdding &&
                    <Popup onDismiss={() => setAdding(false)}>
                        <div className="inline" style={{marginBottom: 20}}>
                            <h2 style={{margin: 0,display: 'flex',flexGrow: 1}}>Buat Kupon</h2>
                            <Button circle accent="secondary" color="muted" onClick={() => setAdding(false)}>
                                <BiX size={18} />
                            </Button>
                        </div>

                        <form action="#" onSubmit={submit}>
                            <Input label="Kode Promo" value={code} onInput={e => setCode(e.currentTarget.value)} required />

                            <div style={{marginTop: 20,fontSize: 12,color: '#666'}}>Besaran Diskon :</div>
                            <div style={{display: 'flex',flexDirection: 'row',padding: 5,border: '1px solid #ddd',marginTop: 10,borderRadius: 8,marginBottom: 20}}>
                                <input style={{display: 'flex',flexGrow: 1,background: 'none',border: 'none',outline: 'none',fontSize: 16}} value={amount} onInput={e => setAmount(e.currentTarget.value)} required />
                                <Toggler options={['%', 'Rp']} value={type} setValue={setType} />
                            </div>

                            <Input type="number" label="Quantity" value={quantity} onInput={e => setQuantity(e.currentTarget.value)} required />
                            <div className="inline">
                                <div style={{marginTop: 20,display: 'flex',flexGrow: 1}}>
                                    <div style={{fontSize: 12,color: '#666'}}>Khusus Untuk Pelatihan :</div>
                                    {
                                        forCourses.length > 0 &&
                                        <div style={{display: 'flex',gap: 10,flexDirection: 'row',marginTop: 10}}>
                                            {
                                                forCourses.map((fc, f) => (
                                                    <div key={f} style={{border: '1px solid #ddd',padding: 10,borderRadius: 6,fontSize: 12,gap: 5,display: 'flex',flexDirection: 'row'}}>
                                                        {fc.title}
                                                        <span style={{cursor: 'pointer'}} onClick={() => {
                                                            let theFc = [...forCourses];
                                                            theFc.splice(f, 1);
                                                            setForCourses(theFc);
                                                        }}>
                                                            <BiX />
                                                        </span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    }
                                </div>
                                <div style={{display: 'flex',flexDirection: 'row',padding: 5,border: '1px solid #ddd',marginTop: 10,borderRadius: 8}}>
                                    <input style={{display: 'flex',flexGrow: 1,background: 'none',border: 'none',outline: 'none',fontSize: 16}} placeholder="Cari pelatihan" value={q} onInput={e => {
                                        setQ(e.currentTarget.value);
                                        search();
                                    }} />
                                </div>
                            </div>

                            <div className={styles.CoursesArea}>
                                {
                                    courses.length > 0 &&
                                    courses.map((cour, c) => {
                                        if (forCourses.findIndex((f) => f.id === cour.id) < 0) return (
                                            <div key={c} className={styles.CoursesItem}>
                                                <img src={`${config.baseUrl}/storage/cover_images/${cour.cover_image}`} alt={cour.title} className={styles.CoursesImage} />
                                                <div style={{display: 'flex',flexGrow: 1}}>
                                                    <div>{cour.title}</div>
                                                </div>
                                                <Button accent="secondary" height={32} type="button" onClick={() => {
                                                    let fc = [...forCourses];
                                                    if (InArray(cour, fc, true)) {
                                                        const i = fc.findIndex((u) => u.id === cour.id);
                                                        fc.splice(i, 1);
                                                    } else {
                                                        fc.push(cour);
                                                    }
                                                    setQ('');
                                                    setCourses([]);
                                                    setForCourses(fc);
                                                }}>
                                                    Pilih
                                                </Button>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <Button style={{width: '100%',marginTop: 20}}>Submit</Button>
                        </form>
                </Popup>
            }

            {
                massGenerating &&
                <Popup onDismiss={() => setMassGenerating(false)}>
                    <div className="inline" style={{marginBottom: 20}}>
                        <h2 style={{margin: 0,display: 'flex',flexGrow: 1}}>Generate Kupon Massal</h2>
                        <Button circle accent="secondary" color="muted" onClick={() => setMassGenerating(false)}>
                            <BiX size={18} />
                        </Button>
                    </div>

                    <form action="#" onSubmit={generateMass}>
                        <Input type="number" label="Jumlah Kupon" value={quantity} onInput={e => setQuantity(e.currentTarget.value)} required />
                        <div className="inline">
                            <div style={{marginTop: 20,display: 'flex',flexGrow: 1,flexDirection: 'column'}}>
                                <div style={{fontSize: 12,color: '#666'}}>Khusus Untuk Pelatihan :</div>
                                {
                                    forCourses.length > 0 &&
                                    <div style={{display: 'flex',gap: 10,flexDirection: 'row',marginTop: 10}}>
                                        {
                                            forCourses.map((fc, f) => (
                                                <div key={f} style={{border: '1px solid #ddd',padding: 10,borderRadius: 6,fontSize: 12,gap: 5,display: 'flex',flexDirection: 'row'}}>
                                                    {fc.title}
                                                    <span style={{cursor: 'pointer'}} onClick={() => {
                                                        let theFc = [...forCourses];
                                                        theFc.splice(f, 1);
                                                        setForCourses(theFc);
                                                    }}>
                                                        <BiX />
                                                    </span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                }
                            </div>
                            <div style={{display: 'flex',flexDirection: 'row',padding: 5,border: '1px solid #ddd',marginTop: 10,borderRadius: 8}}>
                                <input style={{display: 'flex',flexGrow: 1,background: 'none',border: 'none',outline: 'none',fontSize: 16}} placeholder="Cari pelatihan" value={q} onInput={e => {
                                    setQ(e.currentTarget.value);
                                    search();
                                }} />
                            </div>
                        </div>

                        <div className={styles.CoursesArea}>
                            {
                                courses.length > 0 &&
                                courses.map((cour, c) => {
                                    if (forCourses.findIndex((f) => f.id === cour.id) < 0) return (
                                        <div key={c} className={styles.CoursesItem}>
                                            <img src={`${config.baseUrl}/storage/cover_images/${cour.cover_image}`} alt={cour.title} className={styles.CoursesImage} />
                                            <div style={{display: 'flex',flexGrow: 1}}>
                                                <div>{cour.title}</div>
                                            </div>
                                            <Button accent="secondary" height={32} type="button" onClick={() => {
                                                let fc = [...forCourses];
                                                if (InArray(cour, fc, true)) {
                                                    const i = fc.findIndex((u) => u.id === cour.id);
                                                    fc.splice(i, 1);
                                                } else {
                                                    fc.push(cour);
                                                }
                                                setQ('');
                                                setCourses([]);
                                                setForCourses(fc);
                                            }}>
                                                Pilih
                                            </Button>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <Button>{generateButton}</Button>
                    </form>
                </Popup>
            }
        </>
    )
}

export default Coupon;