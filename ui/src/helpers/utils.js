import {
  SERVER_HOST,
  USER_LOGOUT,
  USER_LOGIN,
  USER_SIGNUP,
  GET_LISTINGS_BY_USER_SEARCH,
} from "../constants";
import axios from "axios";
import { NumericFormat } from "react-number-format";
import { forwardRef } from "react";

export const formatDate = (futureDate) => {
  // Format the date string for UI display (month name, day, year, time with am/pm)
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${
    monthNames[futureDate.getMonth()]
  } ${futureDate.getDate()}, ${futureDate.getFullYear()} at ${
    futureDate.getHours() % 12 || 12
  }:${futureDate.getMinutes().toString().padStart(2, "0")} ${
    futureDate.getHours() >= 12 ? "PM" : "AM"
  }`;
};

export const getCurrentTimePlusNumberOfDays = (n) => {
  const today = new Date(); // Get the current date and time
  const millisecondsPerDay = 1000 * 60 * 60 * 24; // Milliseconds in a day

  // Add 3 days in milliseconds to the current timestamp
  const threeDaysInMilliseconds = n * millisecondsPerDay;
  const futureTime = today.getTime() + threeDaysInMilliseconds;

  // Create a new Date object representing the future time
  const futureDate = new Date(futureTime);

  return futureDate;
};

export const handleLogout = (logoutFn) => {
  fetch(SERVER_HOST + USER_LOGOUT, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status == 200) {
      window.sessionStorage.clear();
      logoutFn("/");
    }
  });
};

export const handleSignupUser = (event, navigateFn) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const signupRequestBody = {
    email: data.get("email"),
    password: data.get("password"),
    username: data.get("username"),
    first_name: data.get("firstName"),
    last_name: data.get("lastName"),
  };
  fetch(SERVER_HOST + USER_SIGNUP, {
    method: "POST",
    credentials: "include",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signupRequestBody),
  }).then((res) => {
    if (res.status == 200) {
      navigateFn("/sellers-dashboard");
    }
  });
};

export const handleUserSignIn = (
  event,
  navigateFn,
  setLoggedIn,
  routeHistory
) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const loginRequestBody = {
    email: data.get("email"),
    password: data.get("password"),
  };
  axios
    .post(SERVER_HOST + USER_LOGIN, loginRequestBody, corsConfiguration)
    .then((response) => {
      if (response.status === 200) {
        const lastVisitedRoute = null;
        setLoggedIn(true);
        if (!lastVisitedRoute) {
          navigateFn("/");
        } else {
          navigateFn(lastVisitedRoute);
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export const NumericFormatCustom = forwardRef(function NumericFormatCustom(
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
            value: values?.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="$"
    />
  );
});

export const fetchListingsByUserSearch = (query) => {
  const listingsSearchBody = {
    query,
  };
  axios
    .post(
      SERVER_HOST + GET_LISTINGS_BY_USER_SEARCH,
      listingsSearchBody,
      corsConfiguration
    )
    .then((response) => {
      console.log("response: ", response);
    })
    .catch((e) => console.log(e));
};

const corsConfiguration = {
  withCredentials: true, // include credentials in the request
  mode: "cors",
  headers: {
    "Content-Type": "application/json",
  },
};
