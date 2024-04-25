import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { NumericFormat } from 'react-number-format';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState({
    numberformat: '',
  });

  const getCurrentTimePlusNumberOfDays = n => {
    const today = new Date(); // Get the current date and time
    const millisecondsPerDay = 1000 * 60 * 60 * 24; // Milliseconds in a day

    // Add 3 days in milliseconds to the current timestamp
    const threeDaysInMilliseconds = n * millisecondsPerDay;
    const futureTime = today.getTime() + threeDaysInMilliseconds;

    // Create a new Date object representing the future time
    const futureDate = new Date(futureTime);

    // Format the date string for UI display (month name, day, year, time with am/pm)
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const formattedDate = `${monthNames[futureDate.getMonth()]} ${futureDate.getDate()}, ${futureDate.getFullYear()} at ${(futureDate.getHours() % 12) || 12}:${futureDate.getMinutes().toString().padStart(2, '0')} ${(futureDate.getHours() >= 12) ? 'PM' : 'AM'}`;

    return formattedDate;
  }
  const [durationData, setDuration] = React.useState({
    duration: 3,
    listingEndTime: getCurrentTimePlusNumberOfDays(3)
  });

  const handleChangeDuration = (event) => {
    console.log("event: ", event);
    setDuration({
      duration: event.target.value,
      listingEndTime: getCurrentTimePlusNumberOfDays(event.target.value)
    });
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

  const styles = {
    dialogStyles: {
      position: "relative",
      marginTop: 0
    },
    formStyles: {
      width: "50%"
    }
  }

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Create New Listing
      </Button>
      <Dialog
        sx={{ ...styles.dialogStyles }}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: "50%" },
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            console.log(formJson);
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
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            required
            margin="dense"
            fullWidth
            id="description"
            name="description"
            label="Description"
            multiline
            rows={4}
            variant="standard"
          />
          <div style={{ marginTop: 10 }}>
            <TextField
              label="Starting Price"
              value={values.numberformat}
              onChange={handleChangePrice}
              name="numberformat"
              id="formatted-numberformat-input"
              InputProps={{
                inputComponent: NumericFormatCustom,
              }}
              variant="standard"
            />
            <FormControl variant='standard' sx={{ marginLeft: "10%" }}>
              <InputLabel id="demo-simple-select-label">Duration</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={durationData.duration}
                label="Duration"
                onChange={handleChangeDuration}
              >
                <MenuItem value={1}>1 Day</MenuItem>
                <MenuItem value={3}>3 Days</MenuItem>
                <MenuItem value={5}>5 Days</MenuItem>
                <MenuItem value={7}>7 Days</MenuItem>
              </Select>
              <FormHelperText>Select listing duration</FormHelperText>
            </FormControl>
            <p>Your listing will end on <b style={{ color: "red" }}>{durationData.listingEndTime}</b></p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
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