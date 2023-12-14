import React from "react";
import styles from "./styles/Radio.module.css";

const Radio = ({active = false, size = 20, label = 'Option', onClick = null}) => {
    return (
        <div className={styles.Area} onClick={onClick}>
            <div className={styles.Radio} style={{
                width: size,
                borderColor: active ? '#3498db' : '#ddd'
            }}>
                {
                    active &&
                    <div className={styles.RadioInner} style={{width: size - 8}}></div>
                }
            </div>
            {
                label !== null &&
                <div>{label}</div>
            }
        </div>
    )
}

export default Radio;