import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import SignUp from './components/pages/SignUp';
import SignIn from './components/pages/SignIn';
import Dashboard from './components/Dashboard';
import EditListing from './components/pages/EditListing';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NavBar loggedIn={false} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/logout" element={<NavBar loggedIn={false} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-listing" element={<EditListing />} />
      </Routes>
    </Router>
  )

}

export default App;
