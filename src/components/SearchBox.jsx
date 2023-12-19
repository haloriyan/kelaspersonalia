import React, { useState } from "react";
import styles from "./styles/SearchBox.module.css";
import { BiSearch } from "react-icons/bi";

const SearchBox = ({q, setQ}) => {
    return (
        <form className={styles.SearchArea}>
            <input type="text" className={styles.SearchInput} name="q" value={q} onInput={e => setQ(e.currentTarget.value)} />
            <button className={styles.SearchButton}>
                <BiSearch />
            </button>
        </form>
    )
}

export default SearchBox