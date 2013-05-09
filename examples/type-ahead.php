<h1>Type Ahead</h1>

<div class="example">
	<h2>Default</h2>

	<input type="text" id="ta-1">
</div>

<div class="example">
	<h2>Source Function</h2>

	<input type="text" id="ta-2">
</div>

<div class="example">
	<h2>Source AJAX</h2>

	<input type="text" id="ta-3">
</div>

<script type="text/javascript">
	window.addEvent('domready', function() {
		var langs = ['PHP', 'HTML', 'Javascript', 'MooTools', 'jQuery', 'Ruby', 'RoR', 'Java', 'Python'];

		Titon.TypeAhead.factory('ta-1', {
			source: langs
		});

		Titon.TypeAhead.factory('ta-2', {
			source: function() {
				return langs;
			}
		});

		Titon.TypeAhead.factory('ta-3', {
			source: 'ajax/type-ahead.php'
		});
	});
</script>