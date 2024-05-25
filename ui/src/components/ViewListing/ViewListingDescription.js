import { Item } from "../../helpers/utils";

export default function ViewListingDescription({ description }) {
  return (
    <Item
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        fontSize: "1.075rem",
      }}
    >
      {description}
    </Item>
  );
}
