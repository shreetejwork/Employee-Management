export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[6-9]\d{9}$/;
export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const AADHAR_REGEX = /^\d{12}$/;
export const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const PIN_REGEX = /^\d{6}$/;

export const validateEmail = (email) => EMAIL_REGEX.test(email);
export const validatePhone = (phone) => PHONE_REGEX.test(phone);
export const validatePAN = (pan) => PAN_REGEX.test(pan.toUpperCase());
export const validateAadhar = (aadhar) => AADHAR_REGEX.test(aadhar);
export const validateIFSC = (ifsc) => IFSC_REGEX.test(ifsc.toUpperCase());
export const validatePIN = (pin) => PIN_REGEX.test(pin);
