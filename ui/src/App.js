import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import SignUpPage from './components/pages/SignUpPage/SignUpPage';
import LoginPage from './components/pages/LoginPage/LoginPage';
import EditListingPage from './components/pages/EditListingPage/EditListingPage';
import SellersDashboardPage from './components/pages/SellersDashboardPage/SellersDashboardPage';
import { useState, createContext, useEffect } from 'react';
import HomePage from './components/pages/HomePage/HomePage';
import { CookiesProvider, useCookies } from 'react-cookie'

export const ListingContext = createContext();
export const UserContext = createContext();


function App() {
  const [listings, setListings] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);


  return (
    <UserContext.Provider value={[loggedIn, setLoggedIn]}>
      <ListingContext.Provider value={[listings, setListings]}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sellers-dashboard" element={<SellersDashboardPage />} />
            <Route path="/edit-listing/:listingID" element={<EditListingPage />} />
          </Routes>
        </Router>
      </ListingContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
