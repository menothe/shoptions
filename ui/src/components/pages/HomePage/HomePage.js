import * as React from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from '../../NavBar';
import { UserContext } from '../../../App';
import FuzzySearch from '../../FuzzySearch';

export default function HomePage() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = React.useContext(UserContext);

    const products = [
        { id: 1, name: 'Product 1', description: 'Description of product 1', price: 10 },
        { id: 2, name: 'Product 2', description: 'Description of product 2', price: 20 },
        { id: 3, name: 'Product 3', description: 'Description of product 3', price: 30 },
        // Add more products as needed
    ];

    return (
        <div>
            <NavBar loggedIn={loggedIn} />
            <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
                <FuzzySearch data={products[0]} />
            </div>
            {!loggedIn && !document.cookie.length ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
                    <h1 style={{ fontSize: 100 }}>Hello</h1>
                </div>
            ) : null}
        </div>
    );
}