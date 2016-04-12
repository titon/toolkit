/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import Titon from '../Titon';
import Accordion from '../components/Accordion';
import Breadcrumb from '../components/Breadcrumb';
import Button, { Link, Submit } from '../components/Button';
import ButtonGroup from '../components/ButtonGroup';
import Carousel from '../components/carousel';
import Checkbox from '../components/Checkbox';
import Drop from '../components/Drop';
import { Region, Block } from '../components/Flex';
import Form from '../components/Form';
import Gateway from '../components/Gateway';
import { Row, Col } from '../components/Grid';
import Input from '../components/Input';
import InputGroup, { Addon } from '../components/InputGroup';
import Label, { Badge } from '../components/Label';
import { Background, Image } from '../components/LazyLoad';
import { Message, Spinner, Wave } from '../components/Loader';
import Mask from '../components/Mask';
import Modal from '../components/Modal';
import OffCanvas from '../components/OffCanvas';
import Pagination from '../components/Pagination';
import Progress from '../components/Progress';
import Radio from '../components/Radio';
import Select from '../components/Select';
import Steps from '../components/Steps';
import Switch from '../components/Switch';
import Tabs from '../components/Tabs';
import Toast from '../components/Toast';

Titon.options.debug = true;

const log = function(e, ...args) {
    console.log(e.constructor.name, e.type, e.detail, e, args);
};

const selectOptions = [
    {
        label: 'One Piece',
        options: [
            {
                value: '0',
                label: 'Luffy',
                selectedLabel: 'Luffy SENPAI',
                description: 'Pirate King'
            }, {
                value: '1',
                label: 'Zoro'
            }, {
                value: '3',
                label: 'Sanji',
                disabled: true
            }, {
                value: '4',
                label: 'Franky'
            }, {
                value: '5',
                label: 'Brook'
            }, {
                value: '6',
                label: 'Nico Robin'
            }
          ]
    }, {
        label: 'Naruto',
        options: [
            {
                value: 'naruto',
                label: 'Naruto',
                description: 'Hokage'
            }, {
                value: 'sasuke',
                label: 'Sasuke'
            }, {
                value: 'sakura',
                label: 'Sakura'
            }
        ]
    }
];

function GateButton({ children, onClick }, context) {
    return (
        <button type="button" role="button" className="button" onClick={() => onClick(context)}>
            {children}
        </button>
    );
}

GateButton.contextTypes = Gateway.CONTEXT_TYPES;

const accordionMarkup = (
    <Accordion
        className="feature-list" defaultIndex={[0, 2]}
        multiple={false} collapsible={false} debug={false}>

        <Accordion.Item header="Header #1" key="0" index={0} onClick={log}>
            <p>Phasellus viverra convallis ex sit amet convallis. Sed accumsan dignissim massa, eu volutpat tellus semper at. Quisque non lectus sit amet lectus consectetur tincidunt nec in sem. Fusce lobortis blandit turpis, vel vestibulum nulla egestas vitae. Vivamus quis orci vitae odio elementum facilisis. Vestibulum suscipit quam in dictum ullamcorper. Sed lectus quam, faucibus id pellentesque nec, suscipit at elit. </p>

            <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi fermentum congue lectus, at imperdiet odio dictum sit amet.</p>
        </Accordion.Item>

        <Accordion.Item header="Header #2" key="1" index={1}>
            <p>Sed non sem tempor, feugiat risus at, dignissim ipsum. Ut efficitur lacus non sem laoreet tincidunt. Proin porttitor placerat massa, eu varius libero elementum ac. Donec a ligula ullamcorper, pulvinar leo vel, vestibulum magna. Aliquam et tempus tortor.</p>

            <ul>
                <li>Nulla leo nulla, porta in tortor in.</li>
                <li>Cras sed finibus felis.</li>
                <li>Nulla purus turpis, lobortis at viverra id.</li>
            </ul>
        </Accordion.Item>

        <Accordion.Item header="Header #3" key="2" index={2}>
            <p>Phasellus viverra convallis ex sit amet convallis. Sed accumsan dignissim massa, eu volutpat tellus semper at. Quisque non lectus sit amet lectus consectetur tincidunt nec in sem. Fusce lobortis blandit turpis, vel vestibulum nulla egestas vitae. Vivamus quis orci vitae odio elementum facilisis. Vestibulum suscipit quam in dictum ullamcorper. Sed lectus quam, faucibus id pellentesque nec, suscipit at elit. </p>

            <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi fermentum congue lectus, at imperdiet odio dictum sit amet.</p>
        </Accordion.Item>

        <Accordion.Item header="Header #4" key="3" index={3}>
            <p>Phasellus viverra convallis ex sit amet convallis. Sed accumsan dignissim massa, eu volutpat tellus semper at. Quisque non lectus sit amet lectus consectetur tincidunt nec in sem. Fusce lobortis blandit turpis, vel vestibulum nulla egestas vitae. Vivamus quis orci vitae odio elementum facilisis. Vestibulum suscipit quam in dictum ullamcorper. Sed lectus quam, faucibus id pellentesque nec, suscipit at elit. </p>

            <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi fermentum congue lectus, at imperdiet odio dictum sit amet.</p>
        </Accordion.Item>
    </Accordion>
);


const breadcrumbMarkup = (
    <Breadcrumb className="navigation">
        <Breadcrumb.Item href="#" onClick={log}>Foo</Breadcrumb.Item>
        <Breadcrumb.Item href="#" onClick={log}>Bar</Breadcrumb.Item>
        <Breadcrumb.Item href="#" onClick={log}>Baz</Breadcrumb.Item>
    </Breadcrumb>
);

const buttonMarkup = (
    <div>
        <Button primary>Foo</Button>
        <Button small state="error">Bar</Button>
        <Button large href="#">Baz</Button>
        <Button disabled state="warning">Qux</Button>
        <Link href="/foo">Anchor</Link>
    </div>
);

const buttonGroupMarkup = (
    <div>
        <ButtonGroup>
            <Button>Foo</Button>
            <Button>Bar</Button>
            <Button>Baz</Button>
        </ButtonGroup>

        <br />

        <ButtonGroup justified>
            <Button>Foo</Button>
            <Drop>
                <Drop.Toggle>
                    <Button>Bar</Button>
                </Drop.Toggle>

                <Drop.Menu>
                    <Drop.Item>1</Drop.Item>
                    <Drop.Item>2</Drop.Item>
                    <Drop.Item>3</Drop.Item>
                </Drop.Menu>
            </Drop>
            <Button>Baz</Button>
        </ButtonGroup>

        <br />

        <ButtonGroup vertical>
            <Button>Foo</Button>
            <Button>Bar Bar</Button>
            <Button>Baz</Button>
        </ButtonGroup>
    </div>
);

const carouselMarkup = (
    <Carousel
        className="slideshow" modifier="slide"
        toCycle={1} toShow={1}
        loop={false} infinite={false}
        autoStart={false} pauseOnHover={false}>

        <Carousel.ItemList swipe={true} onSwipe={log} onSwipeRight={log}>
            <Carousel.Item index={0}>0</Carousel.Item>
            <Carousel.Item index={1}>1</Carousel.Item>
            <Carousel.Item index={2}>2</Carousel.Item>
            <Carousel.Item index={3}>3</Carousel.Item>
            <Carousel.Item index={4}>4</Carousel.Item>
            <Carousel.Item index={5}>5</Carousel.Item>
            <Carousel.Item index={6}>6</Carousel.Item>
            <Carousel.Item index={7}>7</Carousel.Item>
            <Carousel.Item index={8}>8</Carousel.Item>
        </Carousel.ItemList>

        <Carousel.TabList onClick={log} />

        <Carousel.Next onClick={log}>Next</Carousel.Next>
        <Carousel.Prev onClick={log}>Prev</Carousel.Prev>
        <Carousel.Start onClick={log}>Start</Carousel.Start>
        <Carousel.Stop onClick={log}>Stop</Carousel.Stop>
    </Carousel>
);

const checkboxMarkup = (
    <div>
        <Checkbox name="foo" />
        <Checkbox name="bar" disabled={true} />
        <Checkbox name="baz" multiple={true} defaultValue="1" />
        <Checkbox name="baz" multiple={true} defaultValue="2" defaultChecked={true} />
        <Checkbox name="baz" multiple={true} defaultValue="3" />
    </div>
);

const dropMarkup = (
    <div>
        <div style={{ position: 'relative' }}>
            <Drop>
                <Drop.Toggle>
                    <button type="button" className="button" onClick={log}>Toggle Menu</button>
                </Drop.Toggle>

                <Drop.Menu>
                    <Drop.Header>Foo</Drop.Header>
                    <Drop.Item>
                        <Drop.Link href="/">1</Drop.Link>
                    </Drop.Item>
                    <Drop.Item>2</Drop.Item>
                    <Drop.Item>
                        3

                        <Drop.Menu nested={true}>
                            <Drop.Item>3.1</Drop.Item>
                            <Drop.Item>3.2</Drop.Item>
                            <Drop.Item>3.3</Drop.Item>
                        </Drop.Menu>
                    </Drop.Item>

                    <Drop.Divider />

                    <Drop.Header>Bar</Drop.Header>
                    <Drop.Item>4</Drop.Item>
                    <Drop.Item>5</Drop.Item>
                </Drop.Menu>
            </Drop>
        </div>
    </div>
);

const flexMarkup = (
    <div style={{ width: '100%' }}>
        <Region flow="center" orientation="vertical">
            <Block shrink={1} grow={0}>
                1<br />
                Grow: 0<br />
                Shrink: 1
            </Block>
            <Block self="top" span={3}>
                2
            </Block>
            <Block order={2}>
                3<br />
                Order: 2
            </Block>
            <Block grow={3} self="baseline" medium={1}>
                4<br />
                Grow: 3
            </Block>
            <Block order={1} large={10}>
                5<br />
                Order: 1
            </Block>
            <Block order={3} grow={2}>
                6<br />
                Grow: 2<br />
                Order: 3
            </Block>
            <Block>
                7
            </Block>
        </Region>
    </div>
);

const formMarkup = (
    <div>
        <Form action="/">
            <Form.FieldList>
                <Form.Field inputID="foo" label="Foo" help="250 characters remaining">
                    <input type="text" id="foo" name="foo" />
                </Form.Field>

                <Form.Field inputID="bar" label="Bar" required={true}>
                    <input type="text" id="bar" name="bar" />
                </Form.Field>
            </Form.FieldList>

            <Form.ActionBar>
                <Submit>Submit</Submit>
            </Form.ActionBar>
        </Form>

        <Form action="/" inline={true}>
            <Form.FieldList>
                <Form.Field inputID="foo" label="Foo" help="250 characters remaining">
                    <input type="text" id="foo" name="foo" />
                </Form.Field>

                <Form.Field inputID="bar" label="Bar" required={true}>
                    <input type="text" id="bar" name="bar" />
                </Form.Field>
            </Form.FieldList>

            <Form.ActionBar>
                <Submit>Submit</Submit>
            </Form.ActionBar>
        </Form>
    </div>
);

const gridMarkup = (
    <div style={{ width: '100%' }}>
        <Row>
            <Col span={3}>
                Left

                <Row>
                    <Col large={4} medium={3} small={6} xsmall={1}>
                        Large: 33.3%<br />
                        Medium: 25%<br />
                        Small: 50%<br />
                        Extra Small: 16.6%
                    </Col>

                    <Col large={4} medium={6} small={6} xsmall={1}>
                        Large: 33.3%<br />
                        Medium: 50%<br />
                        Small: 50%<br />
                        Extra Small: 16.6%
                    </Col>

                    <Col large={4} medium={3} xsmall={4} className="hide-small">
                        Large: 33.3%<br />
                        Medium: 25%<br />
                        Small: hidden<br />
                        Extra Small: 66.6%
                    </Col>
                </Row>
            </Col>
            <Col span={6}>
                Center

                <Row>
                    <Col span={4}>4</Col>
                    <Col span={4} push={4} end={true}>4, push-4</Col>
                </Row>

                <Row>
                    <Col span={6}>6</Col>
                    <Col span={1} pull={1}>1, pull-1</Col>
                </Row>
            </Col>
            <Col span={3}>
                Right

                <Row>
                    <Col large={4} medium={3} small={2} xsmall={4}>
                        Large: 33.3%<br />
                        Medium: 25%<br />
                        Small: 16.6%<br />
                        Extra Small: 66.6%
                    </Col>

                    <Col large={6} largePush={2} medium={3} mediumPush={3} small={4} smallPush={3} xsmall={1} xsmallPush={1}>
                        Large: 50%, 16.6% push<br />
                        Medium: 25%, 25% push<br />
                        Small: 33.3%, 25% push<br />
                        Extra Small: 16.6%, 16.6% push
                    </Col>
                </Row>
            </Col>
        </Row>

        <Row>
            <Col>1</Col>
            <Col>2</Col>
            <Col>3</Col>
        </Row>
    </div>
);

const inputMarkup = (
    <form action="" method="post">
        <Input.Static>Name</Input.Static>
        <Input name="foo" uid="foo" placeholder="Name" defaultValue="Miles" />
        <Input.Choice inputID="tos">
          <Input type="checkbox" name="tos" id="tos" />
          I agree to the terms of service.
        </Input.Choice>
        <Input name="foo-email" type="email" placeholder="Email" />
        <Input name="foo-file" type="file" />

        <br />

        <Input name="bar" type="checkbox" />
        <Input name="bar-multi[]" type="checkbox" multiple defaultValue="a" />
        <Input name="bar-multi[]" type="checkbox" multiple defaultValue="b" defaultChecked={true} />
        <Input name="baz" type="radio" defaultValue="a" defaultChecked="c" />
        <Input name="baz" type="radio" defaultValue="b" defaultChecked="c" />
        <Input name="baz" type="radio" defaultValue="c" defaultChecked="c" />

        <br />

        <Input.Select name="oof" options={selectOptions} />
        <Input.Select name="oof-multi" options={selectOptions} multiple={true} defaultValue={['1', 'sasuke']} />

        <br />

        <Input.Textarea name="qux" uid="qux" />

        <br />

        <Submit>Submit</Submit>
    </form>
);

const inputGroupMarkup = (
    <div>
        <InputGroup>
            <Addon>http://</Addon>
            <Input name="url" type="url" />
        </InputGroup>

        <br />

        <InputGroup>
            <Input name="email" type="text" />
            <Addon>@</Addon>
            <Input name="domain" type="text" />
        </InputGroup>

        <br />

        <InputGroup>
            <Input name="query" type="text" />
            <Submit>Search</Submit>
        </InputGroup>
    </div>
);

const labelMarkup = (
    <div>
        <Label>Foo</Label>
        <Label small>Foo</Label>
        <Label large>Foo</Label>
        <Label state="error">Foo</Label>

        <br />

        <Label arrow="left">Bar</Label>
        <Label arrow="right">Bar</Label>
        <Label ribbon="left">Bar</Label>
        <Label ribbon="right">Bar</Label>

        <br />

        <Badge>1</Badge>
        <Badge small>12</Badge>
        <Badge large state="info">123</Badge>
    </div>
);

const lazyLoadMarkup = (
    <div>
        <div style={{ height: 1000 }} />

        <Image
            src="http://lorempixel.com/300/300/animals/?foo"
            alt="KITTIES"
            width="300" height="300"
            cacheBust={true} />

        <Background>
            <div style={{
                background: 'url(http://lorempixel.com/300/300/animals/?bar) no-repeat',
                width: 300,
                height: 300
            }}>
                Bar
            </div>
        </Background>

        <div style={{ height: 1000 }} />

        <Image
            src="http://lorempixel.com/300/300/animals/"
            retinaSrc="http://lorempixel.com/600/600/animals/"
            alt="FLOOFS"
            width="300" height="300" />

        <Background>
            <div className="bar" style={{
                background: 'url(http://lorempixel.com/600/600/animals/) no-repeat',
                backgroundSize: 'cover',
                width: 300,
                height: 300
            }}>
                Bar
            </div>
        </Background>
    </div>
);

const loaderMarkup = (
    <div style={{ padding: 20 }}>
        <Wave />
        <Wave count={3} className="loader-foo">
            <Message>Loading...</Message>
        </Wave>
        <Wave type="bubble" />
        <Wave type="bubble" count={3}>
            <Message>Finding...</Message>
        </Wave>

        <br /><br />

        <Spinner />
        <Spinner>
            <Message>Searching...</Message>
        </Spinner>
    </div>
);

const maskMarkup = (
    <Mask>
        <p>
            <Mask.Toggle>
                <button type="button" className="button">Toggle Overlay</button>
            </Mask.Toggle>
        </p>

        <Mask.Target>
            <div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed imperdiet nisi in lectus euismod cursus. Nulla facilisi. Nullam gravida eget nunc vel volutpat. Ut interdum dapibus lacus sed volutpat. Quisque rhoncus, turpis id faucibus sodales, lorem justo pulvinar nibh, ut interdum sapien mi vitae velit. Nam vestibulum elit luctus ante tempor, ut bibendum mauris molestie. Vestibulum at pellentesque nulla. Pellentesque ex neque, ullamcorper sit amet lacus vel, tincidunt posuere est. Pellentesque mollis quis diam ut iaculis. Etiam scelerisque lacus vitae mi placerat fringilla. Sed eget augue eu sem pellentesque consectetur. Integer in justo risus. Nullam pellentesque magna sit amet metus aliquam volutpat non vitae lectus. Duis dignissim velit et justo pellentesque placerat. Ut vel sodales sapien. Nam sit amet luctus tellus.</p>

                <Mask.Overlay collapsible={true}>
                    Loading...
                </Mask.Overlay>
            </div>
        </Mask.Target>
    </Mask>
);

const modalInstance = (
    <Modal key="foo" gateName="modal">
        <Modal.Head>Modal Title</Modal.Head>
        <Modal.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed imperdiet nisi in lectus euismod cursus. Nulla facilisi. Nullam gravida eget nunc vel volutpat. Ut interdum dapibus lacus sed volutpat. Quisque rhoncus, turpis id faucibus sodales, lorem justo pulvinar nibh, ut interdum sapien mi vitae velit. Nam vestibulum elit luctus ante tempor, ut bibendum mauris molestie. Vestibulum at pellentesque nulla. Pellentesque ex neque, ullamcorper sit amet lacus vel, tincidunt posuere est. Pellentesque mollis quis diam ut iaculis. Etiam scelerisque lacus vitae mi placerat fringilla. Sed eget augue eu sem pellentesque consectetur. Integer in justo risus. Nullam pellentesque magna sit amet metus aliquam volutpat non vitae lectus. Duis dignissim velit et justo pellentesque placerat. Ut vel sodales sapien. Nam sit amet luctus tellus.
        </Modal.Body>
    </Modal>
);

const modalMarkup = (
    <div>
        <GateButton onClick={context => {
            context.warpIn('modal', modalInstance);
        }}>
            Open Modal
        </GateButton>

        <GateButton onClick={context => {
            context.warpOut('modal', modalInstance);
        }}>
            Close Modal
        </GateButton>
    </div>
);

const offCanvasMarkup = (
    <OffCanvas swipe={true} showOnLoad={true} animation="squish" multiple={true}>
        <OffCanvas.MainContent>
            <p>
                <OffCanvas.Toggle side="left">
                    <button type="button" className="button">Toggle Left Sidebar</button>
                </OffCanvas.Toggle>

                <OffCanvas.Toggle side="right">
                    <button type="button" className="button">Toggle Right Sidebar</button>
                </OffCanvas.Toggle>
            </p>

            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed imperdiet nisi in lectus euismod cursus. Nulla facilisi. Nullam gravida eget nunc vel volutpat. Ut interdum dapibus lacus sed volutpat. Quisque rhoncus, turpis id faucibus sodales, lorem justo pulvinar nibh, ut interdum sapien mi vitae velit. Nam vestibulum elit luctus ante tempor, ut bibendum mauris molestie. Vestibulum at pellentesque nulla. Pellentesque ex neque, ullamcorper sit amet lacus vel, tincidunt posuere est. Pellentesque mollis quis diam ut iaculis. Etiam scelerisque lacus vitae mi placerat fringilla. Sed eget augue eu sem pellentesque consectetur. Integer in justo risus. Nullam pellentesque magna sit amet metus aliquam volutpat non vitae lectus. Duis dignissim velit et justo pellentesque placerat. Ut vel sodales sapien. Nam sit amet luctus tellus.</p>

            <p>Fusce ornare tortor sed maximus consequat. Integer pulvinar dui sed enim viverra pulvinar. Vestibulum consequat fringilla porttitor. Morbi efficitur dictum sem, sed tincidunt metus varius in. Donec nisl augue, pretium vel orci non, efficitur laoreet tortor. Phasellus eget nulla a sem commodo suscipit eu vel lorem. Mauris lectus neque, fermentum sit amet mauris at, imperdiet porttitor eros. Pellentesque iaculis diam quis sem feugiat, et consectetur nisl faucibus. Donec pellentesque diam mollis urna dictum, sed auctor ligula imperdiet. Duis tincidunt dolor nec iaculis viverra.</p>
        </OffCanvas.MainContent>

        <OffCanvas.Sidebar side="left">
            LEFT
        </OffCanvas.Sidebar>

        <OffCanvas.Sidebar side="right">
            RIGHT
        </OffCanvas.Sidebar>
    </OffCanvas>
);

const paginationMarkup = (
    <div>
        <Pagination totalPages={33} url="?page={{page}}" /> <br />
        <Pagination totalPages={33} url="?page={{page}}" currentPage={17} /> <br />
        <Pagination totalPages={8} url="?page={{page}}" showControls={true} /> <br />

        <br />

        <Pagination totalPages={33} url="?page={{page}}" format="spaced" /> <br />
        <Pagination totalPages={33} url="?page={{page}}" currentPage={17} format="spaced" /> <br />
        <Pagination totalPages={8} url="?page={{page}}" showControls={true} format="spaced" />
    </div>
);

const progressMarkup = (
    <div style={{ width: '100%' }}>
        <Progress now={75}>
            <Progress.Bar percent={75} />
        </Progress>

        <Progress now={61}>
            <Progress.Bar percent={12} state="error" />
            <Progress.Bar percent={49} state="success" />
        </Progress>
    </div>
);

const radioMarkup = (
    <div>
        <Radio.Group name="color" defaultChecked="green">
            <Radio defaultValue="red" />
            <Radio defaultValue="green" />
            <Radio defaultValue="blue" />
        </Radio.Group>
    </div>
);

const selectMarkup = (
    <div>
        Native Menu:
        <Select name="foo" native={true} defaultValue="sasuke" options={selectOptions} />

        <br /><br />

        Custom Menu:
        <Select name="bar" multiple={false} options={selectOptions}>
            <Select.Menu />
        </Select>

        <br /><br />

        Custom Menu, Multiple:
        <Select name="qux[nested][data]" multiple={true} defaultValue={['naruto', '4']} options={selectOptions}>
            <Select.Menu />
        </Select>
    </div>
);

const stepsMarkup = (
    <div>
        <Steps>
            <Steps.Item complete={true} onClick={log}>Cart</Steps.Item>
            <Steps.Item complete={true}>Checkout</Steps.Item>
            <Steps.Item>Payment</Steps.Item>
            <Steps.Item>Review</Steps.Item>
        </Steps>

        <br />

        <Steps>
            <Steps.Item>One Step</Steps.Item>
        </Steps>
    </div>
);

const switchMarkup = (
    <div>
        <Switch name="foo" />
        <Switch name="bar" disabled={true} />
        <Switch name="baz" labelOn="On" labelOff="Off" />
        <Switch name="qux" labelOn="Yes" labelOff="No" stacked={true} defaultChecked={true} />
    </div>
);

const tabsMarkup = (
    <Tabs uid="a" persistState={true} useCookie={false} collapsible={true} fragments={[
        { hash: 'foo', index: 0 },
        { hash: 'bar', index: 1 },
        { hash: 'baz', index: 2 }
    ]}>
        <Tabs.Nav>
            <Tabs.Tab index={0}>Foo</Tabs.Tab>
            <Tabs.Tab index={1}>Bar</Tabs.Tab>
            <Tabs.Tab index={2}>Baz</Tabs.Tab>
        </Tabs.Nav>

        <Tabs.Section index={0}>Foo</Tabs.Section>
        <Tabs.Section index={1}>Bar</Tabs.Section>
        <Tabs.Section index={2}>
            Baz

            <Tabs uid="b" persistState={false}>
                <Tabs.Nav>
                    <Tabs.Tab index={0}>Foo</Tabs.Tab>
                    <Tabs.Tab index={1}>Bar</Tabs.Tab>
                    <Tabs.Tab index={2}>Baz</Tabs.Tab>
                </Tabs.Nav>

                <Tabs.Section index={0}>Foo</Tabs.Section>
                <Tabs.Section index={1}>Bar</Tabs.Section>
                <Tabs.Section index={2}>Baz</Tabs.Section>
            </Tabs>
        </Tabs.Section>
    </Tabs>
);

const createToast = () => (
    <Toast key={Date.now().toString(16)} gateName="toasts">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed imperdiet nisi in lectus euismod cursus. Nulla facilisi. Nullam gravida eget nunc vel volutpat.
    </Toast>
);

const toastMarkup = (
    <div>
        <GateButton onClick={context => {
            context.warpIn('toasts', createToast());
        }}>
            Add Toast
        </GateButton>
    </div>
);

ReactDOM.render((
    <div style={{ width: '100%' }}>
        <Gateway>
            {toastMarkup}

            <Modal.Gate name="modals" />
            <Toast.Gate name="toasts" />
        </Gateway>
    </div>
), document.getElementById('app'));
