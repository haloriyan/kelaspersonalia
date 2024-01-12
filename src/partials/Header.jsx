import { BiCog, BiCompass, BiGroup, BiLogOut, BiMenu, BiNote, BiQr, BiQrScan, BiUser } from "react-icons/bi";
import styles from "./styles/Header.module.css";
import { useEffect, useState } from "react";

const Header = ({expand = true, title = '', active = null}) => {
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
    });

    const activeStyle = {borderWidth: 1,borderStyle: 'solid',borderColor: '#ddd'};

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
                <a href="#" className={styles.MenuMobileItem} style={active === 'MenuA' ? activeStyle : null}>
                    <BiCompass size={20} />
                    Menu A
                </a>
                <a href="#" className={styles.MenuMobileItem} style={active === 'MenuB' ? activeStyle : null}>
                    <BiQrScan size={20} />
                    Menu B
                </a>
                <a href="/admin/contact-message" className={styles.MenuMobileItem} style={active === 'contact-message' ? activeStyle : null}>
                    <BiGroup size={20} />
                    Pesan Kontak
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
                    <a href="#" className={styles.Item} style={{border: active === 'MenuA' ? '1px solid #ddd' : null}}>
                        <BiCompass />
                        Menu A
                    </a>
                    <a href="#" className={styles.Item} style={{border: active === 'MenuB' ? '1px solid #ddd' : null}}>
                        <BiQr />
                        Menu B
                    </a>
                    <a href="/admin/contact-message" className={styles.Item} style={{border: active === 'contact-message' ? '1px solid #ddd' : null}}>
                        <BiNote />
                        Pesan Kontak
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