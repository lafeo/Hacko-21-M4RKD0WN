import React from 'react';
import {Container,Row,Col} from 'react-bootstrap'
import Signup from '../signup/signup';
import './auth.scss';
const Auth = () => {
    return (
        <Container className="auth" fluid>
            <Row className="w-100 mx-auto">
                <Col className="bg-primary">

                </Col>

                <Col md={6} className="d-flex justify-content-center align-items-center" >
                    <Signup />
                </Col>
            </Row>
        </Container>
    );
}

export default Auth;
