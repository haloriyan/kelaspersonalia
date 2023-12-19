import React from "react";
import styles from "./styles/Card.module.css";
import { BiChevronRight } from "react-icons/bi";

const CardContainer = ({children}) => {
    return (
        <div className={styles.CardContainer}>
            {children}
        </div>
    )
}

const Card = ({number, label, link, icon = null}) => {
    return (
        <a href={link} className={styles.Card}>
            <div className={styles.CardNumber}>{number}</div>
            <div className={styles.CardBottom}>
                {icon}
                <div style={{display: 'flex',flexGrow:1}}>
                    {label}
                </div>
                <BiChevronRight />
            </div>
        </a>
    )
}

export {
    CardContainer, Card
}