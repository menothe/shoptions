import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { NumericFormat } from "react-number-format";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";
import InputFileUpload from "./FileUpload";
import { formatDate, getCurrentTimePlusNumberOfDays } from "../helpers/utils";

export default function CreateNewListingModal({ handleSubmitListing }) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState({
    value: "",
  });
  const [category, setCategory] = React.useState("");
  const [durationData, setDuration] = React.useState({
    duration: 0,
    listingEndTime: formatDate(getCurrentTimePlusNumberOfDays(1)),
  });

  const handleChangeDuration = (event) => {
    setDuration({
      duration: event.target.value,
      listingEndTime: formatDate(
        getCurrentTimePlusNumberOfDays(event.target.value)
      ),
    });
  };

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePrice = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create New Listing
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: "50%" },
          component: "form",
          onSubmit: (event) => {
            handleSubmitListing(event);
            handleClose();
          },
        }}
      >
        <DialogTitle>Listing Details</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="title"
            name="title"
            label="Title"
            type="text"
            variant="standard"
            fullWidth
          />
          <FormControl variant="standard" fullWidth required>
            <InputLabel id="category">Category</InputLabel>
            <Select
              labelId="category"
              id="category"
              value={category}
              label="Category"
              onChange={handleChangeCategory}
              name="category"
            >
              <MenuItem value={"books"}>Books</MenuItem>
              <MenuItem value={"electronics"}>Electronics</MenuItem>
              <MenuItem value={"collectibles"}>Collectibles</MenuItem>
              <MenuItem value={"apparel"}>Apparel</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            required
            margin="dense"
            id="description"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            variant="standard"
          />
          <div style={{ marginTop: 10, display: "flex" }}>
            <TextField
              label="Starting Price"
              value={values.value}
              onChange={handleChangePrice}
              name="price"
              id="formatted-numberformat-input"
              InputProps={{
                inputComponent: NumericFormatCustom,
              }}
              variant="standard"
              required
            />
            <FormControl variant="standard" sx={{ marginLeft: "10%" }} required>
              <InputLabel id="demo-simple-select-label">Duration</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={durationData.duration}
                label="Duration"
                onChange={handleChangeDuration}
                name="duration"
              >
                <MenuItem value={1}>1 Day</MenuItem>
                <MenuItem value={3}>3 Days</MenuItem>
                <MenuItem value={5}>5 Days</MenuItem>
                <MenuItem value={7}>7 Days</MenuItem>
              </Select>
              <FormHelperText>Select listing duration</FormHelperText>
            </FormControl>
            {durationData.duration ? (
              <p style={{ marginLeft: "10%", width: "30%" }}>
                Your listing will end on{" "}
                <b style={{ color: "red" }}>{durationData.listingEndTime}</b>
              </p>
            ) : null}
          </div>
          <InputFileUpload />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const NumericFormatCustom = React.forwardRef(function NumericFormatCustom(
  props,
  ref
) {
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
});
