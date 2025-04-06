import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HashRouter, Route, Routes } from "react-router";
import "./index.css"

import { ChromeCastReceiverRoute } from "./routes/ChromeCastReceiverRoute.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<HashRouter>
			<Routes>
				<Route index element={<ChromeCastReceiverRoute />} />
			</Routes>
		</HashRouter>
	</StrictMode>,
)
