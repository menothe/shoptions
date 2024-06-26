import { useContext } from "react";
import { SearchResultsContext } from "../../../contexts";
import ListingCard from "../../ListingCard";
import { List } from "@mui/material";

export default function SearchResultsPage() {
  const searchResults = useContext(SearchResultsContext)[0];
  return (
    <List>
      {searchResults.map((result) => {
        return <ListingCard key={result.ListingID} listing={result} />;
      })}
    </List>
  );
}
