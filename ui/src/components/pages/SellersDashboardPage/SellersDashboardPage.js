import FormDialog from "../../FormDialog";
import { useContext, useEffect, useState } from "react";
import { getCurrentTimePlusNumberOfDays } from "../../../helpers/utils";
import axios from "axios";
import ListingCard from "../../ListingCard";
import {
  SERVER_HOST,
  GET_ALL_LISTINGS,
  CREATE_LISTING,
  GET_USER_LISTINGS,
} from "../../../constants";
import { ListingContext } from "../../../App";

const SellersDashboardPage = () => {
  const getUserListingsEndpoint = SERVER_HOST + GET_USER_LISTINGS;
  const [listings, setListings] = useContext(ListingContext);

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

  const handleCreateListing = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const { duration, title, description, price, category } = formJson;
    const listingEndTime = getCurrentTimePlusNumberOfDays(parseInt(duration));
    const newListingRequestBody = {
      title,
      description,
      starting_price: parseFloat(price.slice(1)), //remove the "$" from the field
      category,
      end_time: listingEndTime.toISOString(),
      duration: parseInt(duration),
    };
    axios
      .post(SERVER_HOST + CREATE_LISTING, newListingRequestBody, {
        withCredentials: true, // include credentials in the request
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setListings([...listings, response.data]);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const styles = {
    marginLeft: 20,
    marginTop: 20,
  };
  return (
    <div>
      <div style={{ ...styles }}>
        <h1>Listings</h1>
        <FormDialog handleSubmitListing={handleCreateListing} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}>
          {listings.map((listing, index) => {
            return <ListingCard key={index} listing={listing} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SellersDashboardPage;
