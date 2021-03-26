import CardNeuo from 'components/Card/cardneuo';
import React from 'react';
import { Container, Row , Col} from 'react-bootstrap';
// import { CardGroup } from 'react-bootstrap';

import './shop.scss';

const Shop = () => {
    return (
        <section className="shop">
            <Container>
                <Row>
                <h1 className="mx-auto mt-5">M A R K E T P L A C E</h1>
                <hr className="solid bg-light w-100"/>
                </Row>
                <Row>
                    <Col>
                    <CardNeuo/>
                    </Col>
                    <Col>
                    <CardNeuo/>
                    </Col>
                    <Col>
                    <CardNeuo/>
                    </Col>
                    <Col>
                    <CardNeuo/>
                    </Col>
                    <Col>
                    <CardNeuo/>
                    </Col>
                    <Col>
                    <CardNeuo/>
                    </Col>
                    <Col>
                    <CardNeuo/>
                    </Col>

                </Row>
            </Container>
        </section>
    );
}

export default Shop;
