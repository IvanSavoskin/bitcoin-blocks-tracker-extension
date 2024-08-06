import { useEffect, useState } from "react";

import { translate } from "@coreUtils/localeUtils";
import { sendMessage } from "@coreUtils/messagesUtils";
import { BackgroundMessageType, MessageTarget } from "@models/messages/enums";
import { ChangeBlockchainBackgroundMessage } from "@models/messages/types";

import mainStyles from "./styles/Main.module.scss";
import styles from "./styles/RadioButtons.module.scss";

export default function ChangeBlockchainRadioButtonGroup() {
    const [isMainnet, setIsMainnet] = useState(true);

    const changeBlockchain = (_isMainnet: boolean) => {
        setIsMainnet(_isMainnet);
        sendMessage<ChangeBlockchainBackgroundMessage>({
            target: [MessageTarget.BACKGROUND],
            data: {
                isMainnet: _isMainnet
            },
            type: BackgroundMessageType.CHANGE_BLOCKCHAIN
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
            <h2 className={mainStyles.header}>{translate("blockchain")}</h2>
            <div className={styles.formToggle}>
                <div className={styles.formToggleItemLeft}>
                    <input
                        id="blockchain-main"
                        type="radio"
                        name="blockchain"
                        onChange={() => changeBlockchain(true)}
                        checked={isMainnet}
                    />
                    <label htmlFor="blockchain-main">{translate("mainnet")}</label>
                </div>
                <div className={styles.formToggleItemRight}>
                    <input
                        id="blockchain-test"
                        type="radio"
                        name="blockchain"
                        onChange={() => changeBlockchain(false)}
                        checked={!isMainnet}
                    />
                    <label htmlFor="blockchain-test">{translate("testnet")}</label>
                </div>
            </div>
        </div>
    );
}
