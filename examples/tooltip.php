<div class="example-header">Tooltip</div>

<div class="example">
	<div class="example-title">Content Loading</div>

	<button type="button" class="button tooltip-attr" title="This is the title attribute">Via Title Attribute</button>
	<button type="button" class="button tooltip-base" data-tooltip="This is the data-tooltip attribute">Via Data Attribute (Default)</button>
	<button type="button" class="button tooltip-base" data-tooltip="#hidden">Via DOM Element</button>
	<button type="button" class="button tooltip-ajax" data-tooltip="ajax/tooltip.php">Via AJAX</button>
	<button type="button" class="button tooltip-ajax" data-tooltip="ajax/tooltip.php?slow">Via AJAX w/ Loader</button>

	<div id="hidden" style="display: none">This is loaded from a hidden DOM element</div>
</div>

<div class="example">
	<div class="example-title">Options</div>

	<button type="button" class="button tooltip-click" data-tooltip="Tooltip is shown and hidden with mouse click">Click Toggle</button>
	<button type="button" class="button tooltip-delay" data-tooltip="Tooltip is shown after 300ms">Show Delay</button>
	<button type="button" class="button tooltip-base" data-tooltip="#hidden" title="Custom Title">Title and Content</button>
	<button type="button" class="button tooltip-offset" data-tooltip="Tooltip will have its axis altered">X/Y Offsets</button>
</div>

<div class="example">
	<div class="example-title">Animations</div>

	<button type="button" class="button tooltip-fade" data-tooltip="Tooltip will fade in and out">Fade In/Out</button>
	<button type="button" class="button tooltip-from-above" data-tooltip="Tooltip is falls in from above">From Above</button>
	<button type="button" class="button tooltip-from-below" data-tooltip="Tooltip is moves in from below">From Below</button>
	<button type="button" class="button tooltip-flip-rotate" data-tooltip="Tooltip will flip and rotate into place">Flip Rotate</button>
	<button type="button" class="button tooltip-slide-in" data-tooltip="Tooltip will slide into place (works on all directions)">Slide In</button>
</div>

<div class="example">
	<div class="example-title">Positioning</div>

	<div class="row">
		<button type="button" class="button tooltip-tl" data-tooltip="Positioned at top left">Top Left</button>
		<button type="button" class="button tooltip-tc" data-tooltip="Positioned at top center">Top Center</button>
		<button type="button" class="button tooltip-tr" data-tooltip="Positioned at top right">Top Right (Default)</button>
	</div>

	<div class="row">
		<button type="button" class="button tooltip-cl" data-tooltip="Positioned at center left">Center Left</button>
		<button type="button" class="button tooltip-cr" data-tooltip="Positioned at center right">Center Right</button>
	</div>

	<div class="row">
		<button type="button" class="button tooltip-bl" data-tooltip="Positioned at bottom left">Bottom Left</button>
		<button type="button" class="button tooltip-bc" data-tooltip="Positioned at bottom center">Bottom Center</button>
		<button type="button" class="button tooltip-br" data-tooltip="Positioned at bottom right">Bottom Right</button>
	</div>

	<p>Tooltips can also follow the mouse trail.</p>

	<div class="row">
		<button type="button" class="button tooltip-mtl" data-tooltip="Positioned at top left">Top Left</button>
		<button type="button" class="button tooltip-mtc" data-tooltip="Positioned at top center">Top Center</button>
		<button type="button" class="button tooltip-mtr" data-tooltip="Positioned at top right">Top Right (Default)</button>
	</div>

	<div class="row">
		<button type="button" class="button tooltip-mcl" data-tooltip="Positioned at center left">Center Left</button>
		<button type="button" class="button tooltip-mcr" data-tooltip="Positioned at center right">Center Right</button>
	</div>

	<div class="row">
		<button type="button" class="button tooltip-mbl" data-tooltip="Positioned at bottom left">Bottom Left</button>
		<button type="button" class="button tooltip-mbc" data-tooltip="Positioned at bottom center">Bottom Center</button>
		<button type="button" class="button tooltip-mbr" data-tooltip="Positioned at bottom right">Bottom Right</button>
	</div>
</div>

<div class="example">
	<div class="example-title">Events</div>

	<p>onInit, onShow, onHide</p>
</div>

<script type="text/javascript">
	window.addEvent('domready', function() {
		Titon.Tooltip.factory('.tooltip-base');
		Titon.Tooltip.factory('.tooltip-attr', { getTitle: false, getContent: 'title' });
		Titon.Tooltip.factory('.tooltip-ajax', { ajax: true });
		Titon.Tooltip.factory('.tooltip-fade', { animation: 'fade' });
		Titon.Tooltip.factory('.tooltip-from-above', { animation: 'from-above' });
		Titon.Tooltip.factory('.tooltip-from-below', { animation: 'from-below' });
		Titon.Tooltip.factory('.tooltip-flip-rotate', { animation: 'flip-rotate' });
		Titon.Tooltip.factory('.tooltip-slide-in', { animation: 'slide-in' });
		Titon.Tooltip.factory('.tooltip-click', { mode: 'click' });
		Titon.Tooltip.factory('.tooltip-delay', { delay: 250 });
		Titon.Tooltip.factory('.tooltip-offset', { xOffset: 15, yOffset: 15 });
		Titon.Tooltip.factory('.tooltip-tl', { position: 'topLeft' });
		Titon.Tooltip.factory('.tooltip-tc', { position: 'topCenter' });
		Titon.Tooltip.factory('.tooltip-tr', { position: 'topRight' });
		Titon.Tooltip.factory('.tooltip-cl', { position: 'centerLeft' });
		Titon.Tooltip.factory('.tooltip-cr', { position: 'centerRight' });
		Titon.Tooltip.factory('.tooltip-bl', { position: 'bottomLeft' });
		Titon.Tooltip.factory('.tooltip-bc', { position: 'bottomCenter' });
		Titon.Tooltip.factory('.tooltip-br', { position: 'bottomRight' });
		Titon.Tooltip.factory('.tooltip-mtl', { position: 'topLeft', follow: true });
		Titon.Tooltip.factory('.tooltip-mtc', { position: 'topCenter', follow: true });
		Titon.Tooltip.factory('.tooltip-mtr', { position: 'topRight', follow: true });
		Titon.Tooltip.factory('.tooltip-mcl', { position: 'centerLeft', follow: true });
		Titon.Tooltip.factory('.tooltip-mcr', { position: 'centerRight', follow: true });
		Titon.Tooltip.factory('.tooltip-mbl', { position: 'bottomLeft', follow: true });
		Titon.Tooltip.factory('.tooltip-mbc', { position: 'bottomCenter', follow: true });
		Titon.Tooltip.factory('.tooltip-mbr', { position: 'bottomRight', follow: true });
		Titon.Tooltip.factory('.tooltip-missing');
	});
</script>