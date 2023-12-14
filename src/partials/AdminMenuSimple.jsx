import React from "react";
import styles from "./styles/SidebarSimplified.module.css";
import { BiEdit, BiGroup, BiHome, BiPlus, BiPlusCircle, BiSolidCoupon, BiTag } from "react-icons/bi";

const AdminMenuSimple = ({active, course = null}) => {
    if (window.screen.width > 480) {
        return (
            <div className={styles.Sidebar}>
                <div className={styles.MenuArea}>
                    <a href="/admin/dashboard" className={`${styles.MenuItem}`}>
                        {/* <img src={Icons.Calendar} alt="Personal Events" /> */}
                        <BiHome />
                    </a>
                    <div style={{height: 20}}></div>
                    <a href={`/admin/master/category`} className={`${styles.MenuItem}`}>
                        <BiTag />
                    </a>
                    <a href={`/admin/master/course`} className={`${styles.MenuItem}`}>
                        <BiEdit />
                    </a>
                    <a href={`/admin/master/coupon`} className={`${styles.MenuItem}`}>
                        <BiSolidCoupon />
                    </a>
                    <a href={`/admin/master/peserta`} className={`${styles.MenuItem}`}>
                        <BiGroup />
                    </a>
                </div>
            </div>
        )
    }
}

export default AdminMenuSimple;