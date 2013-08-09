<div class="example-header">Popover</div>

<div class="example">
	<div class="example-title">Content Loading</div>

	<button type="button" class="button popover-base" data-popover="This is the data-popover attribute">Via Data Attribute (Default)</button>
	<button type="button" class="button popover-base" data-popover="#hidden">Via DOM Element</button>
	<button type="button" class="button popover-ajax" data-popover="ajax/popover.php">Via AJAX</button>
	<button type="button" class="button popover-ajax" data-popover="ajax/popover.php?slow">Via AJAX w/ Loader</button>

	<div id="hidden" style="display: none">This is loaded from a hidden DOM element</div>
</div>

<div class="example">
	<div class="example-title">Options</div>

	<button type="button" class="button popover-delay" data-popover="Popover is shown after 300ms">Show Delay</button>
	<button type="button" class="button popover-base" data-popover="#hidden" title="Custom Title">Title and Content</button>
	<button type="button" class="button popover-offset" data-popover="Popover will have its axis altered">X/Y Offsets</button>
</div>

<div class="example">
	<div class="example-title">Animations</div>

	<button type="button" class="button popover-fade" data-popover="Popover will fade in and out">Fade In/Out</button>
	<button type="button" class="button popover-from-above" data-popover="Popover is falls in from above">From Above</button>
	<button type="button" class="button popover-from-below" data-popover="Popover is moves in from below">From Below</button>
	<button type="button" class="button popover-flip-rotate" data-popover="Popover will flip and rotate into place">Flip Rotate</button>
	<button type="button" class="button popover-slide-in" data-popover="Popover will slide into place (works on all directions)">Slide In</button>
</div>

<div class="example">
	<div class="example-title">Positioning</div>

	<div class="row">
		<button type="button" class="button popover-tl" data-popover="Positioned at top left">Top Left</button>
		<button type="button" class="button popover-tc" data-popover="Positioned at top center">Top Center (Default)</button>
		<button type="button" class="button popover-tr" data-popover="Positioned at top right">Top Right</button>
	</div>

	<div class="row">
		<button type="button" class="button popover-cl" data-popover="Positioned at center left">Center Left</button>
		<button type="button" class="button popover-cr" data-popover="Positioned at center right">Center Right</button>
	</div>

	<div class="row">
		<button type="button" class="button popover-bl" data-popover="Positioned at bottom left">Bottom Left</button>
		<button type="button" class="button popover-bc" data-popover="Positioned at bottom center">Bottom Center</button>
		<button type="button" class="button popover-br" data-popover="Positioned at bottom right">Bottom Right</button>
	</div>
</div>

<div class="example">
	<div class="example-title">Events</div>

	<p>onInit, onShow, onHide</p>
</div>

<script type="text/javascript">
	window.addEvent('domready', function() {
		Titon.Popover.factory('.popover-base');
		Titon.Popover.factory('.popover-ajax', { ajax: true });
		Titon.Popover.factory('.popover-delay', { delay: 250 });
		Titon.Popover.factory('.popover-offset', { xOffset: 15, yOffset: 15 });
		Titon.Popover.factory('.popover-fade', { animation: 'fade' });
		Titon.Popover.factory('.popover-from-above', { animation: 'from-above' });
		Titon.Popover.factory('.popover-from-below', { animation: 'from-below' });
		Titon.Popover.factory('.popover-flip-rotate', { animation: 'flip-rotate' });
		Titon.Popover.factory('.popover-slide-in', { animation: 'slide-in' });
		Titon.Popover.factory('.popover-tl', { position: 'topLeft' });
		Titon.Popover.factory('.popover-tc', { position: 'topCenter' });
		Titon.Popover.factory('.popover-tr', { position: 'topRight' });
		Titon.Popover.factory('.popover-cl', { position: 'centerLeft' });
		Titon.Popover.factory('.popover-cr', { position: 'centerRight' });
		Titon.Popover.factory('.popover-bl', { position: 'bottomLeft' });
		Titon.Popover.factory('.popover-bc', { position: 'bottomCenter' });
		Titon.Popover.factory('.popover-br', { position: 'bottomRight' });
		Titon.Popover.factory('.popover-missing');
	});
</script>