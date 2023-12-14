import React from "react";
import styles from "./styles/SidebarSimplified.module.css";
import { BiEdit, BiHome, BiPlus, BiPlusCircle } from "react-icons/bi";

const AdminMenuSimple = ({active, course = null}) => {
    if (window.screen.width > 480) {
        return (
            <div className={styles.Sidebar}>
                <div className={styles.MenuArea}>
                    <a href="/events" className={`${styles.MenuItem}`}>
                        {/* <img src={Icons.Calendar} alt="Personal Events" /> */}
                        <BiHome />
                    </a>
                    <a href={`/admin/master/course`} className={`${styles.MenuItem}`}>
                        <BiEdit />
                    </a>
                </div>

                <div className={styles.OrganizerArea}>
                    <a href="/organizer/events" className={styles.OrganizerItem}>
                        <div className={styles.OrganizerLogo}></div>
                    </a>
                    <a href="/organizer/events" className={styles.OrganizerItem}>
                        <div className={styles.OrganizerLogo}></div>
                    </a>

                    <div className={styles.CreateOrganizerButton}>
                        <BiPlusCircle />
                    </div>
                </div>
            </div>
        )
    }
}

export default AdminMenuSimple;