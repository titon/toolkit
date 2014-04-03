<div id="off-canvas">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>

    <p class="align-center">
        <button type="button" class="button js-canvas-left">Open Left Sidebar</button>
        <button type="button" class="button js-canvas-right">Open Right Sidebar</button>
    </p>

    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>

    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>

    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>

    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>

    <div class="off-canvas--left" id="left-canvas">
        <p>Left Canvas</p>
    </div>

    <div class="off-canvas--right" id="right-canvas">
        <p>Right Canvas</p>
    </div>
</div>

<script>
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $('left-canvas').offCanvas({
                context: <?php string('parent'); ?>,
                selector: '.js-canvas-left',
                push: <?php bool('push', true); ?>,
                overlay: <?php bool('overlay', false); ?>,
                openOnLoad: <?php bool('openOnLoad', false); ?>,
                hideOthers: <?php bool('hideOthers', true); ?>
            });

            $('right-canvas').offCanvas({
                context: <?php string('parent'); ?>,
                selector: '.js-canvas-right',
                push: <?php bool('push', true); ?>,
                overlay: <?php bool('overlay', false); ?>,
                openOnLoad: <?php bool('openOnLoad', false); ?>,
                hideOthers: <?php bool('hideOthers', true); ?>
            });
        });

    <?php } else { ?>
        $(function() {
            $('#left-canvas').offCanvas({
                context: <?php string('parent'); ?>,
                selector: '.js-canvas-left',
                push: <?php bool('push', true); ?>,
                overlay: <?php bool('overlay', false); ?>,
                openOnLoad: <?php bool('openOnLoad', false); ?>,
                hideOthers: <?php bool('hideOthers', true); ?>
            });

            $('#right-canvas').offCanvas({
                context: <?php string('parent'); ?>,
                selector: '.js-canvas-right',
                push: <?php bool('push', true); ?>,
                overlay: <?php bool('overlay', false); ?>,
                openOnLoad: <?php bool('openOnLoad', false); ?>,
                hideOthers: <?php bool('hideOthers', true); ?>
            });
        });
    <?php } ?>
</script>