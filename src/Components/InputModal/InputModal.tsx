import { useState } from 'react';
import styles from './InputModal.module.css';

type InputModalProps = {
    onSubmit: (inputValue: string) => void,
    isShown: boolean,
    defaultValue?: string;
    label?: string;
}

export default function InputModal(props: InputModalProps) {
    const [inputValue, setInputValue] = useState(props.defaultValue ? props.defaultValue : "player");

    return (
        <div className={`${styles.blend} ${props.isShown ? styles.show : ''}`}>
            <div className={styles.modal}>
                <label htmlFor='playerName' className={styles.textInputLabel}>{props.label ? props.label : "Player name: "}</label>
                <input className={styles.textInput} name="playerName" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                <input className={styles.submitInputButton} type="submit" value="OK" onClick={() => props.onSubmit(inputValue)} />
            </div>
        </div>
    )
}
