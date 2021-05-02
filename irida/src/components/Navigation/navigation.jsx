import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import firebase from "../../firebase";

import ekSvg from "../../images/ekLogo.svg";
const Navigation = ({ logged, setLogged }) => {
  return (
    <>
      {!logged ? (
        <Navbar fixed="top" collapseOnSelect expand="sm" variant="dark">
          <Link to="/">
            <Navbar.Brand className="logo-text">
              <img src={ekSvg} alt="eksvg" />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <Link to="/volunteer">
                <Navbar.Text className="mx-3">Volunteer here</Navbar.Text>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      ) : (
        <Navbar
          fixed="top"
          style={{ backgroundColor: "transparent" }}
          variant="dark"
        >
          <Link to="/">
            <Navbar.Brand className="logo-text">
              <img src={ekSvg} alt="eksvg" />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Button
            className="logout-btn"
            onClick={() => {
              const userId = firebase.auth().currentUser.uid;
              const userRef = firebase
                .database()
                .ref("Users")
                .child(userId + "/profile");
              userRef.update({
                engaged: 1,
              });

              firebase.auth().signOut();
              setLogged(false);
            }}
          >
            <Navbar.Text className="mx-3">Logout</Navbar.Text>
          </Button>
        </Navbar>
      )}
    </>
  );
};

export default Navigation;
