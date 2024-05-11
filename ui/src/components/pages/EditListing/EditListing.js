import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../NavBar';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { ListingContext } from '../../../App';

export default function EditListing() {
    const { listingID } = useParams();
    const [listings, setListings] = useContext(ListingContext);
    const listing = listings.filter(listing => listing.ListingID === listingID)[0];
    const [editedListing, setEditedListing] = useState(listing);
    console.log("edited listing: ", editedListing);
    // debugger;

    const handleListingFieldChange = (e, field) => {
        e.preventDefault();
        setEditedListing({ ...editedListing, [field]: e.target.value });
    }

    return (
        <>
            <NavBar loggedIn={true} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <TextField id="standard-basic" label="Title" variant="standard" sx={{ marginBottom: "20px" }} value={editedListing?.Title} onChange={(e) => handleListingFieldChange(e, "Title")} />
                <FormControl sx={{ width: "10%", margin: "20px" }}>
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={editedListing?.Category}
                        label="Category"
                        onChange={(e) => handleListingFieldChange(e, "Category")}
                    >
                        <MenuItem value={"books"}>Books</MenuItem>
                        <MenuItem value={"electronics"}>Electronics</MenuItem>
                        <MenuItem value={"collectibles"}>Collectibles</MenuItem>
                        <MenuItem value={"apparel"}>Apparel</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    id="outlined-multiline-static"
                    label="Description"
                    rows={4}
                    value={editedListing?.Description}
                    onChange={(e) => handleListingFieldChange(e, "Description")}
                />
                <div className="field price" style={{ marginTop: 10, display: "flex" }}>
                    <TextField
                        label="Starting Price"
                        value={listing?.StartingPrice}
                        name="price"
                        id="formatted-numberformat-input"
                        InputProps={{
                            inputComponent: NumericFormatCustom,
                        }}
                        variant="standard"
                        required
                    />
                </div>
                <FormControl variant='standard' required className="field duration">
                    <InputLabel id="demo-simple-select-label">Duration</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={listing?.Duration}
                        label="Duration"
                        name="duration"
                    >
                        <MenuItem value={1}>1 Day</MenuItem>
                        <MenuItem value={3}>3 Days</MenuItem>
                        <MenuItem value={5}>5 Days</MenuItem>
                        <MenuItem value={7}>7 Days</MenuItem>
                    </Select>
                    <FormHelperText>Select listing duration</FormHelperText>
                </FormControl>
            </div>
        </>
    );
}

const NumericFormatCustom = React.forwardRef(
    function NumericFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                thousandSeparator
                valueIsNumericString
                prefix="$"
            />
        );
    },
);