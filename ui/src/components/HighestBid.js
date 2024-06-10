import { Item } from "../helpers/utils";

export default function HighestBid({ bid }) {
  return (
    <Item>
      <h3>
        <b>${bid}</b>
      </h3>
    </Item>
  );
}
