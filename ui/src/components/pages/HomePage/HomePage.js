import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import FuzzySearch from "../../FuzzySearch";
import { GET_ALL_LISTINGS, SERVER_HOST } from "../../../constants";
import axios from "axios";
import ListingCard from "../../ListingCard";
import { ListingContext, UserContext } from "../../../contexts";

export default function HomePage() {
  const [listings, setListings] = useContext(ListingContext);
  const getUserListingsEndpoint = SERVER_HOST + GET_ALL_LISTINGS;

  useEffect(() => {
    if (!window.sessionStorage.length) {
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
      setListings(JSON.parse(window.sessionStorage.getItem("listings")));
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
              return <ListingCard key={listing.ListingID} listing={listing} />;
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
