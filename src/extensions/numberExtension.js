export const formatNumber = (number) => {

    if (Number.isInteger(number)) {
        return number.toLocaleString(); // برای اعداد صحیح
    } else {
        return number.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}