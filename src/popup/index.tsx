import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import WithMainContext from "@context/WithMainContext";

import Popup from "./Popup";

const root = createRoot(document.querySelector("#root")!);

root.render(
    <StrictMode>
        <WithMainContext>
            <Popup />
        </WithMainContext>
    </StrictMode>
);
