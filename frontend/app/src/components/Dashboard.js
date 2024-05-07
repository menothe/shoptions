import NavBar from './NavBar';
import FormDialog from './FormDialog';
import { useContext, useEffect, useState } from 'react';
import { getCurrentTimePlusNumberOfDays } from '../helpers/utils';
import axios from 'axios';
import ActionAreaCard from './ListingCard';
import { SERVER_HOST, GET_ALL_LISTINGS, CREATE_LISTING } from '../constants';
import { ListingContext } from '../App';

const Dashboard = () => {
    const getAllListingsEndpoint = SERVER_HOST + GET_ALL_LISTINGS;
    const [listings, setListings] = useContext(ListingContext);

    useEffect(() => {
        axios.get(getAllListingsEndpoint, {
            withCredentials: true,
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                setListings(response.data);
            })
            .catch(e => {
                console.error("err: ", e);
            })
    }, []);

    const handleCreateListing = event => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const listingEndTime = getCurrentTimePlusNumberOfDays(parseInt(formJson.duration))
        const newListingRequestBody = {
            title: formJson.title,
            description: formJson.description,
            starting_price: parseFloat(formJson.price.slice(1)), //remove the "$" from the field
            category: formJson.category,
            end_time: listingEndTime.toISOString(),
        };
        axios.post(SERVER_HOST + CREATE_LISTING, newListingRequestBody, {
            withCredentials: true, // include credentials in the request
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                setListings([...listings, response.data]);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const styles = {
        marginLeft: 20,
        marginTop: 20,
    }
    return (
        <div>
            <NavBar loggedIn={true} />
            <div style={{ ...styles }}>
                <h1>Listings</h1>
                <FormDialog handleSubmitListing={handleCreateListing} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}>
                    {listings.map((listing, index) => {
                        return <ActionAreaCard key={index} listing={listing} />;
                    })}
                </div>
            </div>
        </div>
    )
}

export default Dashboard;