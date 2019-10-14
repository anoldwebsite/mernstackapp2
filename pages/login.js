import { Button, Form, Icon, Message, Segment } from 'semantic-ui-react'
import Link from 'next/link'
import React from 'react'
import catchErrors from '../utils/catchErrors'
import baseUrl from '../utils/baseUrl';
import axios from 'axios'
import { handleLogin } from '../utils/auth';

const INITIAL_USER = {
    email: "",
    password: ""
}

function Login() {
    const [user, setUser] = React.useState(INITIAL_USER);
    //To disable the button if any field is not filled on the
    // signup form that we are going to make soon.
    const [disabled, setDisabled] = React.useState(true);//set to disabled from the beginning.
    //Once the data(email and password) is filled in the fields in 
    //the form and the user
    //clicks the button submit to login an existing user, then loading is true
    const [loading, setLoading] = React.useState(false);
    //To display any error we need to create an error state.
    const [error, setError] = React.useState('');
    //Initialize with no error - empty string

    React.useEffect( () => {
        const isUser = Object.values(user).every(elementOfArray => Boolean(elementOfArray));
        //If all the elements of the array Object.values(user) when passed
        //to Boolean return true then the constant isUser is true otherwise
        //it is false. So we will use a ternary operator
        isUser ? setDisabled(false): setDisabled(true);
    }, [user])//We pass in the dependency array, 
    //the object user [user] , so that when some property of the user
    // changes, our function in the line above is called.

    function handleChange(event){
        const { name, value } = event.target;
        //using the previous state and the spread operator to maintain the previous state of the object
        setUser(prevState => ({ ...prevState, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            setLoading(true);
            //Whenever we attempt to submit our form, we want to set the error to empty string
            //so that we do not carry around some old errors
            setError('');
            const url = `${ baseUrl }/api/login`;
            const payload = { ...user };//using the spread operator
            const response = await axios.post(url, payload);
            handleLogin(response.data);
        } catch (error) {
            catchErrors(error, setError);
            setLoading(false);
        } finally{
          setLoading(false);
        }
    }//function handleSubmit ends here.

    return <>
        <Message
            attached
            icon="privacy"
            header="Welcome Back!"
            content="Log in with your email registered with us and your password."
            color="blue"
        />
        <Form
            error={Boolean(error)}
            loading={loading}
            onSubmit={handleSubmit}
        >
            <Message
                error
                header="Oops!"
                content={error}
            />
            <Segment>
                <Form.Input
                    fluid
                    icon="envelope"
                    iconPosition="left"
                    label="Email"
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                />
                <Form.Input
                    fluid
                    icon="lock"
                    iconPosition="left"
                    label="password"
                    placeholder="password"
                    name="password"
                    type="password"
                    value={user.password}
                    onChange={handleChange}
                />
                <Button
                    disabled={disabled || loading}//We want to disable the button once the fileds are blank or after the fields have been filled and the user has clicked the button once.
                    icon="sign in"
                    type="submit"
                    color="orange"
                    content="Signin"
                />
            </Segment>
        </Form>
        <Message
            attached="bottom"
            warning
        >
            <Icon name="help" />
            New user?{" "}
            <Link href="/signup">
                <a>Sign up here</a>
            </Link>{" "} instead
        </Message>
    </>
}//function signup ends here.

export default Login;
