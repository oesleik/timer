import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { HashRouter, Route, Routes } from "react-router";
import "./index.css"

import { ModeSelectionRoute } from "./routes/ModeSelectionRoute.tsx";
import { ModeSelectConfigRoute } from "./routes/ModeSelectConfigRoute.tsx";
import { TimerControlRoute } from "./routes/TimerControlRoute.tsx";
import { ChromeCastReceiverRoute } from "./routes/ChromeCastReceiverRoute.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<HashRouter>
			<Routes>
				{/* Sender */}
				<Route index element={<ModeSelectionRoute />} />
				<Route path="/mode/:mode" element={<ModeSelectConfigRoute />} />
				<Route path="/timer/:mode" element={<TimerControlRoute />} />

				{/* Receiver */}
				<Route path="/receiver" element={<ChromeCastReceiverRoute />} />
			</Routes>
		</HashRouter>
	</StrictMode>,
)
