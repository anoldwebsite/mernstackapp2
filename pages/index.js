import React from 'react'
import axios from 'axios'//a library we will use for http request and response object
import ProductList from '../components/Index/ProductList'
import baseUrl from '../utils/baseUrl'
import ProductPagination from "../components/Index/ProductPagination";

function Home({ products, totalPages }) {
  //WE will use this totalPages for a new component in the folder indexes
  //We are going to pass products as props to the componet ProductList

  return (
    <>
      <ProductList products={products} />
      <ProductPagination totalPages={totalPages} />
    </>
  )
}

Home.getInitialProps = async ctx => {
  //console.log(ctx.query);//so we can get the page from ctx.query.
  //First, we check if there is any query string. If not then go to page 1
  const page = ctx.query.page ? ctx.query.page : "1"; //1 means page 1
  const size = 9; //The number of products on a page
  //fetch data by making a request to API end point.
  const url = `${baseUrl}/api/products`;
  const payload = { params: { page, size } };//We will receive these values of page and size in our products endpoin in the file products.js in the api folder
  const response = await axios.get(url, payload);
  //return response data as an object
  return response.data;//We are receiving an object, so we don't need products label
  //Merge the response object wit the existing props so that they are not over-written.


}

export default Home;
