import React, { useState } from "react";
import styles from "./styles/AdminMenu.module.css";
import { BiChevronLeft, BiEdit, BiGroup, BiHome, BiListCheck, BiSolidCoupon, BiTag, BiUser } from "react-icons/bi";
import Separator from "../components/Separator";

const AdminMenu = ({active}) => {
    const [mobileShowMenu, setMobileShowMenu] = useState(false);
    const [isPublic, setPublic] = useState(false);

    if (window.screen.width > 480) {
        return (
            <div className={styles.Menu}>
    
                <div className={styles.MenuArea}>
                    <a href="/admin/dashboard" className={`${styles.MenuItem} ${active === 'dashboard' ? styles.MenuActive : ''}`}>
                        <BiHome />
                        <div className={styles.MenuText}>Dashboard</div>
                    </a>
                    <div style={{color: '#999',fontSize: 14,fontWeight: 600,margin: '20px 0px'}}>
                        Master Data
                    </div>
                    <a href="/admin/master/category" className={`${styles.MenuItem} ${active === 'category' ? styles.MenuActive : ''}`}>
                        <BiTag />
                        <div className={styles.MenuText}>Kategori</div>
                    </a>
                    <a href="/admin/master/course" className={`${styles.MenuItem} ${active === 'course' ? styles.MenuActive : ''}`}>
                        <BiEdit />
                        <div className={styles.MenuText}>Pelatihan</div>
                    </a>
                    <a href="/admin/master/coupon" className={`${styles.MenuItem} ${active === 'coupon' ? styles.MenuActive : ''}`}>
                        <BiSolidCoupon />
                        <div className={styles.MenuText}>Kupon</div>
                    </a>
                    <a href="/admin/master/peserta" className={`${styles.MenuItem} ${active === 'peserta' ? styles.MenuActive : ''}`}>
                        <BiGroup />
                        <div className={styles.MenuText}>Peserta</div>
                    </a>

                    <div style={{color: '#999',fontSize: 14,fontWeight: 600,margin: '20px 0px'}}>
                        Statistik
                    </div>
                    <a href="/admin/statistic/enroll" className={`${styles.MenuItem} ${active === 'enroll' ? styles.MenuActive : ''}`}>
                        <BiTag />
                        <div className={styles.MenuText}>Enroll</div>
                    </a>

                </div>
            </div>
        )
    }
}

export default AdminMenu;