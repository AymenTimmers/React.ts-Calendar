import styles from './Button.module.css'

type ButtonProps = {
    label: string;
    variant: "normal" | "inverted";
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

function Button({ label, variant, onClick, disabled = false, type = "button"}: ButtonProps)
{
    return (
        <button
        type={type}
        onClick={onClick}
        className={`${styles.button} ${
          variant === "inverted" ? styles.inverted : ""
        }`}
        disabled={disabled}
        >
            {label}
        </button>
    );
}

export default Button;