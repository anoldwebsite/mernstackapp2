function catchErrors(error, displayError) {
    let errorMsg;
    if (error.response) {
        /* The request was made and the server responded with a status code that
        is not in the range 200 and something */
        errorMsg = error.response.data;
        console.error("Error response", errorMsg);
        
        //For cloudinary image uploads problems.
        if(error.response.data.error){
            errorMsg = error.response.data.error.message;
        }
    } else if (error.request) {
        //The request was made to the end point of the API but we did not get any response.
        errorMsg = error.request;
        console.error("Error request", errorMsg);
    } else {
        //Something went wrong in making the request that triggered this error.
        errorMsg = error.message;
        console.error("Error message", errorMsg);
    }
    displayError(errorMsg);
}
export default catchErrors;
