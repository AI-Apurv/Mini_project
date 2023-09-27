import { HTTP } from "./code.response"


export const userResponseMessages = {
    DELETED: 'Your account has been deleted . Create new account',
    SIGNUP_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Logged in successfully',
    UPDATE_SUCCESS: 'User details updated successfully',
    DELETE_SUCCESS: 'User deleted successfully',
    FORGOT_PASSWORD_EMAIL_SENT: 'Password reset OTP sent to email',
    PASSWORD_RESET_SUCCESS: 'Password reset successful. Please login again here: http://localhost:3000/userlogin',
    PASSWORD_RESET_FAILED: 'Password reset failed.TRY AGAIN HERE: http://localhost:3000/forgotPassword',
    LOGOUT_SUCCESS: 'Logged out successfully',
    NOT_FOUND: 'User not found',
    ALREADY_EXISTS: 'User already exists.Please login',
    CODE_SENT: 'Verification code sent successfully',
    CODE_NOT_SENT: 'Error occured while sending verification code',
    BLOCKED: 'You are blocked by admin. Contact support at support@gmail.com',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_SENT: 'Email verification OTP send',
    EMAIL_VERIFY: 'Email verified successfully',
    EMAIL_NOT_EXIST: 'Email not exist',
    INVALID_OTP: 'Invalid OTP',
    CONTACT_VERIFY: 'Contact verified successfully',
    CONTACT_NOT_VERIFY: 'Contact not verified',
    SESSION_EXPIRED: 'User has logged out . please login again',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    UPDATE_FAILED: 'Failed to update user details',
    DELETE_FAILED: 'Failed to delete user',
    PASSWORD_CHANGE: 'Failed to update password',
    PASSWORD_CHANGED_SUCCESS: 'Password changed successfully',
}




export const USERRESPONSE = {
    ALREADY_EXIST: {
        httpCode: HTTP.ALREADY_EXISTS,
        statusCode: HTTP.ALREADY_EXISTS,
        message: userResponseMessages.ALREADY_EXISTS
    },
    SESSION_EXPIRED: {
        httpCode: HTTP.UNAUTHORIZED,
        statusCode: HTTP.UNAUTHORIZED,
        message: userResponseMessages.SESSION_EXPIRED
    },
    CONTACT_NOT_VERIFY: {
        httpCode: HTTP.BAD_REQUEST,
        statusCode: HTTP.BAD_REQUEST,
        message: userResponseMessages.CONTACT_NOT_VERIFY
    },
    CONTACT_VERIFY: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.CONTACT_VERIFY
    },
    PASSWORD_CHANGED_SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.PASSWORD_CHANGED_SUCCESS
    },
    EMAIL_VERIFY: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.EMAIL_VERIFY
    },
    EMAIL_SENT: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.EMAIL_SENT
    },
    INVALID_CREDENTIALS: {
        httpCode: HTTP.BAD_REQUEST,
        statusCode: HTTP.BAD_REQUEST,
        message: userResponseMessages.INVALID_CREDENTIALS
    },
    BLOCKED: {
        httpCode: HTTP.FORBIDDEN,
        statusCode: HTTP.FORBIDDEN,
        message: userResponseMessages.BLOCKED
    },
    PASSWORD_RESET_SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.PASSWORD_RESET_SUCCESS
    },
    CODE_NOT_SENT: {
        httpCode: HTTP.UNAUTHORIZED,
        statusCode: HTTP.UNAUTHORIZED,
        message: userResponseMessages.CODE_NOT_SENT
    },
    CODE_SENT: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.CODE_SENT
    },
    SIGNUP_SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.SIGNUP_SUCCESS
    },

    LOGIN_SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.LOGIN_SUCCESS
    },

    NOT_FOUND: {
        httpCode: HTTP.NOT_FOUND,
        statusCode: HTTP.NOT_FOUND,
        message: userResponseMessages.NOT_FOUND
    },

    UPDATE_SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.UPDATE_SUCCESS
    },

    DELETE_SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.DELETE_SUCCESS
    },

    FORGOT_PASSWORD_EMAIL_SENT: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.FORGOT_PASSWORD_EMAIL_SENT
    },

    PASSWORD_RESET_FAILED: {
        httpCode: HTTP.BAD_REQUEST,
        statusCode: HTTP.BAD_REQUEST,
        message: userResponseMessages.PASSWORD_RESET_FAILED
    },

    LOGOUT_SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: userResponseMessages.LOGOUT_SUCCESS
    },
    INTERNAL_SERVER_ERROR: {
        httpCode: HTTP.INTERNAL_SERVER_ERROR,
        statusCode: HTTP.INTERNAL_SERVER_ERROR,
        message: userResponseMessages.INTERNAL_SERVER_ERROR
    },

}