import React from "react";
import axios from "axios";
import { Header, Checkbox, Table, Icon } from "semantic-ui-react";
import cookie from "js-cookie";
import baseUrl from "../../utils/baseUrl";
import formatDate from "../../utils/formatDate";


function AccountPermissions() {
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    getUsers();
  }, []);

  async function getUsers(){
    const url = `${baseUrl}/api/users`;
    const token = cookie.get("token");
    const payload = { headers: {Authorization: token} };
    const response = await axios.get(url, payload);
    //console.log(response.data);    //Testing with console.log
    setUsers(response.data);
  }
  return (
    <div style={{ margin: "2em 0" }}>
      <Header as="h2">
        <Icon name="settings" />
        User Permissions
      </Header>
      <Table compact celled definition>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell /> 
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Joined</Table.HeaderCell>
            <Table.HeaderCell>Updated</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {users.map(user => (
            <UserPermission key={user._id} user={user} />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
function UserPermission({user}){

  const [admin, setAdmin] = React.useState(user.role === "admin");
  const isFirstRun = React.useRef(true);

  React.useEffect(() => {
    /* There is a problem with this use of useEffect in this case as with the first mount of the component,
    it takes that mounting also as change to the state admin in the array that we pass [admin]. We do not
    want this because we want the effect to happen when we toggle the swithc to make some body admin or vice versa.
    We can see this problem happening if we use console.log. We seen in the console that the role was updated
    2 times because we have two users in the MongoDB database. So one role update happens for each user on 
    mounting the component before we can toggle it. So, we need to solve this problem. We need the role update
    when we toggle and not at the time of the mounting of the component. */
    if(isFirstRun.current){
      isFirstRun.current = false;
      return;//If it is the first run i.e. mounting of the component then don't update the roles.
    }
    updatePermission();
  }, [admin]);

  function handleChangePermission(){
    setAdmin(prevState => !prevState);
  }
  async function updatePermission(){
    const url = `${baseUrl}/api/account`;
    const payload = { _id: user._id, role: admin ? "admin" :  "user" };
    await axios.put(url, payload);
  }
  //Sending one row from this function with 5 columns of data
  return (
    <Table.Row>
      <Table.Cell collapsing>
        <Checkbox checked={admin} toggle onChange={handleChangePermission} />
      </Table.Cell>
      <Table.Cell>{user.name}</Table.Cell>
      <Table.Cell>{user.email}</Table.Cell>
      <Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
      <Table.Cell>{formatDate(user.updatedAt)}</Table.Cell>
      <Table.Cell>{ admin ? "admin" : "user" }</Table.Cell>
    </Table.Row>
  );
}
export default AccountPermissions;
