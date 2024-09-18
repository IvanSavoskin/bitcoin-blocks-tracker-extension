import "@popupCoreStyles/theme.scss";

import { useEffect } from "react";

import { useTheme } from "@context/MainContext";
import Main from "@main/index";
import Settings from "@settings/index";

import styles from "./styles/Popup.module.scss";

export default function Popup() {
    const [theme] = useTheme();

    useEffect(() => {
        document.body.classList.add(theme);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.container}>
            <Settings />
            <Main />
        </div>
    );
}
