import React from 'react';
import {Link} from "react-router-dom";
import {Navbar,Nav} from 'react-bootstrap';
const Navigation = () =>{

    return(
    <Navbar fixed="top" collapseOnSelect expand="md" bg="light">
        <Link to="/"><Navbar.Brand>I R I D A</Navbar.Brand></Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
                <Link to="/shop"><Navbar.Text className="mx-3">Shop</Navbar.Text></Link>
                <Link to="/users"><Navbar.Text className="mx-3">Users</Navbar.Text></Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
    )
}

export default Navigation;