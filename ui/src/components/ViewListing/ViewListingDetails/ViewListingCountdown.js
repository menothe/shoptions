import { Item } from "../../../helpers/utils";
import ListingCountdown from "../../ListingCountDown";

export default function ViewListingCountdown({ endTime }) {
  return (
    <Item>
      <ListingCountdown endTime={endTime} />
    </Item>
  );
}
