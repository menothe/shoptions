import { useContext } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Placeholder from "../images/placeholder-image.jpg";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts";

export default function ListingCard({ listing }) {
  const { category, description, startingPrice, title, listingID } = listing;
  const editListingUrl = `/edit-listing/${listingID}`;
  const viewListingUrl = `/view-listing/${listingID}`;
  const isSellersDashboard = window.location.href.includes("sellers-dashboard");

  return (
    <Link
      to={isSellersDashboard ? editListingUrl : viewListingUrl}
      style={{ textDecoration: "none" }}
    >
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
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}
