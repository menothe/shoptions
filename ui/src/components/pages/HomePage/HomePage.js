import { useEffect, useContext } from "react";
import FuzzySearch from "../../FuzzySearch";
import { GET_ALL_LISTINGS, SERVER_HOST } from "../../../constants";
import axios from "axios";
import ListingCard from "../../ListingCard";
import { ListingContext } from "../../../contexts";

export default function HomePage() {
  const [listings, setListings] = useContext(ListingContext);
  const getUserListingsEndpoint = SERVER_HOST + GET_ALL_LISTINGS;

  useEffect(() => {
    const sessionStorageListings = JSON.parse(
      window.sessionStorage.getItem("listings")
    );
    if (!sessionStorageListings?.length) {
      axios
        .get(getUserListingsEndpoint, {
          withCredentials: true,
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setListings(response.data);
          window.sessionStorage.setItem(
            "listings",
            JSON.stringify(response.data)
          );
        })
        .catch((e) => {
          console.error("err: ", e);
        });
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
