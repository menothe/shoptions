import React, { useState } from 'react';
import Fuse from 'fuse.js';

const FuzzySearch = ({ data }) => {
    const [query, setQuery] = useState('');

    // Configure Fuse.js options
    const options = {
        keys: ['name', 'description'], // Fields to search in
        threshold: 0.3, // Fuzziness threshold
    };

    const fuse = new Fuse(data, options);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const results = fuse.search(query);

    const inputStyles = {
        margin: "20px",
        width: "40vw",
        outline: "none", 
        height: "1.5vw", 
        fontSize: "16px",
    }

    return (
        <div style={{ margin: "20px 0px", display:"flex", alignItems:"center" }}>
            <h3>Search for items:</h3>
            <input type="text" value={query} onChange={handleInputChange} style={inputStyles}/>
            {/* <ul>
                {results.map((result, index) => (
                    <li key={index}>{result.name}</li>
                ))}
            </ul> */}
        </div>
    );
};

export default FuzzySearch;