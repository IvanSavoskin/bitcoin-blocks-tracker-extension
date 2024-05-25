import { useEffect, useState } from "react";

import ChangeBlockchainRadioButtonGroup from "./ChangeBlockchainRadioButtonGroup";
import FeeInfo from "./FeeInfo";
import LastBlockInfo from "./LastBlockInfo";
import TrackingRadioButtonGroup from "./TrackingRadioButtonGroup";

export default function Main() {
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
        <>
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
        </>
    );
}
