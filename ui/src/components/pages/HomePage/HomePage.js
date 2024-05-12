import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Link from '@mui/material/Link';
import { useNavigate } from "react-router-dom";
import { handleLogout } from '../../../helpers/utils';

export default function HomePage({ loggedIn }) {
    const navigate = useNavigate();

    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Shoptions
                        </Typography>
                        {!loggedIn && <div>
                            <Link href="/signup" color="inherit">
                                <Button color="inherit">Signup</Button>
                            </Link>
                            <Link href="/login" color="inherit">
                                <Button color="inherit">Login</Button>
                            </Link>
                        </div>}
                        {loggedIn && <Link href="/" color="inherit">
                            <Button onClick={() => handleLogout(navigate)} color="inherit">Logout</Button>
                        </Link>}
                    </Toolbar>
                </AppBar>
            </Box>
            {!loggedIn ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
                    <h1 style={{ fontSize: 100 }}>Welcome</h1>
                </div>
            ) : null}
        </div>
    );
}