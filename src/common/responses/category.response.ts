import { HTTP } from "./code.response";


export const categoryResponseMessage = {
    SUCCESS: 'Category added successfully',
    DELETE: 'Category deleted successfully',
    UPDATE: 'Category updated successfully.',
    AUTHORISE_FAILED: 'You are not authorized to perform this action.',
    NOT_EXIST: 'parent category do not exist . Enter valid parent id ',
    NOT_FOUND: 'Category not found.'
}




export const CATEGORYRESPONSE = {
    SUCCESS: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: categoryResponseMessage.SUCCESS
    },
    DELETE: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: categoryResponseMessage.DELETE
    },
    UPDATE: {
        httpCode: HTTP.SUCCESS,
        statusCode: HTTP.SUCCESS,
        message: categoryResponseMessage.UPDATE
    },
    AUTHORISED_FAILED: {
        httpCode: HTTP.UNAUTHORIZED,
        statusCode: HTTP.UNAUTHORIZED,
        message: categoryResponseMessage.AUTHORISE_FAILED
    },
    NOT_EXIST: {
        httpCode: HTTP.NOT_FOUND,
        statusCode: HTTP.NOT_FOUND,
        message: categoryResponseMessage.NOT_EXIST
    },
    NOT_FOUND: {
        httpCode: HTTP.NOT_FOUND,
        statusCode: HTTP.NOT_FOUND,
        message: categoryResponseMessage.NOT_FOUND
    },

}