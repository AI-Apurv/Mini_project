import { HTTP } from "./code.response"


export const sellerResponseMessage = {
    NOT_FOUND: 'seller not found',
    SIGNUP_SUCCESS: 'seller registered successfully',
    LOGIN_SUCCESS: 'Logged in successfully',
    UPDATE_SUCCESS: 'seller details updated successfully',
    DELETE_SUCCESS: 'seller deleted successfully',
    FORGOT_PASSWORD_EMAIL_SENT: 'Password reset OTP sent to email',
    PASSWORD_RESET_SUCCESS: 'Password reset successful. Please login again.',
    PASSWORD_RESET_FAILED: 'Password reset failed',
    LOGOUT_SUCCESS: 'Logged out successfully',
    SESSION_EXPIRED: 'Seller has logged out . Please login',
    UPDATE_FAILED: 'Failed to update user details',
    DELETE_FAILED: 'Failed to delete user',
    PASSWORD_UPDATE: 'Password changed successfully',
    PASSWORD_CHANGE_FAILED: 'Password changed failed',
    FAILED_LOGOUT: 'Failed to logout',
    SOLD_PRODUCT_LIST: 'Sold product list',
    FAILED: 'Failed to fetch sold products',
    ALREADY_EXIST: 'Seller with this email already exists.',
    INVALID_CREDENTIALS: 'Invalid credentials.',
    NOT_VERIFIED: 'You are not a verified seller. You can not perform this action'
}


export const SELLERRESPONSE = {
    NOT_FOUND: {
        httpCode: HTTP.NOT_FOUND,
        statusCode: HTTP.NOT_FOUND,
        message: sellerResponseMessage.NOT_FOUND
    },
    LIST: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: sellerResponseMessage.SOLD_PRODUCT_LIST
    },
    SIGNUP_SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: sellerResponseMessage.SIGNUP_SUCCESS
    },
    LOGIN_SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: sellerResponseMessage.LOGIN_SUCCESS
    },
    PASSWORD_UPDATE: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: sellerResponseMessage.PASSWORD_UPDATE
    },
    UPDATE_SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: sellerResponseMessage.UPDATE_SUCCESS
    },
    DELETE_SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: sellerResponseMessage.DELETE_SUCCESS
    },
    FORGOT_PASSWORD_EMAIL_SENT: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: sellerResponseMessage.FORGOT_PASSWORD_EMAIL_SENT
    },
    PASSWORD_RESET_SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: sellerResponseMessage.PASSWORD_RESET_SUCCESS
    },
    PASSWORD_RESET_FAILED: {
        httpCode: HTTP.INTERNAL_SERVER_ERROR,
        statusCode: HTTP.INTERNAL_SERVER_ERROR,
        message: sellerResponseMessage.PASSWORD_RESET_FAILED
    },
    LOGOUT_SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: sellerResponseMessage.LOGOUT_SUCCESS
    },
    SESSION_EXPIRED: {
        httpCode: HTTP.UNAUTHORIZED,
        statusCode: HTTP.UNAUTHORIZED,
        message: sellerResponseMessage.SESSION_EXPIRED
    },
}