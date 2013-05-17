<h1>Flyout</h1>

<div class="example">
	<h2>Data Loading</h2>

	<a href="/" class="button flyout-1">Root Path</a>
	<a href="/3/0" class="button flyout-1">3 > 0 Path</a>
	<a href="/0/0/1" class="button flyout-1">0 > 0 > 1 Path</a>
</div>

<div class="example">
	<h2>Effects</h2>

	<p>Fade root menu in and out.</p>

	<a href="/" class="button flyout-2">Root Path</a>
	<a href="/2/1" class="button flyout-2">2 > 1 Path</a>
	<a href="/0/2/0" class="button flyout-2">0 > 2 > 0 Path</a>

	<p>Show menu on click instead of hover. Lower column split to 5.</p>

	<a href="/" class="button flyout-3">Root Path</a>
	<a href="/4/0" class="button flyout-3">4 > 0 Path</a>
	<a href="/1/1/0" class="button flyout-3">1 > 1 > 0 Path</a>

	<p>Alter the show and hide delay timers.</p>

	<a href="/" class="button flyout-4">Root Path</a>
	<a href="/3/1" class="button flyout-4">3 > 1 Path</a>
	<a href="/0/1/1" class="button flyout-4">0 > 1 > 1 Path</a>
</div>

<div class="example">
	<h2>Events</h2>

	<p>The following are supported: onInit, onShow, onHide, onShowChild, onHideChild</p>
</div>

<script type="text/javascript">
	window.addEvent('domready', function() {
		$$('.button').addEvent('click', function(e) {
			e.preventDefault();
		});

		Titon.Flyout.factory('.flyout-1', 'ajax/flyout.php');
		Titon.Flyout.factory('.flyout-2', 'ajax/flyout.php', { fade: 250 });
		Titon.Flyout.factory('.flyout-3', 'ajax/flyout.php', { mode: 'click', itemLimit: 5 });
		Titon.Flyout.factory('.flyout-4', 'ajax/flyout.php', { showDelay: 0, hideDelay: 200 });
		Titon.Flyout.factory('.flyout-missing', 'ajax/flyout.php');
	});
</script>