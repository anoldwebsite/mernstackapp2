import React from "react";
import { Input } from "semantic-ui-react";
import { useRouter } from "next/router";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import catchErrors from "../../utils/catchErrors";
import cookie from "js-cookie";

function AddProductToCart({ user, productId }) {
  const [quantity, setQuantity] = React.useState(1);//1 is for one piece of a product
  //WE want to add a spinner so that the user can see a spiner. state set to false from beginning
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    let timeout;
    //We want to wait for 3 seconds when we see the disabled button with text Item Added
    //and then we want to show again the button with text Add to Cart so that user can buy more
    //So when success is updated, we want to change back the butoon.
    if(success){
      timeout = setTimeout( () => setSuccess(false), 3000);//3000 ms = 3 seconds.
      /* The problem with this solution is that we assume that the user stay on the sampe
      product page for 3 seconds. Why would they stay there for three seconds? If they 
      navigate to some other page, then the component page for that product would be 
      unmounted and our method setSuccess(false) will throw error as it will still try to 
      set the non-existing state success to false.
       The solution is that we save reference 
      to the setTimeout function above in a variable and pass that variable to a function 
      which will clear out the timer if the page is unmounted prematurely. */
    }
    return () => {
      clearTimeout(timeout);
    }
  }, [success])

  async function handleAddProductToCart() {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/cart`;
      const payload = { quantity, productId };
      const token = cookie.get("token");
      //Sending authorization header with the pay load for extra security
      const headers = { headers: { Authorization: token } };
      //Since we want to update the array products in Cart.js, so we need
      //a PUT request and not a POST request.
      await axios.put(url, payload, headers);
      //To show that the product has been added message we will need a state success
      setSuccess(true);
    } catch (error) {
        catchErrors(error, window.alert);//To show an alert box in browser
    } finally {
      setLoading(false);//Both successful or error case, stop the spinner.
    }

  }

  return (
    <Input
      type="number"
      min="1"
      placeholder="Quantity"
      value={quantity}
      onChange={event => setQuantity(Number(event.target.value))}
      action={//using nested ternary
        user && success
          ? {
              color: "blue",
              content: "Item Added!",
              icon: "plus cart",
              disabled: true //We will show this disabled button to show the message Item Added
            }
          : user
          ? {
              color: "orange",
              content: "Add to Cart",
              icon: "plus cart",
              loading,//This means set loading to true if const loading above is true. loading = loading; 
              disabled: loading, //Disable this orange button when loading is true i.e., we are trying to add a product to cart.
              onClick: handleAddProductToCart
            }
          : {
              color: "blue",
              content: "Sign Up To Purchase",
              icon: "signup",
              onClick: () => router.push("/signup")
            }
      }
    />
  );
}

export default AddProductToCart;
