// src/contexts/RouteHistoryContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const RouteHistoryContext = createContext([]);

export const RouteHistoryProvider = ({ children }) => {
  const location = useLocation();
  const [routeHistory, setRouteHistory] = useState([]);

  useEffect(() => {
    setRouteHistory((prevHistory) => {
      return [...prevHistory, location.pathname];
    });
  }, [location]);

  return (
    <RouteHistoryContext.Provider value={routeHistory}>
      {children}
    </RouteHistoryContext.Provider>
  );
};

export const useRouteHistory = () => useContext(RouteHistoryContext);

export const ListingContext = createContext();
export const UserContext = createContext();
export const SearchResultsContext = createContext();
