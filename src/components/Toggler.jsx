import styles from "./styles/Toggler.module.css";

const Toggler = ({options, value, setValue, item = null}) => {
    return (
        <div className={styles.Area}>
            {
                options.map((option, o) => (
                    <div key={o} className={`${styles.Option} ${value === option ? styles.OptionActive: ''}`} onClick={() => {
                        setValue(option)
                    }}>
                        {item === null ? option : item(option, o, value === option)}
                    </div>
                ))
            }
        </div>
    )
}

export default Toggler