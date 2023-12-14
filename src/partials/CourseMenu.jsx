import React, { useState } from "react";
import styles from "./styles/CourseMenu.module.css";
import { BiChevronLeft, BiCog, BiFile, BiGroup, BiHome, BiImage } from "react-icons/bi";
import Separator from "../components/Separator";
import Substring from "../components/Substring";

const CourseMenu = ({active, course = null}) => {
    const [mobileShowMenu, setMobileShowMenu] = useState(false);
    const [isPublic, setPublic] = useState(false);

    if (window.screen.width > 480 && course !== null) {
        return (
            <div className={styles.Menu}>
                <a href="/admin/master/course" className="inline" style={{padding: '20px 10px',gap: 10,textDecoration: 'none',color: '#212121'}}>
                    <BiChevronLeft />
                    <div className="title" style={{display: 'flex',flexGrow: 1,fontSize: 16,fontWeight: 700}}>{Substring(course.title, 4, true)}</div>
                </a>
                <Separator margin="0px 0px" />
    
                <div className={styles.MenuArea}>
                    <a href={`/admin/master/course/${course.id}/detail`} className={`${styles.MenuItem} ${active === 'dashboard' ? styles.MenuActive : ''}`}>
                        <BiHome />
                        <div className={styles.MenuText}>Dashboard</div>
                    </a>
                    <a href={`/admin/master/course/${course.id}/materi`} className={`${styles.MenuItem} ${active === 'materi' ? styles.MenuActive : ''}`}>
                        <BiFile />
                        <div className={styles.MenuText}>Materi</div>
                    </a>
                    <a href={`/admin/master/course/${course.id}/media`} className={`${styles.MenuItem} ${active === 'media' ? styles.MenuActive : ''}`}>
                        <BiImage />
                        <div className={styles.MenuText}>Media</div>
                    </a>
                    <a href={`/admin/master/course/${course.id}/peserta`} className={`${styles.MenuItem} ${active === 'peserta' ? styles.MenuActive : ''}`}>
                        <BiGroup />
                        <div className={styles.MenuText}>Peserta</div>
                    </a>
                    <a href={`/admin/master/course/${course.id}/settings`} className={`${styles.MenuItem} ${active === 'settings' ? styles.MenuActive : ''}`}>
                        <BiCog />
                        <div className={styles.MenuText}>Pengaturan</div>
                    </a>

                    <div style={{color: '#999',fontSize: 14,fontWeight: 600,margin: '20px 0px'}}>
                        Report
                    </div>
                    <a href="/event/selling" className={`${styles.MenuItem} ${active === 'selling' ? styles.MenuActive : ''}`}>
                        <BiHome />
                        <div className={styles.MenuText}>Selling</div>
                    </a>
                    <a href="/event/booking" className={`${styles.MenuItem} ${active === 'booking' ? styles.MenuActive : ''}`}>
                        <BiHome />
                        <div className={styles.MenuText}>Booking Data</div>
                    </a>
                </div>
            </div>
        )
    }
}

export default CourseMenu;