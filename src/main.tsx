import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css"
import { ModeSelectionRoute } from "./routes/ModeSelectionRoute.tsx";
import { TimerRoute } from "./routes/TimerRoute.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<ModeSelectionRoute />} />
			<Route path="/timer/:mode" element={<TimerRoute />} />
		</Routes>
	</BrowserRouter>
  </StrictMode>,
)
