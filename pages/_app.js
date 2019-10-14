import App from "next/app";
import Layout from "../components/_App/Layout";
import { parseCookies, destroyCookie } from "nookies";
import { redirectUser } from "../utils/auth";
import baseUrl from "../utils/baseUrl";
import axios from "axios";
import Router  from "next/router";

class MyApp extends App {

  static async getInitialProps({ Component, ctx }) {
    const { token } = parseCookies(ctx);

    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    if (!token) {
      //No token was found on the client side
      //What path in the URL is requested? Is it to the page account or create a product? If yes, redirect to login page.
      const isProtectedRoute =
        ctx.pathname === "/account" || ctx.pathname === "/create";
      if (isProtectedRoute) {
        redirectUser(ctx, "/login");
      }
    } else {
      try {
        //Using our token, get the user's account data
        //To pass a json web token (jwt) for authorization, we pass it to the header
        const payload = { headers: { Authorization: token } };
        const url = `${baseUrl}/api/account`;
        const response = await axios.get(url, payload);
        const user = response.data;
        const isRoot = (user.role === "root");//true or  false
        const isAdmin = (user.role === "admin");//true or false
        const isNotPermitted = !(isAdmin || isRoot) && ctx.pathname === "/create";
        if (isNotPermitted) {
          //We redirect the user to homepage as (s)he had not the role of admin or root.
          redirectUser(ctx, "/"); //Since the user is already authenticated, we send user to homepage.
        }
        pageProps.user = user;//Now we have passed the user to pageProps and each page component has access to it.
      } catch (error) {
        console.error("Error getting current user", error);
        //Destroy the cookie/token
        destroyCookie(ctx, "token");//We got too many redirects problem because we did not pass the token as a string.
        //Redirect to login as we can see that the user is not redirected to the login page automatically.
        redirectUser(ctx, "/login");
      }
    }
    return { pageProps };
    /* {pageProps} is the same as { pageProps: pageProps} but we are here using 
    the ES6 object shorthand syntax. We are creating a property pageProps and
     setting it to the pageProps object. */
  }

  componentDidMount() {
    window.addEventListener("storage", this.syncLogout)//When the local storage changes
    //We will call our callback function which is this.syncLogout which
    //will write shortly.
  }
  syncLogout = event => {
    if (event.key === "logout") {
      //console.log("Logged out from storage.");
      Router.push("/login");
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      //To give access to the user, we use the spread operator inside the layout
      // as well so that even layout has access to the user data.
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
