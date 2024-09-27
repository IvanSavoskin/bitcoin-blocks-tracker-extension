import React from "react";

import classNames from "classnames";

import styles from "./styles/Input.module.scss";

export default function Input({
    // eslint-disable-next-line react/prop-types
    className,
    ...props
}: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
    return (
        <div className={styles.inputContainer}>
            <input {...props} className={classNames(styles.input, className)} />
        </div>
    );
}
