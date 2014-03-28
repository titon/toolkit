
<div class="example-center">
    <a href="ajax/tooltip.php" class="button js-tooltip" data-tooltip="This content is read from the data-tooltip attribute.">Show Tooltip</a>
    <a href="ajax/tooltip.php?slow" class="button js-tooltip" title="Tooltip Title" data-tooltip="#hidden">Show Tooltip w/ Title</a>
    <a href="ajax/tooltip.php?slow" class="button js-tooltip" title="Tooltip Title" data-tooltip-getContent="href" data-tooltip-ajax="true" data-tooltip-position="bottom-center"><span>Show Tooltip w/ Data Attrs</span></a>

    <div id="hidden" style="display: none">This content is loaded from a hidden DOM element.</div>
</div>

<script>
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $$('.js-tooltip').tooltip({
                className: <?php string('className'); ?>,
                animation: <?php string('animation'); ?>,
                mode: <?php string('mode', 'hover'); ?>,
                ajax: <?php bool('ajax', false); ?>,
                follow: <?php bool('follow', false); ?>,
                getContent: '<?php echo value('ajax') ? 'href' : 'data-tooltip'; ?>',
                position: <?php string('position', 'top-center'); ?>,
                showLoading: <?php bool('showLoading', true); ?>,
                showTitle: <?php bool('showTitle', true); ?>,
                mouseThrottle: <?php number('mouseThrottle', 50); ?>,
                xOffset: <?php number('xOffset', 0); ?>,
                yOffset: <?php number('yOffset', 0); ?>,
                delay: <?php number('delay', 0); ?>
            });
        });
    <?php } else { ?>
        $(function() {
            $('.js-tooltip').tooltip({
                className: <?php string('className'); ?>,
                animation: <?php string('animation'); ?>,
                mode: <?php string('mode', 'hover'); ?>,
                ajax: <?php bool('ajax', false); ?>,
                follow: <?php bool('follow', false); ?>,
                getContent: '<?php echo value('ajax') ? 'href' : 'data-tooltip'; ?>',
                position: <?php string('position', 'top-center'); ?>,
                showLoading: <?php bool('showLoading', true); ?>,
                showTitle: <?php bool('showTitle', true); ?>,
                mouseThrottle: <?php number('mouseThrottle', 50); ?>,
                xOffset: <?php number('xOffset', 0); ?>,
                yOffset: <?php number('yOffset', 0); ?>,
                delay: <?php number('delay', 0); ?>
            });
        });
    <?php } ?>
</script>