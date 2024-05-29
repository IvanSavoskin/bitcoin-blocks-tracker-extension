import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Main from "@main/index";
import Settings from "@settings/index";

import WithMainContext from "./context/WithMainContext";
import styles from "./styles/Popup.module.scss";

function Popup() {
    return (
        <WithMainContext>
            <div className={styles.container}>
                <Settings />
                <Main />
            </div>
        </WithMainContext>
    );
}

const root = createRoot(document.querySelector("#root")!);

root.render(
    <StrictMode>
        <Popup />
    </StrictMode>
);
