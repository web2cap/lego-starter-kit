import React from 'react';
import importcss from 'importcss';
import {
  Card,
  CardBlock,
  CardFooter,
  CardTitle,
  CardText,
} from 'reactstrap';
import {
  Grid,
  Row,
  Col,
  Button,
} from 'react-bootstrap';

import Component from 'lsk-general/General/Component';
import Slide from 'lsk-general/General/Slide';
import A from 'lsk-general/General/A';

import Header from '../../containers/Header';

@importcss(require('./HomePage.css'))
export default class HomePage extends Component {
  render() {
    return (
      <div>
        <Header />
        <Slide
          full
          video="http://skill-branch.ru/video-background.webm"
          overlay
        >
          <Grid>
            <Row>
              <Col md={4} mdOffset={4}>
                <Card>
                  <CardBlock>
                    <CardTitle>
                      Добро пожаловать
                    </CardTitle>
                    Это пример, как можно использовать lego-starter-kit
                  </CardBlock>
                  <CardFooter className="text-xs-center">
                    <a rel="noopener noreferrer" target="_blank" href="https://github.com/isuvorov/lego-starter-kit">
                      Подробнее
                    </a>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </Grid>
        </Slide>
      </div>
    );
  }
}