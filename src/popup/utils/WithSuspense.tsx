import React, { Suspense } from "react";

import Loader from "@parts/Loader";
import partsStyles from "@popupCoreStyles/base.module.scss";

interface WithSuspenseProps {
    children: React.JSX.Element | React.JSX.Element[];
}

export function WithSuspense({ children }: WithSuspenseProps): React.JSX.Element {
    return (
        <Suspense
            fallback={
                <div className={partsStyles.flexBaseCenterContainer}>
                    <Loader />
                </div>
            }
        >
            {children}
        </Suspense>
    );
}
