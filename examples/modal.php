
<div class="example-center">
    <button type="button" class="button js-modal" data-modal="ajax/modal.php?slow">Open Modal</button>
    <button type="button" class="button js-modal" data-modal="ajax/modal-form.php">Open Modal w/ Form</button>
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