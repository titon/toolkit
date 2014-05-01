
<div class="example-center">
    <button type="button" class="button js-modal" data-modal="ajax/modal.php?slow">Open Modal</button>
    <button type="button" class="button js-modal" data-modal="ajax/modal-form.php">Open Modal w/ Form</button>
    <button type="button" class="button js-modal" data-modal="#hidden">Open Modal w/ DOM</button>
    <button type="button" class="button js-modal" data-modal="ajax/modal.php?slow" data-modal-ajax="true">Open Modal w/ Data Attrs</button>

    <p>AJAX responses can also return JSON that can be intercepted and processed by the Modal component (open console).</p>

    <button type="button" class="button js-modal" data-modal="ajax/modal-json.php">Return JSON</button>
    <button type="button" class="button js-modal" data-modal="ajax/modal-json.php?callback=console.log">Return JSON w/ Callback</button>

    <div id="hidden" style="display: none">
        <div class="modal-head"><h4>DOM Loaded</h4></div>
        <div class="modal-body">
            <p>This content is loaded from a hidden DOM element. This approach requires the markup to be in the page.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis vestibulum massa, at lobortis libero. Suspendisse dictum ullamcorper lorem id tempus. Praesent adipiscing velit vitae nisl vulputate, in ultricies turpis fringilla. Mauris iaculis, odio in consectetur convallis, quam ipsum pretium justo, ac posuere turpis mi a nibh. Nam vitae sem tortor. Duis eu lacinia odio, in euismod neque. Praesent eu bibendum libero. Vivamus justo erat, fringilla in nisi pulvinar, interdum auctor elit. Donec eu lorem porttitor, ultrices justo id, volutpat nisi. Suspendisse vel arcu quis massa auctor commodo vitae nec nisi. Sed sollicitudin purus libero, in pulvinar lorem gravida eu. Etiam pharetra tincidunt risus sit amet egestas. In hac habitasse platea dictumst. Maecenas eu pellentesque ante, eget varius urna.</p>
            <p>Vivamus consectetur lorem at lobortis elementum. Etiam laoreet et lectus vel egestas. Integer egestas lacus tempor ante iaculis feugiat. Integer sem justo, auctor vel augue ut, pellentesque accumsan quam. Suspendisse eget feugiat ante. Vestibulum tempus metus vitae massa fringilla euismod. Nulla id sem libero. Quisque molestie ipsum non neque pellentesque, vel aliquam ante pretium. Donec et magna euismod, porttitor purus non, tempor lacus. Vestibulum laoreet mauris non nibh cursus eleifend. Proin ac tempor lorem, vel semper tellus. Donec at vestibulum dolor, sit amet eleifend mi. Nulla auctor massa nec tempus gravida.</p>
        </div>
        <div class="modal-foot">
            <button type="button" class="button modal-hide">Close</button>
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
                fullScreen: <?php bool('fullScreen', false); ?>,
                stopScroll: <?php bool('stopScroll', true); ?>
            });

            // Allow 2 modals at once
            $$('.js-modal2').modal({
                delegate: '.js-modal2',
                animation: <?php string('animation', 'fade'); ?>,
                className: <?php string('className'); ?>,
                ajax: <?php bool('ajax', true); ?>,
                draggable: <?php bool('draggable', false); ?>,
                blackout: <?php bool('blackout', true); ?>,
                fullScreen: <?php bool('fullScreen', false); ?>,
                stopScroll: <?php bool('stopScroll', true); ?>
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
                fullScreen: <?php bool('fullScreen', false); ?>,
                stopScroll: <?php bool('stopScroll', true); ?>
            });

            // Allow 2 modals at once
            $('.js-modal2').modal({
                animation: <?php string('animation', 'fade'); ?>,
                className: <?php string('className'); ?>,
                ajax: <?php bool('ajax', true); ?>,
                draggable: <?php bool('draggable', false); ?>,
                blackout: <?php bool('blackout', true); ?>,
                fullScreen: <?php bool('fullScreen', false); ?>,
                stopScroll: <?php bool('stopScroll', true); ?>
            });
        });
    <?php } ?>
</script>