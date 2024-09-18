import { useIsSettingsOpen } from "@context/MainContext";
import Icon from "@parts/Icon";
import SettingsContent from "@settings/SettingsContent";
import SettingsIcon from "@static/icons/settings.svg";

import styles from "./styles/Settings.module.scss";

export default function Settings() {
    const [isSettingsShown, toggleSettings] = useIsSettingsOpen();

    return (
        <>
            <Icon onClick={toggleSettings} icon={SettingsIcon} link containerClassName={styles.iconContainer} />
            <SettingsContent isVisible={isSettingsShown} onClose={toggleSettings} />
        </>
    );
}
