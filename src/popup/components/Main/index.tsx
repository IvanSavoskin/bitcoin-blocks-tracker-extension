import { translate } from "@coreUtils/localeUtils";
import FeeNotificationRadioButtonGroup from "@main/FeeNotificationRadioButtonGroup";

import BlockNotificationRadioButtonGroup from "./BlockNotificationRadioButtonGroup";
import ChangeBlockchainRadioButtonGroup from "./ChangeBlockchainRadioButtonGroup";
import FeeInfo from "./FeeInfo";
import LastBlockInfo from "./LastBlockInfo";
import styles from "./styles/Main.module.scss";

export default function Main() {
    return (
        <>
            <div>
                <h2 className={styles.header}>{translate("trackingState")}</h2>
                <div className={styles.trackingStateControllersContainer}>
                    <BlockNotificationRadioButtonGroup />
                    <FeeNotificationRadioButtonGroup />
                </div>
            </div>
            <ChangeBlockchainRadioButtonGroup />
            <FeeInfo />
            <LastBlockInfo />
        </>
    );
}
