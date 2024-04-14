export const getCurrentDateInUTC = () => {
    let currentDate = new Date();
    
    let utcDate = new Date(currentDate.toUTCString().slice(0,-4));

    return utcDate;
}