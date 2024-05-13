import * as React from 'react';
import { useNavigate } from "react-router-dom";
import NavBar from '../../NavBar';
import { UserContext } from '../../../App';

export default function HomePage() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = React.useContext(UserContext)

    return (
        <div>
            <NavBar loggedIn={loggedIn} />
            {!loggedIn ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
                    <h1 style={{ fontSize: 100 }}>Welcome</h1>
                </div>
            ) : null}
        </div>
    );
}