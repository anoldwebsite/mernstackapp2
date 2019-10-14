import React from 'react'

import { Header, Button, Modal } from 'semantic-ui-react'
import axios from 'axios'
import baseUrl from '../../utils/baseUrl'
import { useRouter } from 'next/router'

function ProductAttributes({ description, _id, user }) {
  /* Since we are passing user data from page product.js to ProductAttributes 
  ( <ProductAttributes user={user} {...product} /> ), we can
   destructure the id of the user from user here or user.  */
  const [modal, setModal] = React.useState(false);//setModal is a function
  const router = useRouter();
  const isRoot = user && user.role === "root";//true or false
  const isAdmin = user && user.role === "admin";//true or false
  const isRootOrAdmin = isRoot || isAdmin;

  async function handleDelete() {
    const url = `${baseUrl}/api/product`;
    const payload = { params: { _id } };//params is a property 
    await axios.delete(url, payload);
    router.push("/");//Redirecting to home page.
  }

  return (
    <>
      <Header as="h3">About this product</Header>
      <p>{description}</p>
      {
        /* We hide the delete product button and the modal to confirm
        delte if the user is not a root or admin otherwise we show it. */
        isRootOrAdmin && (
          <>
            <Button
              icon="trash alternate outline"
              color="red"
              content="Delete Product"
              onClick={() => setModal(true)}
            />
            <Modal open={modal} dimmer="blurring">
              <Modal.Header>Confirm Delete</Modal.Header>
              <Modal.Content>
                <p>Are you sure you want to delete this product?</p>
              </Modal.Content>
              <Modal.Actions>
                <Button
                  onClick={() => setModal(false)}
                  content="Cancel" />
                <Button
                  negative
                  icon="trash"
                  labelPosition="right"
                  content="Delete"
                  onClick={handleDelete}
                />
              </Modal.Actions>
            </Modal>
          </>
        )
      }
    </>
  );
}
export default ProductAttributes;
