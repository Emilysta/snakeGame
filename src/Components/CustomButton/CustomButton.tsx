import styles from './CustomButton.module.css';

interface CustomButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    contentClassName?: string,
    icon?: React.ReactNode,
}
export default function CustomButton({ contentClassName, icon, value, ...props }: CustomButtonProps) {
    return (
        <button {...props} className={`${styles.customButton} ${props.className}`}>
            <div className={`${contentClassName} ${styles.customButtonContentBox}`}>
                {icon}
                {value}
            </div>
        </button>
    )
}
