define([
    'jquery',
    '../../js/toolkit',
    '../../js/components/component'
], function($, Toolkit) {

describe('Toolkit.Component', function() {
    var element, component, baseElement;

    before(function() {
        component = new Toolkit.Component();
        component.element = baseElement = $('<div/>').addClass('show').appendTo('body');
        component.node = $('<div/>').appendTo('body');
    });

    after(function() {
        component.element.remove();
        component.node.remove();
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

            component.element.on('foo.toolkit.component', function() {
                count += 2;
            });

            component.fireEvent('foo');

            expect(count).to.equal(3);
        });

        it('should fire events bound on the active node', function() {
            expect(count).to.equal(0);

            component.node.on('baz.toolkit.component', function() {
                count += 3;
            });

            component.fireEvent('baz');

            expect(count).to.equal(3);
        });

        it('should set the event context to the objects `this`', function() {
            var instance;

            component.element.on('foo.toolkit.component', function(e) {
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

            component.element.on('baz.toolkit.component', function(e, a, b) {
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
            expect(component.element.css('display')).to.equal('block');

            component.hide();

            setTimeout(function() {
                expect(component.element.css('display')).to.equal('none');

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

    describe('ns()', function() {
        it('should create a basic selector', function() {
            expect(component.ns()).to.equal('[data-component]');
        });

        it('should be able to change the block', function() {
            expect(component.ns('', 'block')).to.equal('[data-block]');
        });

        it('should append an element', function() {
            expect(component.ns('body')).to.equal('[data-component-body]');
        });

        it('should filter by namespace', function() {
            expect(component.ns('body')).to.equal('[data-component-body]');

            component.namespace = 'foo';

            expect(component.ns('body')).to.equal('[data-component-body="foo"]');

            component.namespace = '';
        });
    });

    describe('process()', function() {
        it('should trigger a function if `callback` is defined', function() {
            var count = 0;

            Toolkit.testProcess = function() {
                count = 5;
            };

            component.process({ foo: 'bar' });

            expect(count).to.equal(0);

            component.process({ foo: 'bar', callback: 'Toolkit.testProcess' });

            expect(count).to.equal(5);

            delete Toolkit.testProcess;
        });
    });

    describe('readOption()', function() {
        it('should read from a data attribute if it exists', function() {
            component.options.foo = 'baz';

            expect(component.readOption($('<span/>').attr('data-component-foo', 'bar'), 'foo')).to.equal('bar');
        });

        it('should fallback to the class options if a data attribute does not exist', function() {
            component.options.foo = 'bar';

            expect(component.readOption($('<span/>'), 'foo')).to.equal('bar');
        });
    });

    describe('readValue()', function() {
        it('should return null if no query is defined', function() {
            expect(component.readValue($('<span/>'))).to.be.null;
        });

        it('should read from any attribute', function() {
            element = $('<span/>')
                .addClass('foo bar')
                .attr('id', 'baz')
                .attr('title', 'Test');

            expect(component.readValue(element, 'class')).to.equal('foo bar');
            expect(component.readValue(element, 'id')).to.equal('baz');
            expect(component.readValue(element, 'title')).to.equal('Test');
            expect(component.readValue(element, 'href')).to.be.undefined;

            element.remove();
        });

        it('should allow a callback to be used for querying', function() {
            element = $('<span/>')
                .addClass('foo bar')
                .attr('id', 'baz')
                .attr('title', 'Test');

            expect(component.readValue(element, function(el) {
                return el.prop('tagName') + '#' + el.attr('id');
            })).to.equal('SPAN#baz');

            element.remove();
        });
    });

    describe('setElement()', function() {
        it('should extract the namespace from the data attribute', function() {
            expect(component.namespace).to.equal('');

            component.setElement($('<div data-component="foobar"></div>'));

            expect(component.namespace).to.equal('foobar');

            component.element = baseElement;
        });
    });

    describe('setOptions()', function() {
        var opts, baseOpts;

        beforeEach(function() {
            opts = {};
            baseOpts = {
                className: '',
                cache: true,
                debug: true,
                groups: {
                    foo: {
                        className: 'foo',
                        cache: false
                    },
                    bar: {
                        className: 'bar',
                        debug: false,
                        responsive: {
                            breakpoint: '(media-query)',
                            cache: false
                        }
                    }
                }
            };
        });

        it('should inherit group options', function() {
            element = $('<span/>').attr('data-component-group', 'foo');
            opts = component.setOptions(baseOpts, element);
            delete opts.groups;

            expect(opts).to.deep.equal({
                ajax: {},
                cache: false,
                debug: true,
                context: null,
                className: 'foo'
            });
        });

        it('should inherit group options and persist `responsive` options', function() {
            element = $('<span/>').attr('data-component-group', 'bar');
            opts = component.setOptions(baseOpts, element);
            delete opts.groups;

            expect(opts).to.deep.equal({
                ajax: {},
                cache: true,
                debug: false,
                context: null,
                className: 'bar',
                responsive: {
                    breakpoint: '(media-query)',
                    cache: false
                }
            });
        });

        it('should not inherit group options if the key doesn\'t exist', function() {
            element = $('<span/>').attr('data-component-group', 'baz');
            opts = component.setOptions(baseOpts, element);
            delete opts.groups;

            expect(opts).to.deep.equal({
                ajax: {},
                cache: true,
                debug: true,
                context: null,
                className: ''
            });
        });

        it('should inherit options from an element', function() {
            element = $('<span/>').attr('data-component-classname', 'foo');
            opts = component.setOptions({ className: 'bar' }, element);

            expect(opts.className).to.equal('foo');
            expect(opts).to.deep.equal({
                ajax: {},
                cache: true,
                debug: false,
                context: null,
                className: 'foo'
            });

            element.remove();
        });

        it('should convert hover `mode` to mouseenter', function() {
            Toolkit.isTouch = false;

            opts = component.setOptions({ mode: 'hover' });

            expect(opts.mode).to.equal('mouseenter');
            expect(opts).to.deep.equal({
                ajax: {},
                cache: true,
                debug: false,
                context: null,
                className: '',
                mode: 'mouseenter'
            });
        });

        it('should convert hover to click for touch devices', function() {
            Toolkit.isTouch = false;

            opts = component.setOptions({ mode: 'hover' });

            expect(opts.mode).to.equal('mouseenter');

            Toolkit.isTouch = true;

            opts = component.setOptions({ mode: 'hover' });

            expect(opts.mode).to.equal('click');

            Toolkit.isTouch = false;
        });
    });

    describe('show()', function() {
        it('should show the element', function(done) {
            component.hide();

            setTimeout(function() {
                component.show();

                setTimeout(function () {
                    expect(component.element.css('display')).to.equal('block');

                    done();
                }, 10);
            }, 10);
        });

        it('should optionally set a node', function() {
            var oldNode = component.node,
                newNode = $('<a/>');

            expect(component.node.is(oldNode)).to.be.true;

            component.show(newNode);

            expect(component.node.is(oldNode)).to.be.false;
            expect(component.node.is(newNode)).to.be.true;

            component.node = oldNode;
            newNode.remove();
        });
    });

    describe('onRequestBefore()', function() {
        beforeEach(function() {
            delete component.cache['/url'];

            component.element
                .removeClass('is-loading')
                .aria('busy', false);
        });

        it('should set the loading state on the element', function() {
            expect(component.element.hasClass('is-loading')).to.be.false;
            expect(component.element.aria('busy')).to.equal('false');

            component.onRequestBefore({ url: '/url' });

            expect(component.element.hasClass('is-loading')).to.be.true;
            expect(component.element.aria('busy')).to.equal('true');
        });
    });

    describe('onRequestDone()', function() {
        var xhr = {
            url: '/url',
            cache: true,
            getResponseHeader: function() {
                return 'text/html';
            }
        };

        beforeEach(function() {
            component.cache['/url'] = true;

            component.element
                .addClass('is-loading')
                .aria('busy', true);
        });

        it('should remove the loading cached state', function() {
            xhr.cache = false;

            expect(component.cache).to.have.property('/url');

            component.onRequestDone('foo', 'success', xhr);

            expect(component.cache).to.not.have.property('/url');

            xhr.cache = true;
        });

        it('should set a new cache value if `xhr.cache` is true', function() {
            expect(component.cache['/url']).to.equal(true);

            component.onRequestDone('foo', 'success', xhr);

            expect(component.cache['/url']).to.equal('foo');

            // With another content type
            xhr.getResponseHeader = function() {
                return 'text/javascript';
            };

            component.onRequestDone('bar', 'success', xhr);

            expect(component.cache['/url']).to.be.undefined;
        });

        it('should remove the loading state on the element', function() {
            expect(component.element.hasClass('is-loading')).to.be.true;
            expect(component.element.aria('busy')).to.equal('true');

            component.onRequestDone('foo', 'success', xhr);

            expect(component.element.hasClass('is-loading')).to.be.false;
            expect(component.element.aria('busy')).to.equal('false');
        });
    });

    describe('onRequestFail()', function() {
        beforeEach(function() {
            component.cache['/url'] = true;

            component.element
                .addClass('is-loading')
                .aria('busy', true);
        });

        after(function() {
            component.element
                .removeClass('is-loading')
                .removeClass('has-failed')
                .aria('busy', false);
        });

        it('should remove the loading cached state', function() {
            expect(component.cache).to.have.property('/url');

            component.onRequestFail({ url: '/url' });

            expect(component.cache).to.not.have.property('/url');
        });

        it('should set the error state on the element', function() {
            expect(component.element.hasClass('is-loading')).to.be.true;
            expect(component.element.aria('busy')).to.equal('true');

            component.onRequestFail({ url: '/url' });

            expect(component.element.hasClass('is-loading')).to.be.false;
            expect(component.element.hasClass('has-failed')).to.be.true;
            expect(component.element.aria('busy')).to.equal('false');
        });
    });

    describe('destroy()', function() {
        before(function() {
            component.destroy();
        });
    });
});

describe('Toolkit.TemplateComponent', function() {
    var element, component;

    before(function () {
        component = new Toolkit.TemplateComponent();
        component.element = $('<span/>').addClass('show').appendTo('body');
        component.node = $('<span/>').appendTo('body');
    });

    after(function () {
        component.element.remove();
        component.node.remove();
    });

    describe('createElement()', function () {
        var comp;

        before(function () {
            comp = new Toolkit.TemplateComponent();
        });

        after(function () {
            comp = null;
        });

        afterEach(function () {
            if (element) {
                element.remove();
                element = null;
            }
        });

        it('should throw an error if no template', function () {
            expect(comp.createElement).to.throw(Error);
        });

        it('should create the element from `template`', function () {
            comp.options.template = '<b></b>';

            element = comp.createElement();

            expect(element.prop('tagName')).to.equal('B');
        });

        it('should use the element from `templateFrom`', function () {
            var from = $('<i></i>').attr('id', 'component-test').appendTo('body');

            comp.options.templateFrom = '#component-test';

            element = comp.createElement();

            expect(element.prop('tagName')).to.equal('I');

            from.remove();
        });

        it('should set the `className` and `animation` classes', function () {
            comp.options.className = 'foo';
            comp.options.animation = 'slide';

            element = comp.createElement();

            expect(element.hasClass('foo')).to.be.true;
            expect(element.hasClass('slide')).to.be.true;
        });

        it('should set an id attribute', function () {
            element = comp.createElement();

            expect(element.attr('id')).to.equal('toolkit-component-2');
        });
    });
});

});
