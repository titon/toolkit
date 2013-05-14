<h1>Type Ahead</h1>

<div class="example">
	<p>Array: Source data is defined as a literal array.</p>

	<input type="text" id="ta-1">
</div>

<div class="example">
	<p>Function: Source data is returned from a function.<br>
	Menu also fades in.</p>

	<input type="text" id="ta-2">
</div>

<div class="example">
	<p>AJAX: Source data is returned from an AJAX call on demand.<br>
	Sorting and matching is handled by the remote endpoint.</p>

	<input type="text" id="ta-3">
</div>

<div class="example">
	<p>AJAX-Prefetch: Source data is returned from an AJAX call that is pre-fetched and cached.<br>
	Sorting and matching is handled within Type Ahead.</p>

	<input type="text" id="ta-4">
</div>

<script type="text/javascript">
	window.addEvent('domready', function() {
		var langs = [
			{ title: 'PHP', description: 'Pre-HyperText Processor' },
			{ title: 'HTML', description: 'Hyper Text Markup Language' },
			{ title: 'Javascript' },
			{ title: 'MooTools' },
			{ title: 'jQuery' },
			{ title: 'Ruby' },
			{ title: 'Ruby on Rails' },
			{ title: 'Java' },
			{ title: 'Python' }
		];

		Titon.TypeAhead.factory('ta-1', {
			source: langs
		});

		Titon.TypeAhead.factory('ta-2', {
			fade: 250,
			source: function() {
				return langs;
			}
		});

		Titon.TypeAhead.factory('ta-3', {
			sorter: false,
			matcher: false,
			source: 'ajax/type-ahead.php?unique'
		});

		Titon.TypeAhead.factory('ta-4', {
			prefetch: true,
			source: 'ajax/type-ahead.php'
		});
	});
</script>