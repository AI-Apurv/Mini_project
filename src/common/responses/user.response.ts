import { HTTP } from "./code.response"
export const userResponseMessages = {
    SIGNUP_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Logged in successfully',
    UPDATE_SUCCESS: 'User details updated successfully',
    DELETE_SUCCESS: 'User deleted successfully',
    FORGOT_PASSWORD_EMAIL_SENT: 'Password reset OTP sent to email',
    PASSWORD_RESET_SUCCESS: 'Password reset successful. Please login again.',
    PASSWORD_RESET_FAILED: 'Password reset failed',
    LOGOUT_SUCCESS: 'Logged out successfully',
    NOT_FOUND: 'User not found',
    ALREADY_EXISTS: 'User already exists.Please login'
}

export const USERRESPONSE = {
    ALREADY_EXIST: {
        httpCode:HTTP.ALREADY_EXISTS,
        statusCode: HTTP.ALREADY_EXISTS,
        message: userResponseMessages.ALREADY_EXISTS
    },
    SIGNUP_SUCCESS: {
        httpCode:HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.SIGNUP_SUCCESS
    },

    LOGIN_SUCCESS: {
        httpCode:HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.LOGIN_SUCCESS
    },

    NOT_FOUND: {
        httpCode:HTTP.NOT_FOUND,
        statusCode: HTTP.NOT_FOUND,
        message: userResponseMessages.NOT_FOUND
    },

   UPDATE_SUCCESS: {
        httpCode:HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.UPDATE_SUCCESS
    },

    DELETE_SUCCESS: {
        httpCode:HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.DELETE_SUCCESS
    },

    FORGOT_PASSWORD_EMAIL_SENT: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.FORGOT_PASSWORD_EMAIL_SENT
    },

    PASSWORD_RESET_SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.PASSWORD_RESET_SUCCESS
    },

    PASSWORD_RESET_FAILED: {
        httpCode: HTTP.BAD_REQUEST,
        statusCode: HTTP.BAD_REQUEST,
        message: userResponseMessages.PASSWORD_RESET_FAILED
    },

    LOGOUT_SUCCESS: {
        httpCode:HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.LOGOUT_SUCCESS
    },
    
}