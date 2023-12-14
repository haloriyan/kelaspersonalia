import { BiCog, BiCompass, BiGroup, BiLogOut, BiMenu, BiNote, BiQr, BiQrScan, BiUser } from "react-icons/bi";
import styles from "./styles/Header.module.css";
import { useEffect, useState } from "react";

const Header = ({expand = true, title = ''}) => {
    const [isProfileActive, setProfileActive] = useState(false);
    const [isMenuMobileActive, setMenuMobileActive] = useState(false);

    const handleClick = e => {
        let target = e.target;
        let classes = target.classList[0]?.split('_');
        console.log(classes);

        if (window.screen.width > 480) {
            if (classes === undefined || classes?.indexOf('Header') < 0 && isProfileActive) {
                setProfileActive(false);
            }
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    })

    return (
        <>
            <div className={styles.HeaderMobile}>
                <div className={styles.LogoArea}>
                    <img src="/icon.png" alt="Logo Kelas Personalia" className={styles.Logo} />
                </div>
                <div className={styles.Toggler} onClick={() => setMenuMobileActive(!isMenuMobileActive)}>
                    <BiMenu />
                </div>
            </div>
            <div className={`${styles.MenuMobile} ${isMenuMobileActive ? styles.MenuMobileActive : ''}`}>
                <a href="#" className={styles.MenuMobileItem} style={{borderWidth: 1,borderStyle: 'solid',borderColor: '#ddd'}}>
                    <BiCompass size={20} />
                    Menu A
                </a>
                <a href="#" className={styles.MenuMobileItem}>
                    <BiQrScan size={20} />
                    Menu B
                </a>
                <a href="#" className={styles.MenuMobileItem}>
                    <BiGroup size={20} />
                    Menu Cs
                </a>

                <div className={styles.Separator} style={{margin: '20px 0px',width: '100%'}}></div>
                <div style={{display: 'flex',flexDirection: 'row',alignItems: 'center',gap: 20}}>
                    <div className={styles.ProfileIcon} style={{backgroundImage: 'url(https://i1.sndcdn.com/avatars-000225426854-qk8agf-t500x500.jpg)'}}></div>
                    <div style={{fontWeight: 600}}>Riyan Satria</div>
                </div>

                <div className={styles.ProfileMenu}>
                    <a href="#" className={`${styles.ProfileMenuItem} ${styles.ProfileMenuItemActive}`}>
                        <BiUser />
                        Profile
                    </a>
                    <a href="#" className={`${styles.ProfileMenuItem}`}>
                        <BiCog />
                        
                        Settings
                    </a>
                    <div className={styles.Separator}></div>
                    <a href="#" className={`${styles.ProfileMenuItem}`}>
                        <BiLogOut />
                        Logout
                    </a>
                </div>
            </div>
            <div className={styles.Header} style={{left: expand ? '0%' : '20%'}}>
                {
                    expand &&
                    <div className={styles.LogoArea}>
                        <img src="/icon.png" alt="Logo Kelas Personalia" className={styles.Logo} />
                    </div>
                }
                <div className={styles.Left}>
                    {title}
                </div>
                <div className={styles.Right}>
                    <a href="#" className={styles.Item} style={{border: '1px solid #ddd'}}>
                        <BiCompass />
                        Menu A
                    </a>
                    <a href="#" className={styles.Item}>
                        <BiQr />
                        Menu B
                    </a>
                    <a href="#" className={styles.Item}>
                        <BiNote />
                        Menu C
                    </a>
                    <div className={styles.ProfileIcon} onClick={() => setProfileActive(!isProfileActive)} style={{backgroundImage: 'url(https://i1.sndcdn.com/avatars-000225426854-qk8agf-t500x500.jpg)'}}></div>
                </div>
            </div>
            {
                isProfileActive &&
                <div className={styles.ProfileMenu}>
                    <a href="#" className={`${styles.ProfileMenuItem} ${styles.ProfileMenuItemActive}`}>
                        <BiUser />
                        Profile
                    </a>
                    <a href="#" className={`${styles.ProfileMenuItem}`}>
                        <BiCog />
                        
                        Settings
                    </a>
                    <div className={styles.Separator}></div>
                    <a href="#" className={`${styles.ProfileMenuItem}`}>
                        <BiLogOut />
                        Logout
                    </a>
                </div>
            }
        </>
    )
}

export default Header;