
<div class="example-center">
    <button type="button" class="button js-modal" data-modal="ajax/modal.php?slow">Open Modal</button>
    <button type="button" class="button js-modal" data-modal="ajax/modal-form.php">Open Modal w/ Form</button>
    <button type="button" class="button js-modal" data-modal="#hidden">Open Modal w/ DOM</button>

    <div id="hidden" style="display: none">
        <div class="modal-head"><h4>DOM Loaded</h4></div>
        <div class="modal-body">This content is loaded from a hidden DOM element. This approach requires the markup to be in the page.</div>
        <div class="modal-foot">
            <button type="button" class="button modal-event-close">Close</button>
        </div>
    </div>
</div>

<script>
    <?php if ($vendor  === 'mootools') { ?>
        window.addEvent('domready', function() {
            $$('.js-modal').modal({
                animation: <?php string('animation', 'fade'); ?>,
                className: <?php string('className'); ?>,
                ajax: <?php bool('ajax', true); ?>,
                draggable: <?php bool('draggable', false); ?>,
                blackout: <?php bool('blackout', true); ?>,
                showLoading: <?php bool('showLoading', true); ?>,
                fullScreen: <?php bool('fullScreen', false); ?>
            });
        });
    <?php } else { ?>
        $(function() {
            $('.js-modal').modal({
                animation: <?php string('animation', 'fade'); ?>,
                className: <?php string('className'); ?>,
                ajax: <?php bool('ajax', true); ?>,
                draggable: <?php bool('draggable', false); ?>,
                blackout: <?php bool('blackout', true); ?>,
                showLoading: <?php bool('showLoading', true); ?>,
                fullScreen: <?php bool('fullScreen', false); ?>
            });
        });
    <?php } ?>
</script>