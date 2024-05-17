import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import ChangeBlockchainRadioButtonGroup from "./components/ChangeBlockchainRadioButtonGroup";
import FeeInfo from "./components/FeeInfo";
import LastBlockInfo from "./components/LastBlockInfo";
import TrackingRadioButtonGroup from "./components/TrackingRadioButtonGroup";
import styles from "./styles/Popup.module.scss";

function Popup() {
    const [isMainnet, setIsMainnet] = useState(true);
    const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);

    useEffect(() => {
        chrome.storage.local.get(["isTrackingEnabled", "isMainnet"]).then((result) => {
            setIsTrackingEnabled(result.isTrackingEnabled || false);
            setIsMainnet(result.isMainnet || true);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={styles.container}>
            <TrackingRadioButtonGroup
                isTrackingEnabled={isTrackingEnabled}
                setTrackingEnabled={setIsTrackingEnabled}
                isMainnet={isMainnet}
            />
            <ChangeBlockchainRadioButtonGroup
                isTrackingEnabled={isTrackingEnabled}
                setIsMainnet={setIsMainnet}
                isMainnet={isMainnet}
            />
            <FeeInfo />
            <LastBlockInfo />
        </div>
    );
}

const root = createRoot(document.querySelector("#root")!);

root.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);
