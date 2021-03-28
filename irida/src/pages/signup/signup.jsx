import React from 'react';
import {Form, Button, Col} from 'react-bootstrap';
// import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import './signup.scss'
const Signup = (props) => {

    const handleSubmit=(e)=>{
        e.preventDefault();
            console.log(e.target.name.value);
            const email = e.target.email.value;
            const password = e.target.pwd.value;
        
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                let user = userCredential.user;
               
                const usersRef = firebase.database().ref('Users').child(user.uid);
                const date = new Date();
                const profile = {
                    name : e.target.name.value,
                    mobile: e.target.phone.value,
                    cert: e.target.certID.value,
                    created: date.getTime(),
                    engaged: 0,
                }

                usersRef.set(
                    {profile},
                    err => {
                        if(err)
                        alert(err);
                    }
                )
            })
              .catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
                alert(errorMessage, errorCode);
              });

       } 
    
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            props.setLogged(1);
            // firebase.auth().signOut()
        } 
      });


    return (
            <Form className="form-neo" onSubmit={handleSubmit}>
                <Form.Row>
                    <h3 className="py-2">Volunteer Signup | <span className="logo-text mx-0">ek</span></h3>
                </Form.Row>
                    <Form.Row>
                    <Form.Group as={Col} controlId="formGridName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control name="name" placeholder="Enter fullname" />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="pwd" type="password" placeholder="Password" />
                    </Form.Group>
                </Form.Row>

                <Form.Group controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" type="email" placeholder="Enter email" />
                </Form.Group>


                <Form.Group controlId="formGridMobile">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control name="phone" placeholder="+91 0000000000"/>
                </Form.Group>

                <Form.Group controlId="formCertificationId">
                    <Form.Label>Certification ID <b>(   If not certified <a href="https://nhsvolunteerresponders.org.uk/volunteer-resources"> click here </a>) </b> </Form.Label>
                    <Form.Control name="certID" placeholder="Certification ID"/>
                </Form.Group>

                <Form.Group id="formGridCheckbox">
                    <Form.Check type="checkbox" label="Agree to company's terms and conditions" />
                </Form.Group>


                <Button variant="success" type="submit" >
                    Signup
                </Button>
                <Form.Row>
                    <span className="my-2">Already have an account ? <span className="text-primary" onClick={()=>props.setAuth(!props.auth)}>Login</span></span>
                </Form.Row>
            </Form>
    );
}

export default Signup;
