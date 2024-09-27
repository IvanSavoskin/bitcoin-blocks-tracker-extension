import React from "react";

import classNames from "classnames";

import styles from "./styles/Icon.module.scss";

export enum IconSize {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large"
}

interface IconProps {
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    size?: IconSize;
    onClick?: () => void;
    link?: boolean;
    containerClassName?: string;
    disabled?: boolean;
}

function getIconSizeClass(size: IconSize) {
    switch (size) {
        case IconSize.SMALL: {
            return styles.small;
        }
        case IconSize.MEDIUM: {
            return styles.medium;
        }
        case IconSize.LARGE: {
            return styles.large;
        }
        // skip default
    }
}

export default function Icon({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    icon: IconComponent,
    size = IconSize.MEDIUM,
    onClick,
    link = false,
    containerClassName,
    disabled = false
}: IconProps) {
    const onIconClick = () => {
        if (!disabled) {
            onClick?.();
        }
    };

    return (
        <div onClick={onIconClick} role="button" className={classNames(containerClassName)} tabIndex={0} onKeyDown={onClick}>
            <IconComponent
                className={classNames(getIconSizeClass(size), {
                    [styles.icon]: !disabled,
                    [styles.iconLink]: link && !disabled,
                    [styles.iconDisabled]: disabled
                })}
            />
        </div>
    );
}
