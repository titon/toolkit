<h1>Modal</h1>

<div class="example">
	<h2>Content Loading</h2>

	<button type="button" class="button modal-base" data-modal="ajax/modal.php">Via AJAX</button>
	<button type="button" class="button modal-base" data-modal="ajax/modal.php?slow">Via AJAX w/ Loader</button>
	<button type="button" class="button modal-black" data-modal="ajax/modal.php">Via AJAX w/o Blackout</button>
</div>

<div class="example">
	<h2>Features</h2>

	<button type="button" class="button modal-base" data-modal="ajax/modal-form.php">Form Submitting</button>
	<button type="button" class="button modal-drag" data-modal="ajax/modal.php">Dragging</button>
</div>

<div class="example">
	<h2>Effects</h2>

	<button type="button" class="button modal-fade" data-modal="ajax/modal.php">Fade In/Out</button>
	<button type="button" class="button modal-fixed" data-modal="ajax/modal.php">Non-Fixed Position</button>
	<button type="button" class="button modal-delay" data-modal="ajax/modal.php">Show Delay</button>
</div>

<div class="example">
	<h2>Events</h2>

	<p>The following are supported: onInit, onShow, onHide, onSubmit</p>
</div>

<script type="text/javascript">
	window.addEvent('domready', function() {
		Titon.Modal.factory('.modal-base', { blur: 'wrapper' });
		Titon.Modal.factory('.modal-black', { blackout: false });
		Titon.Modal.factory('.modal-drag', { draggable: true });
		Titon.Modal.factory('.modal-fade', { fade: 250 });
		Titon.Modal.factory('.modal-fixed', { fixed: false });
		Titon.Modal.factory('.modal-delay', { delay: 350 });
	});
</script>