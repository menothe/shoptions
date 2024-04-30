import NavBar from './NavBar';
import FormDialog from './FormDialog';
import { useState } from 'react';
import { getCurrentTimePlusNumberOfDays } from '../helpers/utils';
import axios from 'axios';
import ActionAreaCard from './ListingCard';

const Dashboard = () => {
    const [listings, setListings] = useState([]);

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
        console.log(JSON.stringify(newListingRequestBody));
        axios.post('http://localhost:8080/listing', newListingRequestBody, {
            withCredentials: true, // include credentials in the request
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                console.log("response data: ", response.data); // handle response data
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
                {/* <div>
                    {listings.map(listing => {
                        return <ActionAreaCard listing={listing} />;
                    })}
                </div> */}
            </div>
        </div>
    )
}

export default Dashboard;