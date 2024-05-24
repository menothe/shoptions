import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ListingContext, UserContext } from "../../../contexts";
import {
  Item,
  fetchHighestBidder,
  submitUserBid,
} from "../../../helpers/utils";
import ListingCountdown from "../../ListingCountDown";
import HighestBidder from "../../HighestBidder";
import ViewListingHeader from "../../ViewListing/ViewListingHeader";
import ViewListingTitle from "../../ViewListing/ViewListingTitle";
import ViewListingDescription from "../../ViewListing/ViewListingDescription";
import ViewListingStartingPrice from "../../ViewListing/ViewListingDetails/ViewListingStartingPrice";
import ViewListingDuration from "../../ViewListing/ViewListingDetails/ViewListingDuration";
import ViewListingEndTime from "../../ViewListing/ViewListingDetails/ViewListingEndTime";
import ViewListingCountdown from "../../ViewListing/ViewListingDetails/ViewListingCountdown";
import ViewListingCategory from "../../ViewListing/ViewListingDetails/ViewListingCategory";
import ViewListingBidCount from "../../ViewListing/ViewListingBidCount";
import ViewListingPlaceBid from "../../ViewListing/ViewListingPlaceBid";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ViewListingPhotoGrid from "../../ViewListing/ViewListingPhotoGrid";
import ViewListingDetails from "../../ViewListing/ViewListingDetails/ViewListingDetails";

export default function ViewListingPage() {
  const loggedIn = useContext(UserContext)[0];
  const [bidAmount, setBidAmount] = useState(0);
  const navigate = useNavigate();
  const { listingID } = useParams();
  const [listings, setListings] = useContext(ListingContext);
  let listing = listings.filter((item) => item.ListingID === listingID)[0];
  const { title, description, category, startingPrice, duration, endTime } =
    listing ?? {};
  const [highestBidder, setHighestBidder] = useState(null);
  // const isHighestBidder = highestBidder === userID;

  useEffect(() => {
    if (window.sessionStorage.length) {
      setListings(JSON.parse(window.sessionStorage.getItem("listings")));
    } else if (listings.length) {
      window.sessionStorage.setItem("listings", listings);
    }
    fetchHighestBidder(listingID, setHighestBidder);
  }, []);
  const handleSubmitBid = (e) => {
    e.preventDefault();
    if (!loggedIn) {
      navigate("/login");
    } else {
      //TODO: CALL BACKEND 'BID' ENDPOINT
      //POST CALL:
      /**
       * USERID, LISTINGID, BIDAMOUNT
       *
       */
      submitUserBid(bidAmount, listingID, setBidAmount);
    }
  };

  const handleBidAmountChange = (e) => {
    setBidAmount(e.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1, border: "1px solid red" }}>
      <Grid container spacing={2} sx={{ flexDirection: "column" }}>
        <ViewListingHeader header={"View Listing"} />
        <Grid sx={{ display: "flex", marginLeft: "5vw" }}>
          <ViewListingTitle title={title} />
          <Grid sx={{ display: "flex" }}>
            <ViewListingBidCount />
            <ViewListingPlaceBid />
          </Grid>
        </Grid>
        <ViewListingDescription description={description} />
        <ViewListingPhotoGrid />
        <ViewListingDetails
          duration={duration}
          category={category}
          startingPrice={startingPrice}
        />
        <ListingCountdown endTime={endTime} />
        {highestBidder ? <HighestBidder /> : null}
        <input
          type="text"
          placeholder="Price"
          onChange={(e) => handleBidAmountChange(e)}
          value={bidAmount}
        />
        <button onClick={handleSubmitBid}>Bid</button>
      </Grid>
    </Box>
  );
}

// <Grid item xs={8}>
