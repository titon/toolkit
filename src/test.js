/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import Titon from './Titon';
import Accordion from './ui/components/accordion';
import Carousel from './ui/components/carousel';
import Breadcrumb from './ui/components/breadcrumb';

const log = function(e, ...args) {
    // console.log(e.constructor.name, e.type, e.detail, e, args);
};

ReactDOM.render(
    <div>
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
