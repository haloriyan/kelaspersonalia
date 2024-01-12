import React from "react";
import styles from "./styles/Checkbox.module.css";
import config from "../config";

const Checkbox = ({active, setActive = null, onClick = null, size = 20, color = config.primaryColor}) => {
    return (
        <div className={styles.Area}>
            <div className={styles.Box} style={{
                height: size,
                borderColor: active ? color : '#ddd'
            }} onClick={() => {
                if (onClick !== null) {
                    onClick();
                }
                if (setActive !== null) {
                    setActive(!active)
                }
            }}>
                {
                    active ?
                    <div className={styles.BoxInner} style={{
                        backgroundColor: color
                    }}></div>
                    : null
                }
            </div>
        </div>
    )
}

export default Checkbox;