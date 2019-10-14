import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { Button, Segment, Divider } from "semantic-ui-react";
import calculateCartTotal from "../../utils/calculateCartTotal";


function CartSummary({ products, handleCheckout, success }) {//destructuring from props
  const [cartAmount, setCartAmount] = React.useState(0);
  const [stripeAmount, setStripeAmount] = React.useState(0);
  /*Let's do testing. We set the array of products to an array with no items in it and see
  if the checkout button is disabled. //products =[];
  */
  const [isCartEmpty, setCartEmpty] = React.useState(false);
  //There is no subtotal if a user has nothing in shopping cart. In this case we want to disable
  //the button checkout
  /* We need to watch the array products. If the length of this array is zero, which means
  no products in the cart, then we can call setCartEmpty. So, we have to keep an eye on 
  this array, each time its length changes. We need to use the hook useEffect */
  React.useEffect(() => {
    const { cartTotal, stripeTotal } = calculateCartTotal(products);//Destructring from the object that the function returns.
    setCartAmount(cartTotal);
    setStripeAmount(stripeTotal);
    setCartEmpty(products.length === 0);//If no items in the cart then length of the array is zero
  }, [products]);
  return (
    <>
      <Divider />
      <Segment clearing size="large">
        <strong>Sub total:</strong> ${cartAmount}
        <StripeCheckout
          //Props goes here to configure a pop for checking out.
          name="React Reserve"//name of our app
          amount={stripeAmount}
          //Show image of the first product added to the products array if its length is greater than zero.
          image={products.length > 0 ? products[0].product.mediaUrl : ""}
          currency="USD"
          shippingAddress={true}
          billingAddress={true}
          zipCode={true}
          stripeKey="pk_test_AEaxdGht87pC5TrzWzgVG0Ng003Rsa7VZ9"//This is your public key on stripe.com
          token={handleCheckout}//handleCheckout will give us all the payment data that we need.
          triggerEvent="onClick"
        >
          <Button 
            icon="cart" 
            disabled={isCartEmpty || success} //Disable the checkout butoon if the cart is empty or the checkoutprocess is goin on indicated by state success set to true
            color="teal" 
            floated="right" 
            content="Checkout"
          />
        </StripeCheckout>
      </Segment>
    </>
  );
}

export default CartSummary;
