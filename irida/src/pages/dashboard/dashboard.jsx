import React, { useState, useEffect, useCallback } from "react";
import firebase from "../../firebase";
import { Container, Row, Col } from "react-bootstrap";
import "./dashboard.scss";

const Dashboard = () => {
  const [userData, setUserData] = useState(0);

  const getUserData = useCallback(() => {
    const user = firebase.auth().currentUser;
    setUserData(user);
    const userId = user.uid;
    const userRef = firebase
      .database()
      .ref("Users")
      .child(userId + "/profile");
    userRef.on("value", (snapshot) => {
      setUserData(snapshot.val());
    });
  }, [setUserData]);

  const redirect = () =>{
    window.location.href = '/room/' + userData.tempRoomId + 'v0lUn';
  }
  useEffect(() => {
    getUserData();
  }, [getUserData]);

  return (
    <Container className="dashboard-hero" fluid>
      <Row className="w-100 mx-auto">
        <Col className="d-flex justify-content-center align-items-center flex-column">
          <div className="card-container">
            <div className="d-flex">
              <div className="card-section">
                <h3>Volunteer</h3>
                {userData.name}
              </div>
            </div>
            <div className="card-section d-flex">
              <div>
                <h3>Certification ID</h3>
                {userData.cert}
              </div>
              {userData.tempRoomId? redirect()  : <></> }
              <div className="ml-5 profile-img"></div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
