import { useState } from 'react';
import styles from './InputModal.module.css';

type InputModalProps = {
    onSubmit: (inputValue: string) => void,
    isShown: boolean,
}

export default function InputModal(props: InputModalProps) {
    const [inputValue, setInputValue] = useState("player");

    return (
        <div className={props.isShown ? styles.modalShown : styles.modalHidden}>
            <label htmlFor='playerName'>Player name:</label><br></br>
            <input type={'text'} name="playerName" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            <input type="submit" value="OK" onClick={()=>props.onSubmit(inputValue)} />
        </div>
    )
}
