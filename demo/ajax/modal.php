<?php if (isset($_GET['slow'])) {
    sleep(1);
} ?>

<div class="modal-head">
    <h4>AJAX Load</h4>
</div>

<div class="modal-body">
    This is loaded from an AJAX call. The modal inner markup should also be present in the AJAX response as the class does not handle that functionality.
</div>

<div class="modal-foot">
    <a href="ajax/modal-multi.php" class="button js-modal2">Open Second Modal</a>
    <a href="ajax/modal-multi.php" class="button js-modal">Open Another Modal</a>
    <button type="button" class="button modal-hide">Close</button>
</div>