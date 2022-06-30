import styles from './CustomButton.module.css';

interface CustomButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    icon?: React.ReactNode,
}
export default function CustomButton({ icon, value, ...props }: CustomButtonProps) {
    return (
        <button {...props} className={styles.customButton}>
            <div className={styles.customButtonContentBox}>
                {icon}
                {value}
            </div>
        </button>
    )
}
