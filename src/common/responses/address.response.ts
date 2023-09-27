import { HTTP } from "./code.response"


export const AddressResponseMessages = {
    ADDRESS_CREATED: 'address added successfully.',
    ADDRESS_EXIST: 'Address already exists',
    ADDRESS_UPDATED: 'Address updated successfully',
    ADDRESS_DELETED: 'Address deleted successfully',
}




export const ADDRESSRESPONSE = {
    ADDRESS_CREATED: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: AddressResponseMessages.ADDRESS_CREATED
    },
    ADDRESS_EXIST: {
        httpCode: HTTP.ALREADY_EXISTS,
        statusCode: HTTP.ALREADY_EXISTS,
        message: AddressResponseMessages.ADDRESS_EXIST
    },
    ADDRESS_UPDATED: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: AddressResponseMessages.ADDRESS_UPDATED
    },
    ADDRESS_DELETED: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: AddressResponseMessages.ADDRESS_DELETED
    }

}
