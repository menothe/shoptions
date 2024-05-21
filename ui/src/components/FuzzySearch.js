import React, { useContext, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { fetchListingsByUserSearch } from "../helpers/utils";
import { useNavigate } from "react-router-dom";
import { SearchResultsContext } from "../contexts";

const FuzzySearch = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useContext(SearchResultsContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleFuzzySearch = (e, query) => {
    e.preventDefault();
    fetchListingsByUserSearch(query, setSearchResults);
    navigate("/sch");
  };

  const inputStyles = {
    width: "40vw",
    outline: "none",
    height: "1.5vw",
    fontSize: "16px",
  };

  const boxStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
    bottom: "20px",
    marginLeft: "5px",
  };

  const textFieldAndButtonContainerStyles = {
    display: "flex",
    alignItems: "center",
  };

  return (
    <div style={{ margin: "20px 0px", display: "flex", alignItems: "center" }}>
      <h3>Search for items:</h3>
      <Box
        onSubmit={(e) => handleFuzzySearch(e, query)}
        component="form"
        noValidate
        sx={boxStyles}
      >
        <Box sx={textFieldAndButtonContainerStyles}>
          <TextField
            margin="normal"
            fullWidth
            id="search"
            label="Shop"
            name="search"
            autoFocus
            onChange={(e) => handleInputChange(e)}
            sx={inputStyles}
            value={query}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              width: "10vw",
              position: "relative",
              top: "20px",
              marginLeft: "5px",
            }}
          >
            Search
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default FuzzySearch;
