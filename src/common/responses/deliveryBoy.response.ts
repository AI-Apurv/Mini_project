import { HTTP } from "./code.response"


export const deliveryBoyResponseMessage = {
    SIGNUP_SUCCESS: 'signup successful',
    LOGIN: 'Login successful',
    INVALID: 'Invalid credentials',
    AUTHORIZE_FAILED: 'You are not authorized to perform this action',
    OTP_SENT: 'otp sent successfully',
    ORDER_SUCCESS: 'Order delievered successfully',
    NOT_FOUND: 'Delivery boy not found',
    SESSIONSTATUS: 'Delivery boy has logged out. Please log in again.',
    UPDATE: 'details updated successfully',
    UPDATE_FAILED: 'Failed to update delivery boy details',
    ALREADY_EXIST: 'this email already exists',
    ERROR_MAIL: 'error sending email',
    INVALID_OTP: 'Invalid otp . Enter correct OTP',
    
}




export const DELIVERYBOYRESPONSE = {
    SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: deliveryBoyResponseMessage.SIGNUP_SUCCESS
    },
    LOGIN: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: deliveryBoyResponseMessage.LOGIN
    },
    INVALID: {
        httpCode: HTTP.UNAUTHORIZED,
        statusCode: HTTP.UNAUTHORIZED,
        message: deliveryBoyResponseMessage.INVALID
    },
    AUTHORISED_FAILED: {
        httpCode: HTTP.UNAUTHORIZED,
        statusCode: HTTP.UNAUTHORIZED,
        message: deliveryBoyResponseMessage.AUTHORIZE_FAILED
    },
    OTP_SENT: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: deliveryBoyResponseMessage.OTP_SENT
    },
    ORDER_SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: deliveryBoyResponseMessage.ORDER_SUCCESS
    },
    NOT_FOUND: {
        httpCode: HTTP.NOT_FOUND,
        statusCode: HTTP.NOT_FOUND,
        message: deliveryBoyResponseMessage.NOT_FOUND
    },
    UPDATE: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: deliveryBoyResponseMessage.UPDATE
    },

}