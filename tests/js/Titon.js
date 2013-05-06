define([
	'intern!tdd',
	'intern/chai!assert',
	'../../src/js/Titon'
], function (tdd, assert, Titon) {
	with (tdd) {
		suite('Titon', function () {
			test('creation', function () {
				assert.equal(1, 5);
			});

			/*var widget;

			tdd.before(function () {
				widget = new MyWidget();
			});

			tdd.after(function () {
				widget.destroy();
			});

			tdd.test('creation', function () {
				assert(widget.children.length > 0, 'Widget should have children');
			});*/
		});
	}
});