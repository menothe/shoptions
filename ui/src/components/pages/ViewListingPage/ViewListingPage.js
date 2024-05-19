import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ListingContext, UserContext } from "../../../contexts";

export default function ViewListingPage() {
  const [loggedIn, setLoggedIn] = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (window.sessionStorage.length) {
      setListings(JSON.parse(window.sessionStorage.getItem("listings")));
    } else if (listings.length) {
      window.sessionStorage.setItem("listings", listings);
    }
  }, []);
  const { listingID } = useParams();
  const [listings, setListings] = useContext(ListingContext);
  let listing = listings.filter((item) => item.ListingID === listingID)[0];
  const { Title, Description, Category, StartingPrice, Duration } =
    listing ?? {};

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
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "20px" }}>
      <h1>View Listing</h1>
      <span>{Title}</span>
      <span>{Description}</span>
      <span>{Category}</span>
      <span>{StartingPrice}</span>
      <span>{Duration}</span>
      <input type="text" placeholder="Price" />
      <button onClick={handleSubmitBid}>Bid</button>
    </div>
  );
}
