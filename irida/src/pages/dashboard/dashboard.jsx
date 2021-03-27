import React, {useState,useEffect,useCallback} from 'react';
import firebase from '../../firebase';
import {Container, Row, Col} from 'react-bootstrap';


const Dashboard = () => {
    const [userData,setUserData] = useState(0);
    
    const getUserData = useCallback(() =>{
        const user = firebase.auth().currentUser;
        setUserData(user);
        const userId = user.uid;
        const userRef = firebase.database().ref('Users').child(userId + '/profile');
        userRef.on('value', (snapshot)=>{
            setUserData(snapshot.val());
        })

    },[setUserData]);

    useEffect(() => {
        getUserData();
    }, [getUserData])

    return (
        <Container className="auth" fluid>
            <Row className="w-100 mx-auto">
                {/* <Col className="banner text-light d-md-flex d-none align-items-center">
                    <div className="banner-content">
                        <b><h1>Get Certified</h1></b>
                        <p className="w-75 h5">Working as a volunteer to help others requires a skill. Enroll in our programme to become a certified volunteer. </p>
                        <Button onClick={()=> firebase.auth().signOut()}>
                        Enroll now
                        </Button>
                    </div>
                </Col> */}

                <Col className="d-flex justify-content-center align-items-center" >
                    <h1>Welcome {userData.name} !</h1>
                </Col>
            </Row>
        </Container>

    );
}

export default Dashboard;
