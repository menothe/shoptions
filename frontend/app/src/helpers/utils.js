export const formatDate = futureDate => {
    // Format the date string for UI display (month name, day, year, time with am/pm)
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    return `${monthNames[futureDate.getMonth()]} ${futureDate.getDate()}, ${futureDate.getFullYear()} at ${(futureDate.getHours() % 12) || 12}:${futureDate.getMinutes().toString().padStart(2, '0')} ${(futureDate.getHours() >= 12) ? 'PM' : 'AM'}`;
}

export const getCurrentTimePlusNumberOfDays = n => {
    const today = new Date(); // Get the current date and time
    const millisecondsPerDay = 1000 * 60 * 60 * 24; // Milliseconds in a day

    // Add 3 days in milliseconds to the current timestamp
    const threeDaysInMilliseconds = n * millisecondsPerDay;
    const futureTime = today.getTime() + threeDaysInMilliseconds;

    // Create a new Date object representing the future time
    const futureDate = new Date(futureTime);

    return futureDate;
}