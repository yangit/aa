const continueToken = /^c\d{1,}m\d{1,}$/;
export default (string: string): boolean => continueToken.test(string);
