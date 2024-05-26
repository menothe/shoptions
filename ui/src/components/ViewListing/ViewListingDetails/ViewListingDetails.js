import { Item } from "../../../helpers/utils";
import ViewListingCategory from "./ViewListingCategory";
import ViewListingCountdown from "./ViewListingCountdown";
import ViewListingDuration from "./ViewListingDuration";
import ViewListingEndTime from "./ViewListingEndTime";
import ViewListingSeller from "./ViewListingSeller";
import ViewListingStartingPrice from "./ViewListingStartingPrice";

export default function ViewListingDetails({
  startingPrice,
  category,
  duration,
  endTime,
  username,
}) {
  return (
    <Item sx={{ display: "flex" }}>
      <ViewListingStartingPrice startingPrice={startingPrice} />
      <ViewListingCategory category={category} />
      <ViewListingSeller username={username}/>
      <ViewListingDuration duration={duration} />
      <ViewListingEndTime endTime={endTime} />
      <ViewListingCountdown endTime={endTime} />
    </Item>
  );
}
