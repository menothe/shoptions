import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import SignUp from './components/pages/SignUp';
import SignIn from './components/pages/SignIn';
import Dashboard from './components/Dashboard';
import EditListing from './components/pages/EditListing/EditListing';
import { useState, createContext } from 'react';

export const ListingContext = createContext();


function App() {
  const [listings, setListings] = useState([]);
  return (
    <ListingContext.Provider value={[listings, setListings]}>
      <Router>
        <Routes>
          <Route path="/" element={<NavBar loggedIn={false} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/logout" element={<NavBar loggedIn={false} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit-listing/:listingID" element={<EditListing />} />
        </Routes>
      </Router>
    </ListingContext.Provider>
  );
}

export default App;
