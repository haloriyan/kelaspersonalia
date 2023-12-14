import React from "react";
import styles from "./styles/Pagination.module.css";
import Button from "./Button";

const Pagination = ({next_page_url = null, prev_page_url = null, next, prev}) => {
    return (
        <div className={styles.Area}>
            {
                prev_page_url !== null &&
                <Button accent="secondary" onClick={prev}>
                    Prev
                </Button>
            }
            {
                next_page_url !== null &&
                <Button accent="secondary" onClick={next}>
                    Next
                </Button>
            }
        </div>
    )
}

export default Pagination;