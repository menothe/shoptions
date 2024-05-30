import { useEffect, useContext } from "react";
import FuzzySearch from "../../FuzzySearch";
import ListingCard from "../../ListingCard";
import { ListingContext } from "../../../contexts";
import { fetchAllListings } from "../../../helpers/utils";

export default function HomePage() {
  const [listings, setListings] = useContext(ListingContext);

  useEffect(() => {
    const sessionStorageListings = JSON.parse(
      window.sessionStorage.getItem("listings")
    );
    if (!sessionStorageListings?.length) {
      fetchAllListings(setListings);
    } else {
      setListings(sessionStorageListings);
    }
  }, []);

  return (
    <div>
      <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        <FuzzySearch />
      </div>
      {window.sessionStorage.getItem("listings") ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              fontSize: 100,
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              margin: "0 20px",
            }}
          >
            {listings.map((listing) => {
              return <ListingCard key={listing.listingID} listing={listing} />;
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
