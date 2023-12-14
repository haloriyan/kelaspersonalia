import { BiCog, BiCompass, BiGroup, BiLogOut, BiMenu, BiNote, BiQr, BiQrScan, BiSearch, BiUser } from "react-icons/bi";
import styles from "./styles/HeaderPage.module.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const HeaderPage = ({expand = true, title = ''}) => {
    const { query } = useParams();
    const navigate = useNavigate();
    const [isProfileActive, setProfileActive] = useState(false);
    const [isMenuMobileActive, setMenuMobileActive] = useState(false);
    const [q, setQ] = useState(query);

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

    const search = () => {
        navigate(`/search/${q}`);
    }

    useEffect(() => {
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    })

    return (
        <>
            <div className={styles.HeaderMobile}>
                <div className={styles.LogoArea} onClick={() => navigate('/')}>
                    <img src="/icon.png" alt="Logo Agendakota" className={styles.Logo} />
                </div>
                <div className={styles.Toggler} onClick={() => setMenuMobileActive(!isMenuMobileActive)}>
                    <BiMenu />
                </div>
            </div>
            <div className={`${styles.MenuMobile} ${isMenuMobileActive ? styles.MenuMobileActive : ''}`}>
                <a href="#" className={styles.MenuMobileItem} style={{borderWidth: 1,borderStyle: 'solid',borderColor: '#ddd'}}>
                    <BiCompass size={20} />
                    Explore Events
                </a>
                <a href="#" className={styles.MenuMobileItem}>
                    <BiQrScan size={20} />
                    QR Check-in
                </a>
                <a href="#" className={styles.MenuMobileItem}>
                    <BiGroup size={20} />
                    Invitations
                </a>

                <div className={styles.Separator} style={{margin: '20px 0px',width: '100%'}}></div>
                <div style={{display: 'flex',flexDirection: 'row',alignItems: 'center',gap: 20}}>
                    <div className={styles.ProfileIcon} style={{backgroundImage: 'url(https://i1.sndcdn.com/avatars-000225426854-qk8agf-t500x500.jpg)'}}></div>
                    <div style={{fontWeight: 600}}>Riyan Satria</div>
                </div>

                <div className={styles.ProfileMenu}>
                    <a href="/profile" className={`${styles.ProfileMenuItem} ${styles.ProfileMenuItemActive}`}>
                        <BiUser />
                        Profile
                    </a>
                    <a href="/settings" className={`${styles.ProfileMenuItem}`}>
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
                    <div className={styles.LogoArea} onClick={() => navigate('/')}>
                        <img src="/icon.png" alt="Logo Agendakota" className={styles.Logo} />
                    </div>
                }
                <div className={styles.Left}>
                    <form className={styles.SearchArea} onSubmit={search}>
                        <input type="text" className={styles.SearchInput} value={q} onInput={e => setQ(e.currentTarget.value)} />
                        <button className={styles.SearchButton}>
                            <BiSearch />
                        </button>
                    </form>
                </div>
                <div className={styles.Right}>
                    <a href="#" className={styles.Item} style={{border: '1px solid #ddd'}}>
                        <BiCompass />
                        Explore Events
                    </a>
                    <div className={styles.ProfileIcon} onClick={() => setProfileActive(!isProfileActive)} style={{backgroundImage: 'url(https://i1.sndcdn.com/avatars-000225426854-qk8agf-t500x500.jpg)'}}></div>
                </div>
            </div>
            {
                isProfileActive &&
                <div className={styles.ProfileMenu}>
                    <a href="/profile" className={`${styles.ProfileMenuItem} ${styles.ProfileMenuItemActive}`}>
                        <BiUser />
                        Profile
                    </a>
                    <a href="/settings" className={`${styles.ProfileMenuItem}`}>
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

export default HeaderPage;