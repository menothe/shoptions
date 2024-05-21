import { useEffect, useState } from "react";
import { getCurrentTimePlusNumberOfDays } from "../../../helpers/utils";
import axios from "axios";
import ListingCard from "../../ListingCard";
import {
  SERVER_HOST,
  GET_ALL_LISTINGS,
  CREATE_LISTING,
  GET_USER_LISTINGS,
} from "../../../constants";
import CreateNewListingModal from "../../CreateNewListingModal";

const SellersDashboardPage = () => {
  const getUserListingsEndpoint = SERVER_HOST + GET_USER_LISTINGS;
  const [sellerListings, setSellerListings] = useState([]);

  useEffect(() => {
    if (!window.sessionStorage.sellerListings) {
      axios
        .get(getUserListingsEndpoint, {
          withCredentials: true,
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("are we getting the listings: ", response.data);
          setSellerListings(response.data);
          window.sessionStorage.setItem(
            "sellerListings",
            JSON.stringify(response.data)
          );
        })
        .catch((e) => {
          console.error("err: ", e);
        });
    } else {
      setSellerListings(
        JSON.parse(window.sessionStorage.getItem("sellerListings"))
      );
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
        setSellerListings([...sellerListings, response.data]);
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
        <CreateNewListingModal handleSubmitListing={handleCreateListing} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}>
          {sellerListings &&
            sellerListings.map((listing, index) => {
              return <ListingCard key={index} listing={listing} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default SellersDashboardPage;
