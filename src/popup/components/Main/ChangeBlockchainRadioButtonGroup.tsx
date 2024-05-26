import { sendMessage } from "@coreUtils/utils";
import { BaseBackgroundMessage } from "@models/types";

import mainStyles from "./styles/Main.module.scss";
import styles from "./styles/RadioButtons.module.scss";

interface TrackingRadioButtonGroupProps {
    isMainnet: boolean;
    setIsMainnet: (isMainnet: boolean) => void;
    isTrackingEnabled: boolean;
}

export default function ChangeBlockchainRadioButtonGroup({
    isMainnet,
    setIsMainnet,
    isTrackingEnabled
}: Readonly<TrackingRadioButtonGroupProps>) {
    const changeBlockchain = (_isMainnet: boolean) => {
        setIsMainnet(_isMainnet);
        sendMessage<BaseBackgroundMessage>({
            target: "background",
            data: {
                enabled: isTrackingEnabled,
                isMainnet: _isMainnet
            },
            type: "changeBlockchain"
        });
        chrome.storage.local.set({ isMainnet: _isMainnet, isTrackingEnabled });
    };

    return (
        <div>
            <h2 className={mainStyles.header}>Blockchain</h2>
            <div className={styles.formToggle}>
                <div className={styles.formToggleItemLeft}>
                    <input
                        id="blockchain-main"
                        type="radio"
                        name="blockchain"
                        onChange={() => changeBlockchain(true)}
                        checked={isMainnet}
                    />
                    <label htmlFor="blockchain-main">Mainnet</label>
                </div>
                <div className={styles.formToggleItemRight}>
                    <input
                        id="blockchain-test"
                        type="radio"
                        name="blockchain"
                        onChange={() => changeBlockchain(false)}
                        checked={!isMainnet}
                    />
                    <label htmlFor="blockchain-test">Testnet</label>
                </div>
            </div>
        </div>
    );
}
