import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Main from "./components/Main";
import styles from "./styles/Popup.module.scss";

function Popup() {
    return (
        <div className={styles.container}>
            <Main />
        </div>
    );
}

const root = createRoot(document.querySelector("#root")!);

root.render(
    <StrictMode>
        <Popup />
    </StrictMode>
);
