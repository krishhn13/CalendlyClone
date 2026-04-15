import { BrowserRouter, Routes, Route } from "react-router-dom";

import CalendarPage from "./pages/CalendarPage";
import CreateEventPage from "./pages/CreateEventPage";
import DashboardPage from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/create" element={<CreateEventPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;