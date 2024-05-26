import classNames from "classnames";

import styles from "./styles/Icon.module.scss";

export enum IconSize {
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large"
}

interface IconProps {
    src: string;
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

export default function Icon({ src, size = IconSize.MEDIUM, onClick, link = false, containerClassName, disabled = false }: IconProps) {
    const onIconClick = () => {
        if (!disabled) {
            onClick?.();
        }
    };

    return (
        <div onClick={onIconClick} role="button" className={classNames(containerClassName)} tabIndex={0} onKeyDown={onClick}>
            <img
                className={classNames(getIconSizeClass(size), {
                    [styles.icon]: !disabled,
                    [styles.iconLink]: link && !disabled,
                    [styles.iconDisabled]: disabled
                })}
                src={src}
                alt="icon"
            />
        </div>
    );
}
