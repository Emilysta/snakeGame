import styles from './ToggleGroup.module.css';

type ToggleGroupProps = {
    buttonsList: string[],
    onSelectionChange?: (value: string) => void,
    isVertical?: boolean,
    groupName: string,
}

export default function ToggleGroup(props: ToggleGroupProps) {
    function onSelectionChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (props.onSelectionChange) {
            props.onSelectionChange(e.target.value);
        }
    }

    return (
        <ul className={`${styles.toggleGroup} ${props.isVertical ? styles.verticalGroup : styles.horizontalGroup}`}>
            {props.buttonsList.map((element, i) => {
                return (
                    <li key={i} className={styles.toggleGroupItem}>
                        <input type='radio' name={props.groupName} value={element} onChange={onSelectionChange} defaultChecked={i === 0} />
                        <p>{element}</p>
                    </li>
                )
            })
            }
        </ul>
    )
}