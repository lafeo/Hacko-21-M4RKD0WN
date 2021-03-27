import React from 'react';
import {Link} from "react-router-dom";
import {Navbar,Nav} from 'react-bootstrap';
const Navigation = () =>{

    return(
    <Navbar fixed="top" collapseOnSelect expand="sm" variant="dark">
        <Link to="/"><Navbar.Brand className="logo-text">ek</Navbar.Brand></Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
                <Link to="/shop"><Navbar.Text className="mx-3">Shop</Navbar.Text></Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
    )
}

export default Navigation;