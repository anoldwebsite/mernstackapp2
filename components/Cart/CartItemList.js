import {
  Header,
  Segment,
  Button,
  Icon,
  Item,
  Message
} from "semantic-ui-react";
import { useRouter } from "next/router";

function CartItemList({ products, user,  handleRemoveFromCart, success}) {//Now we can destructure both products and user here.

  const router = useRouter();  //Execute the hook

  function mapCartProductsToItems(products) {
    return products.map(p => ({
      childKey: p.product._id,
      header: (
        <Item.Header
          as="a"
          onClick={() => router.push(`/product?_id=${p.product._id}`)}
        >
          {p.product.name}
        </Item.Header >
      ),
      image: p.product.mediaUrl,//This shows the image of the product
      //WE have misspelled quanity, so we see undefined there
      meta: `${p.quantity} x $${p.product.price}`,//One dollar sign is for the currency US dollar
      fluid: "true", //Take the whold space available
      extra: (
        <Button
          basic
          icon="remove"
          floated="right"
          onClick={() => handleRemoveFromCart(p.product._id)}
        />
      )
    }));
  }

  if (success) {
    return (
      <Message
        success
        header="Success!"
        content="Your order and payment has been accepted"
        icon="star outline"
      />
    );
  }
  if (products.length === 0) { //No products in the shopping cart case, then show the placeholder
    return (
      <Segment secondary color="teal" inverted textAlign="center" placeholder>

        <Header icon>
          <Icon name="shopping basket" />
          No products in your cart. Add some!
      </Header>
        <div>
          {user ? (
            <Button color="orange" onClick={() => router.push("/")}>
              View Products
            </Button>
          ) : (
            <Button color="blue" onClick={() => router.push("/login")}>
              Login to Add Products
            </Button>
          )}
        </div>

      </Segment>
    );
  } 
    //We will be returning items here, so will import Item from semantic ...
    return <Item.Group divided items={mapCartProductsToItems(products)} />;
    //Let's draw a line between each product
  

}

export default CartItemList;
