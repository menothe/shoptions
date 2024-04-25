import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<NavBar loggedIn={false} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/logout" element={<NavBar loggedIn={false} />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )

}

export default App;
