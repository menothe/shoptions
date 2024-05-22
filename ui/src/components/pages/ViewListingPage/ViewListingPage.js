import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ListingContext, UserContext } from "../../../contexts";
import { fetchHighestBidder, submitUserBid } from "../../../helpers/utils";
import Countdown from "../../ListingCountDown";
import ListingCountdown from "../../ListingCountDown";
import HighestBidder from "../../HighestBidder";

export default function ViewListingPage() {
  const loggedIn = useContext(UserContext)[0];
  const [bidAmount, setBidAmount] = useState(0);
  const navigate = useNavigate();
  const { listingID } = useParams();
  const [listings, setListings] = useContext(ListingContext);
  let listing = listings.filter((item) => item.ListingID === listingID)[0];
  const { Title, Description, Category, StartingPrice, Duration, EndTime } =
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
    <div style={{ display: "flex", flexDirection: "column", margin: "20px" }}>
      <h1>View Listing</h1>
      <span>Title: {Title}</span>
      <span>Description: {Description}</span>
      <span>Category: {Category}</span>
      <span>Starting Price: {StartingPrice}</span>
      <span>Duration: {Duration}</span>
      <ListingCountdown endTime={EndTime} />
      {highestBidder ? <HighestBidder /> : null}
      <input
        type="text"
        placeholder="Price"
        onChange={(e) => handleBidAmountChange(e)}
        value={bidAmount}
      />
      <button onClick={handleSubmitBid}>Bid</button>
    </div>
  );
}
