import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ListingContext, UserContext } from "../../../contexts";
import {
  fetchAllListings,
  fetchBidsSummaryForListing,
  fetchHighestBidder,
  submitUserBid,
} from "../../../helpers/utils";
import HighestBidder from "../../HighestBidder";
import ViewListingTitle from "../../ViewListing/ViewListingTitle";
import ViewListingDescription from "../../ViewListing/ViewListingDescription";
import ViewListingBidCount from "../../ViewListing/ViewListingBidCount";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ViewListingPhotoGrid from "../../ViewListing/ViewListingPhotoGrid";
import ViewListingDetails from "../../ViewListing/ViewListingDetails/ViewListingDetails";

export default function ViewListingPage() {
  const loggedIn = useContext(UserContext)[0];
  const [bidAmount, setBidAmount] = useState(0);
  const navigate = useNavigate();
  const { listingID } = useParams();
  const [listings, setListings] = useContext(ListingContext);
  let listing = listings.filter((item) => item.listingID === listingID)[0];
  const {
    title,
    description,
    category,
    startingPrice,
    duration,
    endTime,
    seller,
    bidCount,
  } = listing ?? {};
  const [highestBidder, setHighestBidder] = useState(null);
  // const isHighestBidder = highestBidder === userID;

  useEffect(() => {
    if (window.sessionStorage.length) {
      setListings(JSON.parse(window.sessionStorage.getItem("listings")));
    } else if (listings.length) {
      window.sessionStorage.setItem("listings", JSON.stringify(listings));
    } else {
      fetchAllListings(setListings);
    }
    fetchHighestBidder(listingID, setHighestBidder);
  }, []);

  useEffect(() => {
    // Set up the interval
    const bidSummaryPoll = setInterval(
      () => fetchBidsSummaryForListing(listingID, listings, setListings),
      10000
    ); // 3000ms = 3 second

    // Clean up the interval on component unmount
    return () => {
      clearInterval(bidSummaryPoll);
    };
  }, [listing]);

  const handleSubmitBid = (e) => {
    e.preventDefault();
    if (!loggedIn) {
      navigate("/login");
    } else {
      submitUserBid(bidAmount, listingID, setBidAmount);
    }
  };

  const handleBidAmountChange = (e) => {
    setBidAmount(e.target.value);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: "70%",
        ml: "auto",
        mr: "auto",
        mt: "5vw",
      }}
    >
      <Grid container spacing={2} sx={{ flexDirection: "column" }}>
        <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
          <ViewListingTitle title={title} />
          <Grid sx={{ display: "flex", ml: 7 }}>
            <ViewListingBidCount bidCount={bidCount} />
          </Grid>
        </Grid>
        <ViewListingDescription description={description} />
        <ViewListingPhotoGrid />
        <ViewListingDetails
          duration={duration}
          category={category}
          startingPrice={startingPrice}
          username={seller}
          endTime={endTime}
        />
        {highestBidder ? <HighestBidder /> : null}
        <input
          type="text"
          placeholder="Price"
          onChange={(e) => handleBidAmountChange(e)}
          value={bidAmount || 0}
        />
        <button onClick={handleSubmitBid}>Bid</button>
      </Grid>
    </Box>
  );
}
