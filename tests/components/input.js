define([
    'jquery',
    '../../js/components/input'
], function($) {

describe('Toolkit.Input', function() {
    var element, form,
        expected = '<form action="" method="post">' +
            '<div class="custom-input"><input type="checkbox" name="foo" id="foo"><label class="checkbox" for="foo"></label></div>' +
            '<div class="custom-input"><input type="radio" name="bar" id="bar"><label class="radio" for="bar"></label></div>' +
            '<div class="custom-input"><select name="baz" id="baz" style="min-height: 39px; z-index: 1;"><option value="">Option</option></select>' +
                '<div class="select" data-select="" style="min-width: 0px;"><div class="select-arrow" data-select-arrow=""><span class="caret-down"></span></div><div class="select-label" data-select-label="">Option</div></div>' +
                '<div class="drop drop--down select-options" data-select-options="" role="listbox" aria-multiselectable="false"><ul><li class="is-active"><a href="javascript:;" role="option" aria-selected="true">Option</a></li></ul></div>' +
            '</div>' +
        '</form>';

    before(function() {
        element = $('<div/>').appendTo('body');
        form = $('<form action="" method="post"></form>').appendTo(element).html(
            '<input type="checkbox" name="foo" id="foo">' +
            '<input type="radio" name="bar" id="bar">' +
            '<select name="baz" id="baz"><option value="">Option</option></select>'
        );
    });

    after(function() {
        element.remove();
    });

    describe('constructor()', function() {
        it('should wrap all checkboxes, radios, and selects', function() {
            expect(form.toString()).to.equal('<form action="" method="post"><input type="checkbox" name="foo" id="foo"><input type="radio" name="bar" id="bar"><select name="baz" id="baz"><option value="">Option</option></select></form>');

            form.input();

            expect(form.toString()).to.equal(expected);
        });
    });

    describe('copyClasses()', function() {
        var a, b;

        beforeEach(function() {
            a = $('<span/>').addClass('foo bar');
            b = $('<span/>').addClass('foo input baz');
        });

        afterEach(function() {
            a.remove();
            b.remove();
        });

        it('should copy classes from one element to another', function() {
            expect(b.attr('class')).to.equal('foo input baz');

            form.toolkit('input').copyClasses(a, b);

            expect(b.attr('class')).to.equal('foo input baz bar');
        });

        it('should not copy classes that are filtered', function() {
            expect(a.attr('class')).to.equal('foo bar');

            form.toolkit('input').copyClasses(b, a);

            expect(a.attr('class')).to.equal('foo bar baz');
        });
    });

    describe('destroy()', function() {
        it('should unwrap all checkboxes, radios, and selects', function() {
            expect(form.toString()).to.equal(expected);

            form.toolkit('input', 'destroy');

            expect(form.toString()).to.equal('<form action="" method="post"><input type="checkbox" name="foo" id="foo"><input type="radio" name="bar" id="bar"><select name="baz" id="baz"><option value="">Option</option></select></form>');
        });
    });
});

describe('Toolkit.InputCheckbox', function() {
    var element, checkbox;

    before(function() {
        element = $('<div/>').appendTo('body');
        checkbox = $('<input type="checkbox" name="foo" id="bar">').appendTo(element);
    });

    after(function() {
        element.remove();
    });

    describe('constructor()', function() {
        it('should wrap the checkbox', function() {
            expect(element.toString()).to.equal('<div><input type="checkbox" name="foo" id="bar"></div>');

            checkbox.inputCheckbox();

            expect(element.toString()).to.equal('<div><div class="custom-input"><input type="checkbox" name="foo" id="bar"><label class="checkbox" for="bar"></label></div></div>');
        });
    });

    describe('destroy()', function() {
        it('should unwrap the checkbox', function() {
            expect(element.toString()).to.equal('<div><div class="custom-input"><input type="checkbox" name="foo" id="bar"><label class="checkbox" for="bar"></label></div></div>');

            checkbox.toolkit('inputCheckbox', 'destroy');

            expect(element.toString()).to.equal('<div><input type="checkbox" name="foo" id="bar"></div>');
        });
    });
});

describe('Toolkit.InputRadio', function() {
    var element, radio;

    before(function() {
        element = $('<div/>').appendTo('body');
        radio = $('<input type="radio" name="foo" id="bar">').appendTo(element);
    });

    after(function() {
        element.remove();
    });

    describe('constructor()', function() {
        it('should wrap the radio', function() {
            expect(element.toString()).to.equal('<div><input type="radio" name="foo" id="bar"></div>');

            radio.inputRadio();

            expect(element.toString()).to.equal('<div><div class="custom-input"><input type="radio" name="foo" id="bar"><label class="radio" for="bar"></label></div></div>');
        });
    });

    describe('destroy()', function() {
        it('should unwrap the radio', function() {
            expect(element.toString()).to.equal('<div><div class="custom-input"><input type="radio" name="foo" id="bar"><label class="radio" for="bar"></label></div></div>');

            radio.toolkit('inputRadio', 'destroy');

            expect(element.toString()).to.equal('<div><input type="radio" name="foo" id="bar"></div>');
        });
    });
});

describe('Toolkit.InputSelect', function() {
    var element, select, input;

    before(function() {
        element = $('<div/>').appendTo('body');
    });

    after(function() {
        element.remove();
    });

    describe('constructor()', function() {
        afterEach(function() {
            select.toolkit('inputSelect', 'destroy');
            select.remove();
        });

        it('should wrap the select', function() {
            select = $('<select name="foo"></select>').appendTo(element);

            expect(element.toString()).to.equal('<div><select name="foo"></select></div>');

            select.inputSelect({ native: true });

            expect(element.toString()).to.equal('<div><div class="custom-input"><select name="foo" style="min-height: 39px;"></select><div class="select" data-select="" style="min-width: 0px;"><div class="select-arrow" data-select-arrow=""><span class="caret-down"></span></div><div class="select-label" data-select-label=""></div></div></div></div>');
        });

        it('should not wrap if multi-select and `native` is enabled', function() {
            select = $('<select name="foo" multiple></select>').appendTo(element);

            expect(element.toString()).to.equal('<div><select name="foo" multiple=""></select></div>');

            select.inputSelect({ native: true });

            expect(element.toString()).to.equal('<div><select name="foo" multiple=""></select></div>');
        });

        it('should not create a custom dropdown if `native` is enabled', function() {
            select = $('<select name="foo"></select>').appendTo(element).inputSelect({ native: true });

            expect(element.find('[data-select-options]').length).to.equal(0);
        });

        it('should create a custom dropdown if `native` is disabled', function() {
            select = $('<select name="foo"></select>').appendTo(element).inputSelect({ native: false });

            expect(element.find('[data-select-options]').length).to.equal(1);
        });
    });

    describe('hide()', function() {
        it('should hide the drop down', function(done) {
            select = $('<select name="foo"></select>').appendTo(element).inputSelect();
            input = select.toolkit('inputSelect');

            input.show();

            setTimeout(function() {
                expect(input.dropdown.is(':shown')).to.be.true;
                expect(input.input.hasClass('is-active')).to.be.true;

                input.hide();

                expect(input.dropdown.is(':shown')).to.be.false;
                expect(input.input.hasClass('is-active')).to.be.false;

                select.remove();

                done();
            }, 10);
        });
    });

    describe('show()', function() {
        it('should show the drop down', function(done) {
            select = $('<select name="foo"></select>').appendTo(element).inputSelect();
            input = select.toolkit('inputSelect');

            input.hide();

            expect(input.dropdown.is(':shown')).to.be.false;
            expect(input.input.hasClass('is-active')).to.be.false;

            input.show();

            setTimeout(function() {
                expect(input.dropdown.is(':shown')).to.be.true;
                expect(input.input.hasClass('is-active')).to.be.true;

                select.remove();

                done();
            }, 10);
        });
    });

    describe('_buildDropdown()', function() {
        afterEach(function() {
            select.remove();
            input = null;
        });

        it('should set ARIA attributes', function() {
            select = $('<select name="foo"></select>').appendTo(element).inputSelect();
            input = select.toolkit('inputSelect');

            expect(input.dropdown.attr('role')).to.equal('listbox');
            expect(input.dropdown.aria('multiselectable')).to.equal('false');
        });

        it('should set classes and state for multi-selects', function() {
            select = $('<select name="foo" multiple></select>').appendTo(element).inputSelect();
            input = select.toolkit('inputSelect');

            expect(input.dropdown.hasClass('is-multiple')).to.be.true;
            expect(input.dropdown.aria('multiselectable')).to.equal('true');
        });

        it('should set `hideFirst` and `hideSelected` classes', function() {
            select = $('<select name="foo"></select>').appendTo(element).inputSelect({
                hideFirst: true,
                hideSelected: true
            });

            input = select.toolkit('inputSelect');

            expect(input.dropdown.hasClass('hide-first')).to.be.true;
            expect(input.dropdown.hasClass('hide-selected')).to.be.true;
        });

        it('should convert options to list items', function() {
            select = $('<select name="foo"><option value="1">Foo</option><option value="2">Bar</option></select>').appendTo(element).inputSelect();
            input = select.toolkit('inputSelect');

            expect(input.dropdown.html()).to.equal('<ul><li class="is-active"><a href="javascript:;" role="option" aria-selected="true">Foo</a></li><li><a href="javascript:;" role="option" aria-selected="false">Bar</a></li></ul>');
        });

        it('should convert optgroups to list dividers', function() {
            select = $('<select name="foo"><optgroup label="Group"><option value="1">Foo</option><option value="2">Bar</option></optgroup></select>').appendTo(element).inputSelect();
            input = select.toolkit('inputSelect');

            expect(input.dropdown.html()).to.equal('<ul><li class="drop-heading">Group</li><li class="is-active"><a href="javascript:;" role="option" aria-selected="true">Foo</a></li><li><a href="javascript:;" role="option" aria-selected="false">Bar</a></li></ul>');
        });
    });

    describe('_buildOption()', function() {
        before(function() {
            select = $('<select name="foo"></select>').appendTo(element).inputSelect();
            input = select.toolkit('inputSelect');
        });

        after(function() {
            select.remove();
            input = null;
        });

        it('should convert an option to a list item', function() {
            expect(input._buildOption($('<option value="1">Foo</option>')).toString()).to.equal('<li><a href="javascript:;" role="option" aria-selected="false">Foo</a></li>');
        });

        it('should represent a selected state', function() {
            expect(input._buildOption($('<option value="1" selected>Foo</option>')).toString()).to.equal('<li class="is-active"><a href="javascript:;" role="option" aria-selected="true">Foo</a></li>');
        });

        it('should represent a disabled state', function() {
            expect(input._buildOption($('<option value="1" disabled>Foo</option>')).toString()).to.equal('<li class="is-disabled"><a href="javascript:;" role="option" aria-selected="false" aria-disabled="true">Foo</a></li>');
        });

        it('should render custom descriptions', function() {
            expect(input._buildOption($('<option value="1" data-description="Lorem ipsum.">Foo</option>')).toString()).to.equal('<li><a href="javascript:;" role="option" aria-selected="false">Foo<span class="drop-desc">Lorem ipsum.</span></a></li>');
        });
    });

});

});