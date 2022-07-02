import { useEffect, useRef, useState } from 'react';
import styles from './InputModal.module.css';

type InputModalProps = {
    onSubmit: (inputValue: string) => void,
    isShown: boolean,
    defaultValue?: string;
    label?: string;
}

export default function InputModal(props: InputModalProps) {
    const [inputValue, setInputValue] = useState(props.defaultValue ? props.defaultValue : "player");

    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (props.isShown) {
            dialogRef?.current?.showModal();
        }
        else
            dialogRef?.current?.close();
    }, [props.isShown])


    function onModalSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        props.onSubmit(inputValue);
    }

    return (
        <dialog className={styles.modal} id={"inputModal"} ref={dialogRef}>
            <form onSubmit={onModalSubmit} className={styles.form}>
                <label htmlFor='playerName' className={styles.textInputLabel}>{props.label ? props.label : "Player name: "}</label>
                <input className={styles.textInput} name="playerName" value={inputValue} onChange={(e) => setInputValue(e.target.value)} autoFocus required />
                <input className={styles.submitInputButton} type="submit" value="OK" />
            </form>
        </dialog>
    )
}
