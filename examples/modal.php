<div class="example-header">Modal</div>

<div class="example">
	<div class="example-title">Content Loading</div>

	<button type="button" class="button modal-base" data-modal="ajax/modal.php">Via AJAX</button>
	<button type="button" class="button modal-base" data-modal="ajax/modal.php?slow">Via AJAX w/ Loader</button>
	<button type="button" class="button modal-black" data-modal="ajax/modal.php">Via AJAX w/o Blackout</button>
</div>

<div class="example">
	<div class="example-title">Features</div>

	<button type="button" class="button modal-base" data-modal="ajax/modal-form.php">Form Submitting</button>
	<button type="button" class="button modal-drag" data-modal="ajax/modal.php">Dragging</button>
</div>

<div class="example">
	<div class="example-title">Animations</div>

	<button type="button" class="button modal-fade" data-modal="ajax/modal.php">Fade</button>
	<button type="button" class="button modal-from-above" data-modal="ajax/modal.php">From Above</button>
	<button type="button" class="button modal-from-below" data-modal="ajax/modal.php">From Below</button>
	<br>
	<button type="button" class="button modal-slide-in-top" data-modal="ajax/modal.php">Slide In Top</button>
	<button type="button" class="button modal-slide-in-bottom" data-modal="ajax/modal.php">Slide In Bottom</button>
	<button type="button" class="button modal-slide-in-left" data-modal="ajax/modal.php">Slide In Left</button>
	<button type="button" class="button modal-slide-in-right" data-modal="ajax/modal.php">Slide In Right</button>
	<br>
	<button type="button" class="button modal-sticky-top" data-modal="ajax/modal.php">Sticky Top</button>
	<button type="button" class="button modal-sticky-bottom" data-modal="ajax/modal.php">Sticky Bottom</button>
	<button type="button" class="button modal-sticky-left" data-modal="ajax/modal.php">Sticky Left</button>
	<button type="button" class="button modal-sticky-right" data-modal="ajax/modal.php">Sticky Right</button>
	<br>
	<button type="button" class="button modal-flip" data-modal="ajax/modal.php">Flip Horizontal</button>
	<button type="button" class="button modal-flip-vert" data-modal="ajax/modal.php">Flip Vertical</button>
</div>

<div class="example">
	<div class="example-title">Events</div>

	<p>onInit, onShow, onHide, onSubmit</p>
</div>

<script type="text/javascript">
	window.addEvent('domready', function() {
		Titon.Modal.factory('.modal-base', { blur: 'wrapper' });
		Titon.Modal.factory('.modal-black', { blackout: false });
		Titon.Modal.factory('.modal-drag', { draggable: true });
		Titon.Modal.factory('.modal-fade', { animation: 'fade' });
		Titon.Modal.factory('.modal-from-above', { animation: 'from-above' });
		Titon.Modal.factory('.modal-from-below', { animation: 'from-below' });
		Titon.Modal.factory('.modal-slide-in-top', { animation: 'slide-in-top' });
		Titon.Modal.factory('.modal-slide-in-right', { animation: 'slide-in-right' });
		Titon.Modal.factory('.modal-slide-in-bottom', { animation: 'slide-in-bottom' });
		Titon.Modal.factory('.modal-slide-in-left', { animation: 'slide-in-left' });
		Titon.Modal.factory('.modal-sticky-top', { animation: 'sticky-top' });
		Titon.Modal.factory('.modal-sticky-bottom', { animation: 'sticky-bottom' });
		Titon.Modal.factory('.modal-sticky-left', { animation: 'sticky-left' });
		Titon.Modal.factory('.modal-sticky-right', { animation: 'sticky-right' });
		Titon.Modal.factory('.modal-flip', { animation: 'flip' });
		Titon.Modal.factory('.modal-flip-vert', { animation: 'flip-vert' });
	});
</script>