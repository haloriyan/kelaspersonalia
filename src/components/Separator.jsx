import styles from "./styles/Separator.module.css";

const Separator = ({margin = '20px 0px', width = '100%', height = 1, color = '#ddd'}) => {
    return (
        <div className={styles.Separator} style={{
            margin: margin,
            width: width,
            height: height,
            backgroundColor: color
        }}></div>
    )
}

export default Separator;