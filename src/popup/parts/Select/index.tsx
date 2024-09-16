import React from "react";

import classNames from "classnames";

import styles from "./styles/Select.module.scss";

export default function Select({
    // eslint-disable-next-line react/prop-types
    className,
    ...props
}: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>) {
    return (
        <div className={styles.selectContainer}>
            <select {...props} className={classNames(styles.select, className)} />
        </div>
    );
}
