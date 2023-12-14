import { BiChevronDown, BiFile, BiMoney, BiSearch } from "react-icons/bi";
import styles from "./styles/HeaderInfluencer.module.css";
import config from "../config";
import { useState } from "react";

const HeaderInfluencer = () => {
    const [showProfile, setShowProfile] = useState(false);
    
    return (
        <>
            <div className={styles.Header}>
                <div className={styles.SideArea}>
                    <img src="/images/icon.png" alt="Icon Publish" className={styles.Icon} />
                </div>
                <div className={styles.SearchContainer}>
                    <div className={styles.SearchArea}>
                        <input type="text" className={styles.SearchInput} />
                        <button className={styles.SearchButton}>
                            <BiSearch size={18} color={config.primaryColor} />
                        </button>
                    </div>
                </div>
                <div className={styles.SideArea} style={{justifyContent: 'flex-end'}}>
                    <div className={styles.Button}>
                        <BiMoney size={16} />
                    </div>
                    <div style={{position: 'relative',cursor: 'pointer'}} onClick={() => showProfile(!showProfile)}>
                        <img src="/images/profile.jpg" alt="Riyan's photo" className={styles.PhotoProfile} />
                        <div className={styles.ProfileDownIndicator}>
                            <BiChevronDown />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HeaderInfluencer;