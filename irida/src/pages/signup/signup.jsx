import React from 'react';
import {Form, Button, Col} from 'react-bootstrap';
import { Link } from 'react-router-dom';

import './signup.scss'
const Signup = () => {
    return (
        <section className="signup">
            <Form className="form-neo">
                <Form.Row>
                    <h3 className="py-2">Signup | I R I D A</h3>
                </Form.Row>
                    <Form.Row>
                    <Form.Group as={Col} controlId="formGridName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control placeholder="Enter fullname" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                </Form.Row>

                <Form.Group controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>


                <Form.Group controlId="formGridMobile">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control placeholder="+91 0000000000"/>
                </Form.Group>

                <Form.Group controlId="formGridAddress2">
                    <Form.Label>Address</Form.Label>
                    <Form.Control placeholder="Flat no, city, area, locality" />
                </Form.Group>

                <Form.Group controlId="formGridZip">
                    <Form.Label>Zip</Form.Label>
                    <Form.Control placeholder="000000"/>
                    </Form.Group>

                <Form.Group id="formGridCheckbox">
                    <Form.Check type="checkbox" label="Agree to company's terms and conditions" />
                </Form.Group>


                <Button variant="primary" type="submit">
                    Submit
                </Button>
                <Form.Row>
                    <span className="my-2">Already have an account ? <Link to="/signin">Login</Link></span>
                </Form.Row>
                </Form>
        </section>
    );
}

export default Signup;
