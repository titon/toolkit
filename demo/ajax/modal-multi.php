<?php if (isset($_GET['slow'])) {
    sleep(1);
} ?>

<div class="modal-head">
    <h4>Multiple Modals</h4>
</div>

<div class="modal-body">
    Defining 2 separate modal instances allows 2 modals to be displayed at the same time.
</div>

<div class="modal-foot">
    <button type="button" class="button modal-hide">Close</button>
</div>