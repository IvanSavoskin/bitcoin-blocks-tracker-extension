import { useEffect, useState } from "react";

import { sendMessage } from "@coreUtils/utils";
import { ChangeBlockchainBackgroundMessage } from "@models/types";

import mainStyles from "./styles/Main.module.scss";
import styles from "./styles/RadioButtons.module.scss";

export default function ChangeBlockchainRadioButtonGroup() {
    const [isMainnet, setIsMainnet] = useState(true);

    const changeBlockchain = (_isMainnet: boolean) => {
        setIsMainnet(_isMainnet);
        sendMessage<ChangeBlockchainBackgroundMessage>({
            target: "background",
            data: {
                isMainnet: _isMainnet
            },
            type: "changeBlockchain"
        });
        chrome.storage.local.set({ isMainnet: _isMainnet });
    };

    useEffect(() => {
        chrome.storage.local.get(["isMainnet"]).then((result) => {
            setIsMainnet(result.isMainnet || true);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
