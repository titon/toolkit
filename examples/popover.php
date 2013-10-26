
<a href="ajax/popover.php" class="button js-popover" data-popover="This content is read from the data-popover attribute.">Show Popover</a>
<a href="ajax/popover.php?slow" class="button js-popover" title="Popover Title" data-popover="#hidden">Show Popover w/ Title</a>

<div id="hidden" style="display: none">This content is loaded from a hidden DOM element.</div>

<script type="text/javascript">
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $$('.button').addEvent('click', function(e) {
                e.preventDefault();
            });

            $$('.js-popover').popover({
                ajax: <?php bool('ajax', false); ?>,
                getContent: '<?php echo value('ajax') ? 'href' : 'data-popover'; ?>',
                position: <?php string('position', 'topRight'); ?>,
                showLoading: <?php bool('showLoading', true); ?>,
                showTitle: <?php bool('showTitle', true); ?>,
                xOffset: <?php number('xOffset', 0); ?>,
                yOffset: <?php number('yOffset', 0); ?>,
                delay: <?php number('delay', 0); ?>
            });
        });
    <?php } else { ?>
        $(function() {
            $('.button').on('click', function(e) {
                e.preventDefault();
            });

            $('.js-popover').popover({
                ajax: <?php bool('ajax', false); ?>,
                getContent: '<?php echo value('ajax') ? 'href' : 'data-popover'; ?>',
                position: <?php string('position', 'topRight'); ?>,
                showLoading: <?php bool('showLoading', true); ?>,
                showTitle: <?php bool('showTitle', true); ?>,
                xOffset: <?php number('xOffset', 0); ?>,
                yOffset: <?php number('yOffset', 0); ?>,
                delay: <?php number('delay', 0); ?>
            });
        });
    <?php } ?>
</script>