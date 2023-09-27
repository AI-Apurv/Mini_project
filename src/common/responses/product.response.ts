import { HTTP } from "./code.response";


export const ProductResponseMessages = {
  PRODUCT_CREATED: 'Product created successfully.',
  UNAUTHORIZED_ACTION: 'You are not authorized to perform this action.',
  PRODUCT_UPDATED: 'Product updated successfully.',
  REVIEW: 'list of reviews'
};




export const PRODUCTRESPONSE = {
  PRODUCT_CREATED: {
    httpCode: HTTP.SUCCESS,
    statusCode: HTTP.SUCCESS,
    message: ProductResponseMessages.PRODUCT_CREATED
  },
  UNAUTHORIZED_ACTION: {
    httpCode: HTTP.UNAUTHORIZED,
    statusCode: HTTP.UNAUTHORIZED,
    message: ProductResponseMessages.UNAUTHORIZED_ACTION
  },
  PRODUCT_UPDATED: {
    httpCode: HTTP.SUCCESS,
    statusCode: HTTP.SUCCESS,
    message: ProductResponseMessages.PRODUCT_UPDATED
  },
  REVIEW:{
    httpCode: HTTP.SUCCESS,
    statusCode: HTTP.SUCCESS,
    message: ProductResponseMessages.REVIEW
  },
}