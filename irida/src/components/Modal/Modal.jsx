import React,{useRef} from 'react';
import { Form,Button,Modal } from 'react-bootstrap';
import firebase from 'firebase';

function MyVerticallyCenteredModal(props) {

    let volunteerProfile = useRef();

    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }
     
     
    const handleCall = (e) =>{
        e.preventDefault();
        let name = "";
        let issue = "";
        if(e.target.name.value === ""){
            name = "Anonymous"
        }else{
            name = e.target.name.value;
        }
        issue = e.target.issue.value;

        const userRef = firebase.database().ref('Users').orderByChild('profile/engaged');       
        userRef.once('value', (snapshot)=>{
              snapshot.forEach((child)=>{
                
                if(child.val().profile.engaged === 0){
                    volunteerProfile = child.val();
                }
        }
        
        )


        if(volunteerProfile.profile){

        const roomId = makeid(6);
        console.log(volunteerProfile)
            const roomRef = firebase.database().ref('rooms').child(roomId);
            const dateNow = new Date();
            const profile = {
                volunteer: volunteerProfile.profile.name,
                createdAt: dateNow,
                cient: name,
                issue: issue,
                cert: volunteerProfile.profile.cert 

            }
    
            roomRef.set(    
                profile,
                err => {
                    if(err)
                    console.log(err);
                }
            )

            const ref = firebase.database().ref('Users').orderByChild("profile/cert").equalTo(volunteerProfile.profile.cert);
            ref.once("value").then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
            
                  childSnapshot.ref.child('profile').update({
                    
                        "engaged": 1,
                        "tempRoomId" : roomId
                
                  }).then(function() {
                    window.location.href = '/room/' + roomId;
  
                });
            
                  // Cancel enumeration
                  return true;
              });
            })
          }
          else{
            alert("No available volunteers, please wait for some time.. ");
          }
        })
          .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            console.log(errorMessage, errorCode);
        // })
      });


     

    }

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Enter details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={(e) => handleCall(e)}>

                <Form.Group controlId="formGridName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control name="name" placeholder="Anonymous" />
                </Form.Group>


                <Form.Group controlId="formGridIssue">
                    <Form.Label>What type of issue are you facing?</Form.Label>
                    <Form.Control name="issue" placeholder="Stress, Anxiety, ...." />
                </Form.Group>


                <Button variant="success" type="submit">
                    Join Room
                </Button>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default MyVerticallyCenteredModal;