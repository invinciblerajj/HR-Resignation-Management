import React from "react";
import { BrowserRouter as Router,Routes , Route } from "react-router-dom";
import Login from "./Login.jsx";
import UserLogin from "./UserLogin.jsx";
import AdminLogin from "./AdminLogin.jsx";
import UserDashboard from "./UserDashboard.jsx";
import SubmitResignation from "./SubmitResignation.jsx";
import UserHome from "./UserHome.jsx";
import HRDashboard from "./HRDashboard.jsx";
import HRHome from "./HRHome.jsx";
import ResignationRequests from "./ResignationRequest.jsx";
import ResignStatus from "./ResignStatus.jsx";
import ExitQuestionnaire from "./ExitQuestionnaire.jsx";
import ExitResponse from "./ExitResponse.jsx";
import Logout from "./Logout.jsx";
import UserRegister from "./UserRegister.jsx";
import EmpName from "./EmpName.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/api/auth/login" element={<UserLogin />} />
        <Route path="/api/auth/admin-login" element={<AdminLogin />} />
        <Route path="/api/auth/register" element= {<UserRegister/>}></Route>

        {/* This is User Dashboard and its Route */}
        <Route path="/api/user" element={<UserDashboard />}>
            <Route index element={<UserHome/>}></Route>
            <Route path="home" element={<UserHome/>}/>
            <Route path="resign" element={<SubmitResignation/>}/>
            <Route path="resign_status" element={<ResignStatus/>}/>
            <Route path="responses" element={<ExitQuestionnaire/>}></Route>
            <Route path='logout' element={<Logout/>}></Route>
        </Route>
        {/* HR Dashboard with Default Home */}
        <Route path="/api/admin" element={<HRDashboard />}>
          <Route index element={<HRHome />} />  {/* Default Home Page */}
          <Route path="home" element={<HRHome />} />
          <Route path="resignations" element={<ResignationRequests />} />
          <Route path="exit_responses" element={<ExitResponse/>}></Route>
          <Route path="employees" element={<EmpName/>}></Route>
          <Route path='logout' element={<Logout/>}></Route>
          
          {/* Add other HR pages like Employees, Resignations, etc. */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
