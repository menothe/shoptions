import { Item } from "../../helpers/utils";

export default function ViewListingTitle({ title }) {
  return (
    <Item
      sx={{
        width: "20vw",
        height: "40px",
        justifyContent: "flex-start",
        display: "flex",
        fontSize: "1.475rem",
        lineHeight: "2.03",
        fontWeight: "bold",
      }}
    >
      {title}
    </Item>
  );
}
