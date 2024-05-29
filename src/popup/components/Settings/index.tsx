import { useIsSettingsOpen } from "@context/MainContext";
import Icon from "@parts/Icon";
import SettingsContent from "@settings/SettingsContent";
import settingsIcon from "@static/icons/settings.svg";

import styles from "./styles/Settings.module.scss";

export default function Settings() {
    const [isSettingsShown, toggleSettings] = useIsSettingsOpen();

    return (
        <>
            <Icon onClick={toggleSettings} src={settingsIcon} link containerClassName={styles.iconContainer} />
            <SettingsContent isVisible={isSettingsShown} onClose={toggleSettings} />
        </>
    );
}
