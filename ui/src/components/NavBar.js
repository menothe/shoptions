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
import { handleLogout } from '../helpers/utils';
import { Menu, MenuItem } from '@mui/material';
import { UserContext } from '../App';

export default function NavBar() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = React.useContext(UserContext);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuItemRouting = route => {
        navigate(route);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }


    //     <Button
    //     id="basic-button"
    //     aria-controls={open ? 'basic-menu' : undefined}
    //     aria-haspopup="true"
    //     aria-expanded={open ? 'true' : undefined}
    //     onClick={handleClick}
    //   >
    //     Dashboard
    //   </Button>
    //   <Menu
    //     id="basic-menu"
    //     anchorEl={anchorEl}
    //     open={open}
    //     onClose={handleClose}
    //     MenuListProps={{
    //       'aria-labelledby': 'basic-button',
    //     }}
    //   >
    //     <MenuItem onClick={handleClose}>Profile</MenuItem>
    //     <MenuItem onClick={handleClose}>My account</MenuItem>
    //     <MenuItem onClick={handleClose}>Logout</MenuItem>
    //   </Menu>

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
                            <MenuIcon
                                id="hamburger"
                                onClick={handleClick}
                            />
                            <Menu
                                id="hamburger"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                            >
                                {loggedIn ? <MenuItem onClick={() => handleMenuItemRouting("/sellers-dashboard")}>Sellers Dashboard</MenuItem> : null}
                            </Menu>
                        </IconButton>
                        <div onClick={() => navigate("/")} style={{ width: "90vw", cursor: "pointer" }}>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Shoptions
                            </Typography>
                        </div>
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
        </div>
    );
}