import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/common/Navbar";
import { HomePage } from "./components/home/HomePage";

import { Toaster } from "react-hot-toast";
import CandidateDashboard from "./dashboards/candidateDashboard/CandidateDashboard";
import EditCandidateProfile from "./dashboards/candidateDashboard/EditCandidateProfile";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { LoginPage } from "./components/auth/LoginPage";
import { CandidateLogin } from "./components/auth/candidate/CandidateLogin";
import { CandidateSignup } from "./components/auth/candidate/CandidateSignup";
import { CorporateLogin } from "./components/auth/corporate/CorporateLogin";
import { CorporateSignup } from "./components/auth/corporate/CorporateSignup";
import { InterviewerLogin } from "./components/auth/Interviewer/InterviewerLogin";
import { InterviewerSignup } from "./components/auth/Interviewer/InterviewerSignup";
import InterviewerDashboard from "./dashboards/InterviewerDashboard/InterviewerDashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F3F2EF]">
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/candidate-login" element={<CandidateLogin />} />
          <Route path="/candidate-signup" element={<CandidateSignup />} />
          <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
          <Route path="/corporate-login" element={<CorporateLogin />} />
          <Route path="/corporate-signup" element={<CorporateSignup />} />

          <Route
            path="/interviewer-dashboard"
            element={<InterviewerDashboard />}
          />
          <Route path="/interviewer-login" element={<InterviewerLogin />} />
          <Route path="/interviewer-signup" element={<InterviewerSignup />} />
          <Route path="/edit-profile" element={<EditCandidateProfile />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
