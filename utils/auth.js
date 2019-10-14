import cookie from "js-cookie";
import Router from "next/router";

export function handleLogin(token) {
  cookie.set("token", token);
  Router.push("/account");
}
export function handleLogout(){
  cookie.remove("token");
  window.localStorage.setItem("logout", Date.now());//The value does not matter
  //in this case as we are interested in using the key and not its value for
  //our purpose so, we just put the Date.now(). We just want to know in our
  //_app.js file i.e., our app class that the key logout has changed, so that
  //on its change, we log out our user universally from all windows of browser.
  Router.push("/login");
}

export function redirectUser(ctx, location){
  //Since we have access to the ctx (the context object), 
  //we know that we are on the server.
  //Location means where do we want the users to redirect to
  if(ctx.req){
    //This is a way in node.js to do redirects.
    ctx.res.writeHead(302, {Location: location});//302 status code shows that we doing URL redirect.
    ctx.res.end();
  }
  else{
    //We are not on the server and are on the client side
    Router.push(location);
  }
}
