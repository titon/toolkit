<style type="text/css">
    #pin {
        margin-bottom: 100px;
        <?php // Can't do inline styles as that attribute is removed
        if ($height = value('height')) echo 'height: ' . $height . 'px;';
        if ($top = value('top')) echo 'top: ' . $top . 'px;'; ?>
    }
</style>

<div class="example-pin <?php echo value('location', 'right'); ?>">
    <div class="pin" id="pin">
        This div should stay positioned at the top right of the page, regardless of window scroll.<br><br>
        It will also stay contained within the parent.
    </div>

    <?php for ($i = 0; $i <= 10; $i++) { ?>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>
    <?php } ?>
</div>

<script>
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $('pin').pin({
                animation: <?php string('animation'); ?>,
                location: <?php string('location', 'right'); ?>,
                xOffset: <?php number('xOffset', 0); ?>,
                yOffset: <?php number('yOffset', 0); ?>,
                throttle: <?php number('throttle', 50); ?>,
                fixed: <?php bool('fixed', false); ?>,
                lock: <?php bool('lock', true); ?>
            });
        });
    <?php } else { ?>
        $(function() {
            $('#pin').pin({
                animation: <?php string('animation'); ?>,
                location: <?php string('location', 'right'); ?>,
                xOffset: <?php number('xOffset', 0); ?>,
                yOffset: <?php number('yOffset', 0); ?>,
                throttle: <?php number('throttle', 50); ?>,
                fixed: <?php bool('fixed', false); ?>,
                lock: <?php bool('lock', true); ?>
            });
        });
    <?php } ?>
</script>