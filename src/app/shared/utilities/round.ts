export function round(number, places) {
    return Math.round((number + Number.EPSILON)*(10**places))/(10**places);
}