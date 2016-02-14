/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import Titon from '../Titon';
import Accordion from '../components/accordion';
import Carousel from '../components/carousel';
import Breadcrumb from '../components/breadcrumb';
import Drop from '../components/Drop';
import OffCanvas from '../components/OffCanvas';

Titon.options.debug = true;

const log = function(e, ...args) {
    console.log(e.constructor.name, e.type, e.detail, e, args);
};

ReactDOM.render(
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
    </OffCanvas>,
    document.getElementById('app')
);

/*
ReactDOM.render(
        <Drop>
            <Drop.Toggle>
                <button type="button" className="button" onClick={log}>OPEN MENU</button>
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

        <Breadcrumb uniqueClassName="navigation" size="large">
            <Breadcrumb.Item url="#" onClick={log} className="foo-a">Foo</Breadcrumb.Item>
            <Breadcrumb.Item url="#" onClick={log} className={['foo', 'b']}>Bar</Breadcrumb.Item>
            <Breadcrumb.Item url="#" onClick={log} className={{ block: 'foo', element: 'c' }}>Baz</Breadcrumb.Item>
        </Breadcrumb>

        <Carousel
            uniqueClassName="slideshow" modifier="slide"
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

        <Accordion
            uniqueClassName="feature-list" defaultIndex={[0, 2]}
            multiple={true} collapsible={true} debug={false}>

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
    </div>
    ,
    document.getElementById('app')
);
*/
