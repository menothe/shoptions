import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Placeholder from '../images/placeholder-image.jpg';
import { Link } from 'react-router-dom';

export default function ActionAreaCard({ listing }) {
    const { Category, Description, StartingPrice, Title, ListingID } = listing;
    const editListingUrl = `/edit-listing/${ListingID}`;
    return (
        <Link to={editListingUrl} style={{ textDecoration: 'none' }}>
            <Card sx={{ maxWidth: 345, margin: "20px", height: 300 }}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="140"
                        image={Placeholder}
                        alt="image placeholder"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {Title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {Description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Link>
    );
}