import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ListingContext, UserContext } from "../../../App";
import FuzzySearch from "../../FuzzySearch";
import { GET_ALL_LISTINGS, SERVER_HOST } from "../../../constants";
import axios from "axios";
import ListingCard from "../../ListingCard";

export default function HomePage() {
  const navigate = useNavigate();
  const [listings, setListings] = useContext(ListingContext);
  const [loggedIn, setLoggedIn] = useContext(UserContext);
  const getUserListingsEndpoint = SERVER_HOST + GET_ALL_LISTINGS;

  const products = [
    {
      id: 1,
      name: "Product 1",
      description: "Description of product 1",
      price: 10,
    },
    {
      id: 2,
      name: "Product 2",
      description: "Description of product 2",
      price: 20,
    },
    {
      id: 3,
      name: "Product 3",
      description: "Description of product 3",
      price: 30,
    },
    // Add more products as needed
  ];

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
        <FuzzySearch data={products[0]} />
      </div>
      {!loggedIn && !document.cookie.length ? (
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
