import React, {useState} from 'react';
import {Container,Row,Col, Button} from 'react-bootstrap'
import Signin from '../signin/signin';
import Signup from '../signup/signup';
import './auth.scss';
const Auth = ({logged,setLogged}) => {

    const [auth,setAuth] = useState(0);


    return (
        <Container className="auth" fluid>
            <Row className="w-100 mx-auto">
                <Col className="banner text-light d-md-flex d-none align-items-center">
                    <div className="banner-content">
                        <b><h1>Get Certified</h1></b>
                        <p className="w-75 h5">Working as a volunteer to help others requires a skill. Enroll in our programme to become a certified volunteer. </p>
                        <Button href="https://nhsvolunteerresponders.org.uk/volunteer-resources">
                        Enroll now
                        </Button>
                    </div>
                </Col>

                <Col md={5} className="d-flex justify-content-center align-items-center" >
                    {auth?
                    <Signin auth={auth} setAuth={setAuth} logged={logged} setLogged={setLogged} />
                    :
                    <Signup auth={auth} setAuth={setAuth} logged={logged} setLogged={setLogged}/>
                    }
                </Col>
            </Row>
        </Container>
    );
}

export default Auth;
