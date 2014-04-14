<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>

<p class="align-center">
    <button type="button" class="button js-canvas-left">Open Left Sidebar</button>
    <button type="button" class="button js-canvas-left2">Open Left 2 Sidebar</button>
    <button type="button" class="button js-canvas-right">Open Right Sidebar</button>
</p>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>

<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>

<aside class="off-canvas off-canvas--left" id="left-canvas" data-offCanvas-selector=".js-canvas-left">
    <p>Left Canvas</p>
</aside>

<aside class="off-canvas off-canvas--left" id="left-canvas2" data-offCanvas-selector=".js-canvas-left2">
    <p>Left Canvas #2</p>
</aside>

<aside class="off-canvas off-canvas--right" id="right-canvas" data-offCanvas-selector=".js-canvas-right">
    <p>Right Canvas</p>
</aside>

<script>
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $$('.off-canvas').offCanvas({
                //context: '#skeleton',
                push: <?php bool('push', true); ?>,
                overlay: <?php bool('overlay', false); ?>,
                openOnLoad: <?php bool('openOnLoad', false); ?>,
                hideOthers: <?php bool('hideOthers', true); ?>
            });
        });

    <?php } else { ?>
        $(function() {
            $('.off-canvas').offCanvas({
                //context: '#skeleton',
                push: <?php bool('push', true); ?>,
                overlay: <?php bool('overlay', false); ?>,
                openOnLoad: <?php bool('openOnLoad', false); ?>,
                hideOthers: <?php bool('hideOthers', true); ?>
            });
        });
    <?php } ?>
</script>