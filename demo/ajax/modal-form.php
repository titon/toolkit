<form action="ajax/modal-form.php" method="post">
    <div class="modal-head">
        <h4>AJAX Load w/ Form Submission</h4>
    </div>

    <div class="modal-body">
        <?php if ($_POST) {
            print_r($_POST);
        } else { ?>
            <p>By adding the class "modal-submit" to the submit button of a modal form, the form can be submitted via AJAX.
            The response of the AJAX call will replace the current modal. Give it a try!</p>

            <p><label for="name">Name:</label> <input type="text" name="name" id="name"></p>
        <?php } ?>
    </div>

    <div class="modal-foot">
        <button type="button" class="button info modal-submit">Submit</button>
        <button type="button" class="button modal-hide">Close</button>
    </div>
</form>