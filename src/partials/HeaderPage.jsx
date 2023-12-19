import { BiCog, BiCompass, BiGroup, BiLogIn, BiLogOut, BiMenu, BiNote, BiQr, BiQrScan, BiSearch, BiUser } from "react-icons/bi";
import styles from "./styles/HeaderPage.module.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Button from "../components/Button";

const getInitial = name => {
    let names = name.split(' ');
    let toReturn = names[0][0];
    if (names.length > 1) {
        toReturn += names[names.length - 1][0];
    }
    return toReturn.toUpperCase();
}

const HeaderPage = ({expand = true, title = ''}) => {
    const { query } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isProfileActive, setProfileActive] = useState(false);
    const [isMenuMobileActive, setMenuMobileActive] = useState(false);
    const [q, setQ] = useState(searchParams.get('q'));
    
    const [user, setUser] = useState(null);
    const [hasLoggedIn, setHasLoggedIn] = useState(null);

    useEffect(() => {
        if (hasLoggedIn === null) {
            let u = JSON.parse(window.localStorage.getItem('user_data'));
            if (u !== null) {
                setHasLoggedIn(true);
                setUser(u);
            }
        }
    }, [hasLoggedIn]);

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
        navigate(`/search?q=${q}`);
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
                {
                    hasLoggedIn ?
                    <>
                        <a href="/my-course" className={styles.MenuMobileItem} style={{borderWidth: 1,borderStyle: 'solid',borderColor: '#ddd'}}>
                            <BiCompass size={20} />
                            Pelatihan Saya
                        </a>

                        <div className={styles.Separator} style={{margin: '20px 0px',width: '100%'}}></div>
                        <a href="/profile" style={{display: 'flex',flexDirection: 'row',alignItems: 'center',gap: 20}}>
                            <div className={styles.ProfileIcon} style={{backgroundImage: 'url(https://i1.sndcdn.com/avatars-000225426854-qk8agf-t500x500.jpg)'}}></div>
                            <div style={{fontWeight: 600}}>{user.name}</div>
                        </a>
                    </>
                    :
                    <>
                        <a href="/auth/login" className={styles.MenuMobileItem} style={{borderWidth: 1,borderStyle: 'solid',borderColor: '#ddd'}}>
                            <BiLogIn size={20} />
                            Login
                        </a>
                    </>
                }

                {/* <div className={styles.ProfileMenu}>
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
                </div> */}
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
                        <input type="text" name="q" className={styles.SearchInput} value={q} onInput={e => setQ(e.currentTarget.value)} placeholder="Ketik dan tekan enter" />
                        <button className={styles.SearchButton}>
                            <BiSearch />
                        </button>
                    </form>
                </div>
                {
                    hasLoggedIn ?
                    <div className={styles.Right}>
                        <a href="/my-course" className={styles.Item} style={{border: '1px solid #ddd'}}>
                            <BiCompass />
                            Pelatihan Saya
                        </a>
                        <div className={styles.ProfileIcon} onClick={() => navigate('/profile')}>
                            {getInitial(user.name)}
                        </div>
                    </div>
                    :
                    <div className={styles.Right}>
                        <Button accent="secondary" onClick={() => navigate('/auth/login')}>Login</Button>
                    </div>
                }
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