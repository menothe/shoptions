import { useParams } from "react-router-dom";
import { ListingContext } from "../../../App";
import { useContext, useEffect } from "react";

export default function ViewListingPage() {
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
  console.log("listing: ", listing);

  const handleSubmitBid = (e) => {
    e.preventDefault();
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
