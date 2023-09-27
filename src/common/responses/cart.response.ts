import { HTTP } from "./code.response"


export const CartResponseMessages = {
    ADDED: 'Product added to cart successfully',
    NOT_BLOCKED: 'this user is not blocked',
    USER_NOT_FOUND: 'user not found',
    NOT_FOUND: 'Admin not found.',
    AUTHORIZED_FAILED: 'You are not authorized to perform this action.',
    ADMIN_CREATED: 'Admin created successfully.',
    LOGIN_SUCCESS: 'Logged in successfully.',
    UPDATE_SUCCESS: 'Admin updated successfully.',
    VERIFY_SELLER_SUCCESS: 'Seller verified successfully.',
    DELETE_SUCCESS: 'Admin deleted successfully',
    FORGOT_PASSWORD_EMAIL_SENT: 'Password reset OTP sent to email',
    PASSWORD_RESET_SUCCESS: 'Password reset successful. Please login again.',
    PASSWORD_RESET_FAILED: 'Password reset failed',
    LOGOUT_SUCCESS: 'Logged out successfully',
    LOGOUT_FAILED: 'Failed to logout',
    PASSWORD_UPDATED: 'Password updated successfully',
    PASSWORD_FAILED: 'Password change failed',
    SESSION_STATUS: 'Admin has logged out. Please log in again.',
    INVALID_TOKEN: 'invalid token',
    INVALID_CREDENTIALS: 'invalid credentials',
    MAIL_ERROR: 'Error sending email',
    INVALID_PASSWORD: 'invalid password',
    DIFF_PASS: 'New password must be different from the old password',
    DELETE_FAILED: 'Failed to delete the admin',
    BLOCK_USER: 'User blocked successfully'
}




export const CARTRESPONSE = {
    ADDED: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: CartResponseMessages.ADDED
    },
    // BLOCK_USER: {
    //     httpCode: HTTP.SUCCESS,
    //     statusCode: HTTP.SUCCESS,
    //     message: AdminResponseMessages.BLOCK_USER
    // },
    // UNBLOCK_USER: {
    //     httpCode: HTTP.SUCCESS,
    //     statusCode: HTTP.SUCCESS,
    //     message: AdminResponseMessages.UNBLOCK_USER
    // },
    // SESSION_STATUS: {
    //     httpCode: HTTP.SUCCESS,
    //     statusCode: HTTP.SUCCESS,
    //     message: AdminResponseMessages.SESSION_STATUS
    // },
    // PASSWORD_UPDATED: {
    //     httpCode: HTTP.SUCCESS,
    //     statusCode: HTTP.SUCCESS,
    //     message: AdminResponseMessages.PASSWORD_UPDATED
    // },
    // ADMIN_CREATED: {
    //     httpCode: HTTP.SUCCESS,
    //     statusCode: HTTP.SUCCESS,
    //     message: AdminResponseMessages.ADMIN_CREATED
    // },
    // PASSWORD_RESET_SUCCESS: {
    //     httpCode: HTTP.SUCCESS,
    //     statusCode: HTTP.SUCCESS,
    //     message: AdminResponseMessages.PASSWORD_RESET_SUCCESS
    // },
    // LOGIN_SUCCESS: {
    //     httpCode: HTTP.SUCCESS,
    //     statusCode: HTTP.SUCCESS,
    //     message: AdminResponseMessages.LOGIN_SUCCESS
    // },

    // NOT_FOUND: {
    //     httpCode: HTTP.NOT_FOUND,
    //     statusCode: HTTP.NOT_FOUND,
    //     message: AdminResponseMessages.NOT_FOUND
    // },
    // DELETE_FAILED: {
    //     httpCode: HTTP.BAD_REQUEST,
    //     statusCode: HTTP.BAD_REQUEST,
    //     message: AdminResponseMessages.DELETE_FAILED
    // },

    // UPDATE_SUCCESS: {
    //     httpCode: HTTP.SUCCESS,
    //     statusCode: HTTP.SUCCESS,
    //     message: AdminResponseMessages.UPDATE_SUCCESS
    // },

    // DELETE_SUCCESS: {
    //     httpCode: HTTP.SUCCESS,
    //     statusCode: HTTP.SUCCESS,
    //     message: AdminResponseMessages.DELETE_SUCCESS
    // },

    // FORGOT_PASSWORD_EMAIL_SENT: {
    //     httpCode: HTTP.SUCCESS,
    //     statusCode: HTTP.SUCCESS,
    //     message: AdminResponseMessages.FORGOT_PASSWORD_EMAIL_SENT
    // },

    // PASSWORD_RESET_FAILED: {
    //     httpCode: HTTP.BAD_REQUEST,
    //     statusCode: HTTP.BAD_REQUEST,
    //     message: AdminResponseMessages.PASSWORD_RESET_FAILED
    // },

    // LOGOUT_SUCCESS: {
    //     httpCode: HTTP.SUCCESS,
    //     statusCode: HTTP.SUCCESS,
    //     message: AdminResponseMessages.LOGOUT_SUCCESS
    // },

}