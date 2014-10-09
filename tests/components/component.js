define([
    'jquery',
    '../../js/components/component'
], function($, Toolkit) {

describe('Toolkit.Component', function () {
    var element, node,
        component = new Toolkit.Component();

    describe('createElement()', function() {
        var el;

        afterEach(function() {
            if (el) {
                el.remove();
                el = null;
            }
        });

        after(function() {
            component.element = element = $('<span/>').addClass('show').appendTo('body');
            component.node = node = $('<span/>').appendTo('body');
            component.created = true;
        });

        it('should throw an error if no template', function() {
            expect(component.createElement).to.throw(Error);
        });

        it('should create the element from `template`', function() {
            component.options.template = '<b></b>';

            el = component.createElement();

            expect(el.prop('tagName')).to.equal('B');
        });

        it('should use the element from `templateFrom`', function() {
            var from = $('<i></i>').attr('id', 'component-test').appendTo('body');

            component.options.templateFrom = '#component-test';

            el = component.createElement();

            expect(el.prop('tagName')).to.equal('I');

            from.remove();
        });

        it('should set the `className` and `animation` classes', function() {
            component.options.className = 'foo';
            component.options.animation = 'slide';

            el = component.createElement();

            expect(el.hasClass('foo')).to.be.true;
            expect(el.hasClass('slide')).to.be.true;
        });

        it('should set the `created` flag', function() {
            component.created = false;

            el = component.createElement();

            expect(component.created).to.be.true;
        });

        it('should set an id attribute', function() {
            el = component.createElement();

            expect(el.attr('id')).to.equal('toolkit-component-2');
        });
    });

    describe('fireEvent()', function() {
        var count;

        beforeEach(function() {
            count = 0;
        });

        it('should fire hooks with the same name', function() {
            expect(count).to.equal(0);

            component.addHook('bar', function() {
                count += 1;
            });

            component.fireEvent('bar');

            expect(count).to.equal(1);
        });

        it('should fire events bound on the element', function() {
            expect(count).to.equal(0);

            component.addHook('foo', function() {
                count += 1;
            });

            element.on('foo.toolkit.component', function() {
                count += 2;
            });

            component.fireEvent('foo');

            expect(count).to.equal(3);
        });

        it('should fire events bound on the active node', function() {
            expect(count).to.equal(0);

            node.on('baz.toolkit.component', function() {
                count += 3;
            });

            component.fireEvent('baz');

            expect(count).to.equal(3);
        });

        it('should set the event context to the objects `this`', function() {
            var instance;

            element.on('foo.toolkit.component', function(e) {
                instance = e.context;
            });

            component.fireEvent('foo');

            expect(instance).to.equal(component);
        });

        it('should pass arguments', function() {
            var args = [];

            component.addHook('baz', function(a, b) {
                args.push([a * 2, b]);
            });

            element.on('baz.toolkit.component', function(e, a, b) {
                args.push([a * 3, b * 2]);
            });

            component.fireEvent('baz', [4, 7]);

            expect(args).to.deep.equal([
                [8, 7],
                [12, 14]
            ]);
        });
    });

    describe('hide()', function() {
        it('should hide the element', function(done) {
            expect(element.css('display')).to.equal('inline');

            component.hide();

            setTimeout(function() {
                expect(element.css('display')).to.equal('none');

                done();
            }, 10);
        });
    });

    describe('id()', function() {
        it('should generate a unique ID', function() {
            expect(component.id()).to.equal('toolkit-component-2');
        });

        it('should append optional arguments to the ID', function() {
            expect(component.id('a')).to.equal('toolkit-component-2-a');
            expect(component.id(1, 2, 'b')).to.equal('toolkit-component-2-1-2-b');
        });
    });

    describe('inheritOptions', function() {
        it('should read data attributes for new options', function() {
            var el = $('<span/>').attr('data-component-foo', '890');

            expect(component.inheritOptions({ foo: 123 }, el)).to.deep.equal({
                foo: 890
            });
        });

        it('should lowercase all keys and ignore certain keys', function() {
            var el = $('<span/>')
                .attr('data-component-foobar', '890')
                .attr('data-component-template', '<a></a>');

            expect(component.inheritOptions({ fooBar: 123, template: '' }, el)).to.deep.equal({
                fooBar: 890,
                template: ''
            });
        });
    });

    describe('destroy()', function() {

    });
});

});