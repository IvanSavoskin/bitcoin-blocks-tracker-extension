import { FormEvent, useCallback, useEffect, useState } from "react";

import { useIsAutoFeeNotificationEnabled, useIsFeeNotificationEnabled } from "@context/MainContext";
import { translate } from "@coreUtils/localeUtils";
import { sendMessage } from "@coreUtils/messagesUtils";
import { FeeLevel } from "@models/fee/types";
import { BackgroundMessageType, MessageTarget } from "@models/messages/enums";
import { ChangeNotificationBorderBackgroundMessage } from "@models/messages/types";
import Icon from "@parts/Icon";
import clearIcon from "@static/icons/clear.svg";
import saveIcon from "@static/icons/save.svg";

import mainStyles from "../styles/SettingsTabs.module.scss";
import styles from "./styles/FeeBorderInput.module.scss";

export default function FeeBorderInput() {
    const [feeBorder, setFeeBorder] = useState<number>();
    const [initialFeeBorder, setInitialFeeBorder] = useState<number>();
    const [feeLevel, setFeeLevel] = useState(FeeLevel.SLOW);
    const [initialFeeLevel, setInitialFeeLevel] = useState(FeeLevel.SLOW);
    const [isAutoFeeNotificationEnabled, setIsAutoFeeNotificationEnabled] = useIsAutoFeeNotificationEnabled();
    const [, setIsFeeNotificationEnabled] = useIsFeeNotificationEnabled();

    const isFeeBorderChanged = feeBorder !== initialFeeBorder;
    const isFeeLevelChanged = feeLevel !== initialFeeLevel;
    const isFeeChanged = isFeeBorderChanged || isFeeLevelChanged;

    const onFeeBorderClear = useCallback(() => {
        setFeeBorder(undefined);
    }, []);

    const onFeeBorderChange = useCallback((event: FormEvent<HTMLInputElement>) => {
        const newFeeBorder = (event.target as HTMLInputElement).value;

        setFeeBorder(newFeeBorder === "" ? undefined : Number.parseInt(newFeeBorder, 10));
    }, []);

    const onFeeLevelChange = useCallback((event: FormEvent<HTMLSelectElement>) => {
        const newFeeLevel = (event.target as HTMLSelectElement).value as FeeLevel;

        setFeeLevel(newFeeLevel);
    }, []);

    const onFeeBorderSave = useCallback(() => {
        if (isFeeChanged) {
            const _feeBorder = feeBorder === undefined ? null : feeBorder;
            chrome.storage.local.set({ feeNotificationBorder: { feeBorder: _feeBorder, feeLevel } });
            sendMessage<ChangeNotificationBorderBackgroundMessage>({
                target: [MessageTarget.BACKGROUND],
                data: { feeBorder: { feeBorder: _feeBorder, feeLevel } },
                type: BackgroundMessageType.CHANGE_FEE_NOTIFICATION_BORDER
            });
            setInitialFeeBorder(feeBorder);
            setInitialFeeLevel(feeLevel);

            if (isAutoFeeNotificationEnabled && feeBorder !== undefined) {
                setIsFeeNotificationEnabled(true);
                setIsAutoFeeNotificationEnabled(false);
            } else if (feeBorder === undefined) {
                setIsFeeNotificationEnabled(false);
                setIsAutoFeeNotificationEnabled(false);
            }
        }
    }, [
        feeBorder,
        feeLevel,
        isAutoFeeNotificationEnabled,
        isFeeChanged,
        setIsAutoFeeNotificationEnabled,
        setIsFeeNotificationEnabled
    ]);

    useEffect(() => {
        chrome.storage.local.get(["feeNotificationBorder"]).then((result) => {
            const storageFeeNotificationBorder = result.feeNotificationBorder;
            const storageFeeBorder =
                storageFeeNotificationBorder?.feeBorder === null || storageFeeNotificationBorder?.feeBorder === undefined
                    ? undefined
                    : storageFeeNotificationBorder.feeBorder;
            const storageFeeLevel = storageFeeNotificationBorder?.feeLevel ?? FeeLevel.SLOW;
            setFeeBorder(storageFeeBorder);
            setInitialFeeBorder(storageFeeBorder);
            setFeeLevel(storageFeeLevel);
            setInitialFeeLevel(storageFeeLevel);
        });
    }, []);

    return (
        <div className={mainStyles.itemContainer}>
            <label className={mainStyles.label} htmlFor="fee-border-input">
                {translate("feeNotificationBorderInputLabel")}
            </label>
            <div className={styles.borderInputContainer}>
                <input
                    id="fee-border-input"
                    className={styles.borderInput}
                    value={feeBorder === undefined ? "" : feeBorder}
                    placeholder={translate("feeNotificationBorderInputPlaceholder")}
                    onInput={onFeeBorderChange}
                    type="number"
                    min={0}
                    step={1}
                />
                <select name="feeLevel" onChange={onFeeLevelChange} value={feeLevel}>
                    <option value={FeeLevel.SLOW}>{translate("slow")}</option>
                    <option value={FeeLevel.MEDIUM}>{translate("medium")}</option>
                    <option value={FeeLevel.FAST}>{translate("fast")}</option>
                </select>
                <div className={styles.iconsContainer}>
                    <Icon src={clearIcon} link onClick={onFeeBorderClear} disabled={feeBorder === undefined} />
                    <Icon src={saveIcon} link onClick={onFeeBorderSave} disabled={!isFeeChanged} />
                </div>
            </div>
        </div>
    );
}
