import AccountHeader from "../components/Account/AccountHeader";
import AccountOrders from "../components/Account/AccountOrders";
import AccountPermissions from "../components/Account/AccountPermissions";
import {parseCookies} from "nookies";
import baseUrl from "../utils/baseUrl";
import axios from "axios";

function Account({user, orders}) { //Destructuring the user from the props object

  return <>
    <AccountHeader { ...user} />
    <AccountOrders orders={orders} />
    { user.role === "root" && <AccountPermissions currentUserId={user._id} /> }
  </>;
}
Account.getInitialProps = async ctx => {
  const {token} = parseCookies(ctx);
  /* The if below is an extra check because account page is a protected page and a user that
  does not have a token can not come on this page but we are doing double check. */
  if(!token){
    return { orders: [] };
  }
  const payload = {
    headers: { Authorization: token}
  };
  const url = `${baseUrl}/api/orders`;
  const response = await axios.get(url, payload);
  return response.data;//Let's go to our api end point
}
export default Account;
