import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Placeholder from '../images/placeholder-image.jpg';

export default function ActionAreaCard() {
    return (
        <Card sx={{ maxWidth: 345, margin: "20px" }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={Placeholder}
                    alt="image placeholder"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Placeholder
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore magna
                        aliqua.
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}