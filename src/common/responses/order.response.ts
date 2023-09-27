import { HTTP } from "./code.response"


export const orderResponseMessages = {
    TRANSACTION: 'Transaction details',
    PLATFORM_EARNING: 'Platform total earning ',
    SELLER_EARNING: 'Seller total earning ',
    PAYMENT_SUCCESS: 'Payment successfull. Thanks for purchasing ',
    PAYMENT_FAILED: 'Payment failed',
    CANCELLED_ORDER: 'List of cancelled order',
    ORDER_CREATED: 'Order created successfully',
}




export const ORDERRESPONSE = {
    TRANSACTION: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: orderResponseMessages.TRANSACTION
    },
    PLATFORM_EARNING: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: orderResponseMessages.PLATFORM_EARNING
    },
    SELLER_EARNING: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: orderResponseMessages.SELLER_EARNING
    },
    PAYMENT_SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: orderResponseMessages.PAYMENT_SUCCESS
    },
    PAYMENT_CANCEL: {
        httpCode: HTTP.BAD_REQUEST,
        statusCode: HTTP.BAD_REQUEST,
        message: orderResponseMessages.PAYMENT_FAILED
    },
    CANCELLED_ORDER: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: orderResponseMessages.CANCELLED_ORDER
    },
    ORDER_CREATED: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: orderResponseMessages.ORDER_CREATED
    },
   
}