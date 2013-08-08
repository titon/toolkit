<?php if (isset($_GET['slow'])) {
	sleep(1);
} ?>

<div class="modal-head">
	<h4>Modal Title</h4>
</div>

<div class="modal-body">
	This is loaded from an AJAX call. The modal inner markup should also be present in the AJAX response as the class does not handle that functionality.
</div>

<div class="modal-foot">
	<button type="button" class="button modal-event-close">Close</button>
</div>