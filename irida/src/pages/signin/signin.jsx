import React from 'react';
import {Form, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './signin.scss'
const Signin = ({auth,setAuth}) => {
    return (
        <section className="signin">
            <Form className="form-neo">
                <Form.Row>
                    <h3 className="py-2">Signin | <span className="logo-text mx-0">ek   </span></h3>
                </Form.Row>

                <Form.Group controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>


                <Form.Group controlId="formGridPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                    </Form.Group>


                <Button variant="primary" type="submit">
                    Login
                </Button>
                <Form.Row>
                    <span className="my-2">Don't have an account ? <span className="text-primary" onClick={()=> setAuth(!auth)}>Signup</span></span>
                </Form.Row>
                </Form>
        </section>
    );
}

export default Signin;
