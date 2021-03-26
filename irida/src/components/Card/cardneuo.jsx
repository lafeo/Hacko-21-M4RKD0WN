import React from 'react';
import {Card,Button} from 'react-bootstrap'

const CardNeuo = () => {
    return (
        <Card style={{ width: '18rem'}}>
        <Card.Img variant="top" src="https://image.freepik.com/free-psd/full-screen-smartphone-mockup-design_53876-65968.jpg" />
        <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
            Some quick example text to build on the card title and make up the bulk of
            the card's content.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
        </Card.Body>
        </Card>
    );
}

export default CardNeuo;
