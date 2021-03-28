import React from 'react';
import {Link} from "react-router-dom";
import {Navbar,Nav,Button} from 'react-bootstrap';
import firebase from '../../firebase';

const Navigation = ({logged,setLogged}) =>{

    return(
    <Navbar fixed="top" collapseOnSelect expand="sm" variant="dark">
        <Link to="/"><Navbar.Brand className="logo-text">ek</Navbar.Brand></Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            {!logged?
            <Nav className="ml-auto">
                <Link to="/volunteer"><Navbar.Text className="mx-3">Volunteer here</Navbar.Text></Link>
            </Nav>
            :
            <>
            <Nav className="ml-auto">
                <Link to="/dashboard"><Navbar.Text className="mx-3">Dashboard</Navbar.Text></Link>
            </Nav>
            
            <Nav>
                <Button variant="danger" onClick={()=>{
                    const userId = firebase.auth().currentUser.uid;
                    const userRef = firebase.database().ref('Users').child(userId + '/profile');
                    userRef.update({
                        engaged: 1
                    })
        
                    firebase.auth().signOut()
                    setLogged(false);
                }}><Navbar.Text className="mx-3">Logout</Navbar.Text></Button>
            </Nav>
            </>
    }
        </Navbar.Collapse>
    </Navbar>
    )
}

export default Navigation;