import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../../NavBar';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { NumericFormat } from 'react-number-format';
import { ListingContext } from '../../../App';

export default function EditListing() {
    const { listingID } = useParams();
    const [listings, setListings] = useContext(ListingContext);
    const listing = listings.filter(listing => listing.ListingID === listingID)[0];

    return (
        <>
            <NavBar loggedIn={true} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <TextField id="standard-basic" label="Title" variant="standard" sx={{ marginBottom: "20px" }} />
                <FormControl sx={{ width: "10%", margin: "20px" }}>
                    <InputLabel id="demo-simple-select-label">Age</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={}
                        label="Age"
                    // onChange={handleChange}
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    id="outlined-multiline-static"
                    label="Description"
                    multiline
                    rows={4}
                    defaultValue="Default Value" //TODO: replace with listing data
                />
                <div className="field price" style={{ marginTop: 10, display: "flex" }}>
                    <TextField
                        label="Starting Price"
                        value={42}
                        onChange={() => console.log("hello")}
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
                        // value={durationData.duration}
                        label="Duration"
                        // onChange={handleChangeDuration}
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