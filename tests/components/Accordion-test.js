import React from 'react';
import { mount } from 'enzyme';
import Accordion from '../../src/components/accordion';

describe('components/Accordion', () => {
    describe('componentWillMount()', () => {
        it('should set the default index', () => {
            let wrapper = mount(
                    <Accordion defaultIndex={1}>
                        <Accordion.Item header="0" index={0}>Foo</Accordion.Item>
                        <Accordion.Item header="1" index={1}>Bar</Accordion.Item>
                    </Accordion>
                ),
                children = wrapper.find('.accordion-header');

            expect(children.length).toBe(2);
            expect(children.at(0).hasClass('is-active')).toBe(false);
            expect(children.at(1).hasClass('is-active')).toBe(true);
        });

        it('should set multiple default indices', () => {
            let wrapper = mount(
                    <Accordion defaultIndex={[0, 2]} multiple={true}>
                        <Accordion.Item header="0" index={0}>Foo</Accordion.Item>
                        <Accordion.Item header="1" index={1}>Bar</Accordion.Item>
                        <Accordion.Item header="2" index={2}>Baz</Accordion.Item>
                    </Accordion>
                ),
                children = wrapper.find('.accordion-header');

            expect(children.length).toBe(3);
            expect(children.at(0).hasClass('is-active')).toBe(true);
            expect(children.at(1).hasClass('is-active')).toBe(false);
            expect(children.at(2).hasClass('is-active')).toBe(true);
        });
    });

    describe('componentWillUpdate()', () => {
        it('should emit `showing` events', () => {
            let count = 0,
                func = (e, newIndices, oldIndices) => count++,
                wrapper = mount(
                    <Accordion onShowing={func}>
                        <Accordion.Item header="0" index={0}>Foo</Accordion.Item>
                        <Accordion.Item header="1" index={1}>Bar</Accordion.Item>
                    </Accordion>
                );

            expect(count).toBe(0);

            wrapper.setState({
                indices: [1]
            });

            expect(count).toBe(1);

            // Shouldn't trigger if same index
            wrapper.setState({
                indices: [1]
            });

            expect(count).toBe(1);
        });
    });

    describe('componentDidUpdate()', () => {
        it('should emit `shown` events', () => {
            let count = 0,
                func = (e, newIndices, oldIndices) => count += 2,
                wrapper = mount(
                    <Accordion onShown={func}>
                        <Accordion.Item header="0" index={0}>Foo</Accordion.Item>
                        <Accordion.Item header="1" index={1}>Bar</Accordion.Item>
                    </Accordion>
                );

            expect(count).toBe(0);

            wrapper.setState({
                indices: [1]
            });

            expect(count).toBe(2);

            // Shouldn't trigger if same index
            wrapper.setState({
                indices: [1]
            });

            expect(count).toBe(2);
        });
    });

    describe('render()', () => {
        it('should set a custom class', () => {
            let wrapper = mount(<Accordion uniqueClassName="foo" />),
                element = wrapper.find('.accordion');

            expect(element.hasClass('accordion')).toBe(true);
            expect(element.hasClass('foo')).toBe(true);
        });

        it('should set `collapsible` and `multiple` classes', () => {
            let wrapper = mount(<Accordion collapsible={true} multiple={true} />),
                element = wrapper.find('.accordion');

            expect(element.hasClass('is-collapsible')).toBe(true);
            expect(element.hasClass('is-multiple')).toBe(true);
        });

        it('should only allow `Item` children', () => {
            expect(throwConsoleMessage(() => {
                mount(<Accordion><li>Foo</li></Accordion>);
            })).toThrowError('Warning: Failed propType: `Accordion` does not allow children of type `li`.');
        });
    });
});
