import { useState } from "react";
import { Routes, Route,Link } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Site from "./scenes/Site";
import Contacts from "./scenes/contacts";
import FAQ from "./scenes/faq";
import Communication from "./scenes/communication";
import Notification from "./scenes/Notification";
import HelpSupport from "./scenes/HelpSupport";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import DailyReport from "./scenes/DailyReport";
import IncidentReport from "./scenes/IncidentReport";
import Announcement from "./scenes/Announcement";
import ScheduledJob from "./scenes/ScheduldedJob";
import UserProfile from "./scenes/UserProfile";

function Dash() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                {/* <Link to="/Dash/team">Team</Link> */}
                {/* <Route path="/Schedule" element={<Contacts />} /> */}
                <Route path="/Schedule" element={<ScheduledJob/>} />
                <Route path="/Site" element={<Site />} />
                <Route path="/Announcement" element={<Announcement/>} />
                <Route path="/DailyReport" element={<DailyReport/>} />
                <Route path="/IncidentReport" element={<IncidentReport/>} />
                <Route path="/Communication" element={<Communication />} />
                <Route path="/UserProfile" element={<UserProfile/>} />
                <Route path="/Notification" element={<Notification />} />
                <Route path="/HelpSupport" element={<HelpSupport />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/faq" element={<FAQ />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default Dash;
