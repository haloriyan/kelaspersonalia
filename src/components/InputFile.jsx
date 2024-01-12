import React, { useRef } from "react";
import styles from "./styles/InputFile.module.css";
import { BiImageAdd } from "react-icons/bi";

const InArray = (needle, haystack, isObject = false) => {
    if (isObject) {
        let key = Object.keys(needle)[0];
        for (let i = 0; i < haystack.length; i++) {
            if (haystack[i].hasOwnProperty(key) && haystack[i][key] === needle[key]) {
                return true;
            }
        }
        return false;
    } else {
        for (let i = 0; i < haystack.length; i++) {
            if (haystack[i] === needle) return true;
        }
        return false
    }
}

const getExtension = (name) => {
    let n = name.split('.');
    return n[n.length - 1].toLowerCase();
}

const imageExtensions = ['png','jpg','bmp','gif','jpeg'];

const InputFile = ({aspectRatio = '1/1', type = 'image', size = '80px', iconSize = '30%', label = 'Pilih Berkas...', labelStyle, align = 'left', autoClear = false, onChange, width = null, height = null, style}) => {
    const thisRef = useRef(null);
    const prevArea = useRef(null);
    const theAligns = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end',
    };
    let defaultStyle = {
        height: size,
        aspectRatio: aspectRatio,
        ...style
    };

    if (width !== null && height !== null) {
        defaultStyle = {
            height: height,width: width,
            ...style
        }
    }

    return (
        <div className={styles.Container} style={{
            justifyContent: theAligns[align],
        }}>
            <div className={`${styles.Area}`} style={defaultStyle} ref={prevArea}>
                <BiImageAdd size={iconSize} />
                {
                    label !== "" &&
                    <div style={labelStyle}>{label}</div>
                }
            </div>
            <input type="file" ref={thisRef} className={styles.Input} style={defaultStyle} onChange={e => {
                onChange(thisRef.current, e);
                let file = thisRef.current.files[0];

                if (InArray(getExtension(file.name), imageExtensions) && !autoClear) {
                    let reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.addEventListener('load', event => {
                        prevArea.current.style.backgroundImage = `url(\'${reader.result}\')`;
                        prevArea.current.style.backgroundPosition = "center center";
                        prevArea.current.style.backgroundSize = "cover";
                        prevArea.current.innerHTML = "";
                    })
                }

            }} />
        </div>
    )
}

export default InputFile;