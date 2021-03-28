import React from 'react';
import {Form, Button} from 'react-bootstrap';
import firebase from '../../firebase';
// import { Link } from 'react-router-dom';

import './signin.scss'
const Signin = ({auth,setAuth,logged,setLogged}) => {

    const handleSubmit=(e)=>{
        e.preventDefault();
        if(e.target.email.value=== "" || e.target.pwd.value===""){
            alert("Login details cannot be empty");
        }
        else{
            firebase.auth().signInWithEmailAndPassword(e.target.email.value,e.target.pwd.value)
            .then((userCredential) => {
                const userId = firebase.auth().currentUser.uid;
                const userRef = firebase.database().ref('Users').child(userId + '/profile');
                userRef.update({
                    engaged: 0
                })
                alert("Login Successful")
                setLogged(true);
                
            })
            .catch((error) => {
                alert(error);
            });
        }
        }

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              setLogged(true);
            } else {
              setLogged(false);
            }
          });

    return (
        <section className="signin w-75">
            <Form className="form-neo" onSubmit={handleSubmit}>
                <Form.Row>
                    <h3 className="py-2">Signin | <span className="logo-text mx-0">ek   </span></h3>
                </Form.Row>

                <Form.Group controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control name="email" type="email" placeholder="Enter email" />
                </Form.Group>


                <Form.Group controlId="formGridPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="pwd" type="password" placeholder="Password" />
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
