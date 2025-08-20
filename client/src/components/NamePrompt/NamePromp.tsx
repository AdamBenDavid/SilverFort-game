import {useState} from 'react';
import styles from './NamePrompt.module.css';

type Props = {
    open: boolean;
    score: number;
    onSubmit: (name: string) => void;
    onCancel: () => void;
};

const NamePrompt = ({open, score, onSubmit, onCancel}: Props) => {
    const [name, setName] = useState('');
    if (!open) return null;

    const submit = () => onSubmit(name.trim());

    return (
        <div className={styles.backdrop} onClick={onCancel}>
            <div className={styles.card} onClick={e => e.stopPropagation()}>
                <h3>Game Over — Score: {score}</h3>
                <p>Enter a nickname to save your score:</p>
                <div className={styles.row}>
                    <input
                        className={styles.input}
                        placeholder="Nickname"
                        value={name}
                        maxLength={24}
                        onChange={e => setName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && submit()}
                        autoFocus
                    />
                    <button className={styles.btn} onClick={submit}>Save</button>
                    <button className={styles.btn} onClick={onCancel}>Skip</button>
                </div>
            </div>
        </div>
    );
};

export default NamePrompt;
