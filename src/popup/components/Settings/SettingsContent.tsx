import classNames from "classnames";

import Icon, { IconSize } from "@parts/Icon";
import SettingsTabs from "@settings/SettingsTabs";
import closesIcon from "@static/icons/close.svg";

import settingsStyles from "./styles/Settings.module.scss";
import styles from "./styles/SettingsContent.module.scss";

interface SettingsContentProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function SettingsContent({ isVisible, onClose }: SettingsContentProps) {
    return (
        <div className={classNames(styles.container, { [styles.containerHidden]: !isVisible })}>
            <div className={styles.content}>
                <Icon
                    onClick={onClose}
                    src={closesIcon}
                    link
                    containerClassName={settingsStyles.iconContainer}
                    size={IconSize.SMALL}
                />
                <SettingsTabs />
            </div>
        </div>
    );
}
