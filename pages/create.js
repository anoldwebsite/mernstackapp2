import React from 'react'
import {
  Form, Input, TextArea, Button, Image,
  Message, Header, Icon
} from 'semantic-ui-react'
import axios from 'axios'
import baseUrl from '../utils/baseUrl'
import catchErrors from '../utils/catchErrors'

const INITIAL_PRODUCT = {
  name: "",
  price: "",
  media: "",
  description: ""
};

function CreateProduct() {
  const [product, setProduct] = React.useState(INITIAL_PRODUCT);//set the state to INITIAL_PRODUCT from start
  const [mediaPreview, setMediaPreview] = React.useState("");//No image from start
  const [success, setSuccess] = React.useState(false);//Set the success message to false from the beginning
  const [loading, setLoading] = React.useState(false);//Don't show the spinner at time of component creation
  const [disabled, setDisabled] = React.useState(true);
  const [error, setError] = React.useState("");


  React.useEffect(() => {
    //object.values(product) returns an array
    const isProduct = Object.values(product).every(p => Boolean(p));
    //If every element of the array returned by object.values(product)
    //is set and is not an empty string like this "", then the Boolean(p)
    //will return true, so we use ther ternary operator below using the boolean
    isProduct ? setDisabled(false) : setDisabled(true);
  }, [product]);

  function handleChange(event) {
    const { name, value, files } = event.target;

    if (name === "media") {
      //updating the media property
      setProduct(prevState => ({ ...prevState, media: files[0] }));
      //setMediaPreview(window.URL.createObjectURL(files[0]));
      if (name === "media" && event.target.files[0]) {
        setMediaPreview(window.URL.createObjectURL(files[0]));//Showing preview of the image uploaded by the user
      }
    }
    else {
      //updating the object with property name to the value typed by the user.
      setProduct(prevState => ({ ...prevState, [name]: value }));
    }
  }

  async function handleImageUpload() {
    //Using form data constructor to get all data from the form
    const data = new FormData();
    data.append('file', product.media);
    data.append('upload_preset', 'reactreserve');
    data.append('cloud_name', 'anoldwebsite');
    const response = await axios.post(process.env.CLOUDINARY_URL, data);
    const mediaUrl = response.data.url;
    return mediaUrl;
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      setLoading(true);
      setError("");
      const mediaUrl = await handleImageUpload();
      const url = `${baseUrl}/api/product`;
      const { name, price, description } = product;
      const payload = { name, price, description, mediaUrl };
      //const payload = { name: "", price, description, mediaUrl };//To generate error for testing, we set name to empty string here.
      //Send data to the API end point to post it using axios
      const response = await axios.post(url, payload);
      //console.log({ response });
      setProduct(INITIAL_PRODUCT);//Rest all the filelds on the form
      //Show the success message using Message that we have imported.
      setSuccess(true);
    } catch (error) {
      catchErrors(error, setError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header as="h2" block>
        <Icon name="add" color="orange" />
        Create New Product
      </Header>
      <Form
        loading={loading}
        error={Boolean(error)}
        success={success}
        onSubmit={handleSubmit}
      >
        <Message error header="Oops!" content={error} />
        <Message
          success
          icon="check"
          header="Success!"
          content="Your product has been posted"
        />
        <Form.Group widths="equal">
          <Form.Field
            control={Input}
            name="name"
            label="Name"
            placeholder="Name"
            type="text" //textfield 
            value={product.name}
            onChange={handleChange}
          />
          <Form.Field
            control={Input}
            name="price"
            label="Price"
            placeholder="Price"
            min="0.00"
            step="0.01"//Increasing the price by one US cent when the user clicks the up and down arrow in the field for price on the form
            type="number"
            value={product.price}
            onChange={handleChange}
          />
          <Form.Field
            control={Input}
            name="media"
            type="file" //Image of the new product
            label="Media"
            accept="image/*"//All kinds of image file types are allowed
            content="Select Image"//Instead of placeholder, we have content for the image field
            onChange={handleChange}
          />
        </Form.Group>
        <Image src={mediaPreview} rounded centered size="small" />
        <Form.Field
          control={TextArea}
          name="description"
          label="Description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
        />
        <Form.Field
          control={Button}
          disabled={disabled || loading}//Button is disabled once the variable loading is set to true.
          color="blue"
          icon="pencil alternate"
          content="Submit"
          type="submit"
        />
      </Form>
    </>
  );
}

export default CreateProduct;
