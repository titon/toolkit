define([
    'jquery',
    '../js/class'
], function($, Class) {

describe('Toolkit.Class', function() {
    var Parent = Class.extend({
        name: 'Parent',
        array: [1, 2, 3],
        object: { foo: 'bar' },
        constructor: function(key) { this.key = key; },
        parent: function() { return 'parent'; }
    }, {
        foo: 'bar'
    });

    var Child = Parent.extend({
        name: 'Child',
        object: { bar: 'baz' },
        constructor: function(key) { this.key = key + ':override'; },
        child: function() { return 'child'; }
    }, {
        bar: 'baz'
    });

    var GrandChild = Child.extend({
        name: 'GrandChild',
        child: function() { return 'child:override'; },
        grandChild: function() { return 'grandChild'; }
    }, {
        baz: 'foo'
    });

    var a = new Parent('A'),
        b = new Child('B'),
        c = new GrandChild('C'),
        c2 = new GrandChild();

    it('should inherit from the parent class', function() {
        expect(b).to.have.property('parent');
        expect(c).to.have.property('parent');

        expect(b.array).to.deep.equal([1, 2, 3]);
        expect(c.parent()).to.equal('parent');
    });

    it('should clone properties to break references', function() {
        expect(b.array).to.deep.equal(c.array);
        expect(b.object).to.deep.equal(c.object);

        b.array.push(4);
        c.array.push(5);

        b.object.type = 'child';
        c.object.type = 'grandchild';

        expect(b.array).to.not.deep.equal(c.array);
        expect(b.object).to.not.deep.equal(c.object);

        delete b.object.type;
        delete c.object.type;
    });

    it('should merge properties and methods into the prototype', function() {
        expect(a).to.not.have.property('child');
        expect(b).to.not.have.property('grandChild');
        expect(b.name).to.equal('Child');
    });

    it('should overwrite parent members if a collision occurs', function() {
        expect(a.object).to.not.deep.equal(b.object);
        expect(c.object).to.deep.equal(b.object);

        expect(b.child()).to.equal('child');
        expect(c.child()).to.equal('child:override');
    });

    it('should increase the UID count per instance', function() {
        expect(c.uid).to.equal(1);
        expect(c2.uid).to.equal(2);
        expect(GrandChild.count).to.equal(2);

        var c3 = new GrandChild();

        expect(c3.uid).to.equal(3);
        expect(GrandChild.count).to.equal(3);
    });

    it('should auto-create the CSS class name property', function() {
        expect(a.cssClass).to.equal('parent');
        expect(b.cssClass).to.equal('child');
        expect(c.cssClass).to.equal('grand-child');
    });

    it('should auto-create the key name property', function() {
        expect(a.keyName).to.equal('parent');
        expect(b.keyName).to.equal('child');
        expect(c.keyName).to.equal('grandChild');
    });

    it('should trigger custom constructors', function() {
        expect(a.key).to.equal('A');
        expect(b.key).to.equal('B:override');
        expect(c.key).to.equal('C:override');
    });
});

});
