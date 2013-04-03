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
	<h2>Positioning</h2>

	<div class="row">
		<button type="button" class="button modal-tl" data-modal="ajax/modal.php">Top Left</button>
		<button type="button" class="button modal-tc" data-modal="ajax/modal.php">Top Center</button>
		<button type="button" class="button modal-tr" data-modal="ajax/modal.php">Top Right</button>
	</div>

	<div class="row">
		<button type="button" class="button modal-cl" data-modal="ajax/modal.php">Center Left</button>
		<button type="button" class="button modal-cc" data-modal="ajax/modal.php">Center (Default)</button>
		<button type="button" class="button modal-cr" data-modal="ajax/modal.php">Center Right</button>
	</div>

	<div class="row">
		<button type="button" class="button modal-bl" data-modal="ajax/modal.php">Bottom Left</button>
		<button type="button" class="button modal-bc" data-modal="ajax/modal.php">Bottom Center</button>
		<button type="button" class="button modal-br" data-modal="ajax/modal.php">Bottom Right</button>
	</div>
</div>

<div class="example">
	<h2>Events</h2>

	<button type="button" class="button modal-event" data-modal="ajax/modal.php">onShow, onHide</button>
	<button type="button" class="button modal-event2" data-modal="ajax/modal.php">onPosition</button>
	<button type="button" class="button modal-event3" data-modal="ajax/modal-form.php">onSubmit</button>
</div>

<script type="text/javascript">
	window.addEvent('domready', function() {
		Titon.Modal.factory('.modal-base');
		Titon.Modal.factory('.modal-black', { blackout: false });
		Titon.Modal.factory('.modal-drag', { draggable: true });
		Titon.Modal.factory('.modal-fade', { fade: true });
		Titon.Modal.factory('.modal-fixed', { fixed: false });
		Titon.Modal.factory('.modal-delay', { delay: 350 });
		Titon.Modal.factory('.modal-tl', { position: 'topLeft' });
		Titon.Modal.factory('.modal-tc', { position: 'topCenter' });
		Titon.Modal.factory('.modal-tr', { position: 'topRight' });
		Titon.Modal.factory('.modal-cl', { position: 'centerLeft' });
		Titon.Modal.factory('.modal-cc', { position: 'center' });
		Titon.Modal.factory('.modal-cr', { position: 'centerRight' });
		Titon.Modal.factory('.modal-bl', { position: 'bottomLeft' });
		Titon.Modal.factory('.modal-bc', { position: 'bottomCenter' });
		Titon.Modal.factory('.modal-br', { position: 'bottomRight' });
		Titon.Modal.factory('.modal-event', {
			onShow: function() {
				this.node.addClass('success');
			},
			onHide: function() {
				this.node.removeClass('success');
			}
		});
		Titon.Modal.factory('.modal-event2', {
			onPosition: function() {
				this.node.set('disabled', true);
				alert('Disabled the activating node!');
			}
		});
		Titon.Modal.factory('.modal-event3', {
			onSubmit: function(button) {
				button.addClass('error').set('text', 'Submitting...');
				alert('Changed the submit button!');
			}
		});
	});
</script>