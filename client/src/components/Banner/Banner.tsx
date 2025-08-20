import styles from './Banner.module.css';

const Banner = ({text}: { text: string }) => (
    <div className={styles.banner}>{text}</div>
);

export default Banner;
