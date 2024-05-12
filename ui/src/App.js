import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import SignUpPage from './components/pages/SignUpPage/SignUpPage';
import SignInPage from './components/pages/SignInPage/SignInPage';
import EditListingPage from './components/pages/EditListingPage/EditListingPage';
import SellersDashboardPage from './components/pages/SellersDashboardPage/SellersDashboardPage';
import { useState, createContext } from 'react';
import HomePage from './components/pages/HomePage/HomePage';

export const ListingContext = createContext();


function App() {
  const [listings, setListings] = useState([]);
  return (
    <ListingContext.Provider value={[listings, setListings]}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage loggedIn={false} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<SignInPage />} />
          <Route path="/logout" element={<NavBar loggedIn={false} />} />
          <Route path="/sellers-dashboard" element={<SellersDashboardPage />} />
          <Route path="/edit-listing/:listingID" element={<EditListingPage />} />
        </Routes>
      </Router>
    </ListingContext.Provider>
  );
}

export default App;
