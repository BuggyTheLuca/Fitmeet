export function isEmptyOrUndefinedString(str: any) {
    return str == null || str.trim().length === 0;
}