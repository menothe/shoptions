import { useParams } from "react-router-dom";
import { ListingContext } from "../../../App";
import { useContext } from "react";

export default function ViewListingPage() {
    const { listingID } = useParams();
    const [listings, setListings] = useContext(ListingContext);
    console.log("listing from vlp ", listings)
  return <h1>View Listing</h1>;
}
