function calculateCartTotal(products){
    const total = products.reduce((acc, p) => {
         acc += p.product.price * p.quantity;
         console.log(acc);
        return acc; //Send the current value of accumulator for the next iteration.
    }, 0);
    const cartTotal = ((total * 100) / 100).toFixed(2);
    //strip is the service that we will use to check out our customers' cart
    //Stripe uses a number but we can see on the console that we get a string after using toFixed
    //So, we use the Number to convert the cents to a number. 
    const stripeTotal = Number((total * 100).toFixed(2));
    return {cartTotal, stripeTotal};
}
export default calculateCartTotal;
