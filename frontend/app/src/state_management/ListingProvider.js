import React, { useState } from 'react';
import ListingContext from './ListingContext';

const ListingProvider = ({ children }) => {
    const [listings, setListings] = useState([]);

    // const toggleTheme = () => {
    //     setTheme(theme === 'light' ? 'dark' : 'light');
    // };

    const value = { listings, setListings };

    return (
        <ListingContext.Provider value={value}>
            {children}
        </ListingContext.Provider>
    );
};

export default ListingProvider;