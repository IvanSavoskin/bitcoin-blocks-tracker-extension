import React from "react";

import styles from "./styles/Checkbox.module.scss";

export default function Checkbox({
    // eslint-disable-next-line react/prop-types
    className,
    ...props
}: Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "type">) {
    return (
        <div className={styles.checkboxContainer}>
            <input {...props} type="checkbox" />
            <span className={styles.checkbox} />
        </div>
    );
}
