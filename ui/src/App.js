import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import SignUpPage from "./components/pages/SignUpPage/SignUpPage";
import LoginPage from "./components/pages/LoginPage/LoginPage";
import EditListingPage from "./components/pages/EditListingPage/EditListingPage";
import SellersDashboardPage from "./components/pages/SellersDashboardPage/SellersDashboardPage";
import { useState, useEffect } from "react";
import HomePage from "./components/pages/HomePage/HomePage";
import ViewListingPage from "./components/pages/ViewListingPage/ViewListingPage";
import {
  RouteHistoryProvider,
  UserContext,
  ListingContext,
  SearchResultsContext,
} from "./contexts";
import SearchResultsPage from "./components/pages/SearchResultsPage/SearchResultsPage";

function App() {
  const [listings, setListings] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (document.cookie.length) {
      setLoggedIn(true);
    }
    /*
    return statement/AKA component unmount:
    we will return a function which will grab all the data
    from context and store it in session storage.
    */
  }, []);

  return (
    <UserContext.Provider value={[loggedIn, setLoggedIn]}>
      <ListingContext.Provider value={[listings, setListings]}>
        <SearchResultsContext.Provider
          value={[searchResults, setSearchResults]}
        >
          <Router>
            <RouteHistoryProvider>
              <NavBar loggedIn={loggedIn} />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/sch" element={<SearchResultsPage />} />
                <Route
                  path="/sellers-dashboard"
                  element={<SellersDashboardPage />}
                />
                <Route
                  path="/edit-listing/:listingID"
                  element={<EditListingPage />}
                />
                <Route
                  path="/view-listing/:listingID"
                  element={<ViewListingPage />}
                />
              </Routes>
            </RouteHistoryProvider>
          </Router>
        </SearchResultsContext.Provider>
      </ListingContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
