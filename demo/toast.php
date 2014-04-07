
<div class="example-center">
    <p>Toasts need to be manually created through the class instance.</p>

    <p>
        <button type="button" class="button" id="toast-text">Create Text Toast</button>
        <button type="button" class="button" id="toast-html">Create HTML Toast</button>
    </p>
</div>

<script>
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            document.body.toast({
                position: <?php string('position', 'bottom-left'); ?>,
                animation: <?php string('animation', 'slide-up'); ?>,
                duration: <?php number('duration', 5000); ?>
            });

            $('toast-text').click(function() {
                document.body.toolkit('toast', 'create', 'This is a string of text!');
            });

            $('toast-html').click(function() {
                document.body.toolkit('toast', 'create', new Element('a').set('html', 'This is an anchor link!'));
            });
        });

    <?php } else { ?>
        $(function() {
            $('body').toast({
                position: <?php string('position', 'bottom-left'); ?>,
                animation: <?php string('animation', 'slide-up'); ?>,
                duration: <?php number('duration', 5000); ?>
            });

            $('#toast-text').click(function() {
                $('body').toolkit('toast', 'create', 'This is a string of text!');
            });

            $('#toast-html').click(function() {
                $('body').toolkit('toast', 'create', $('<a/>').html('This is an anchor link!'));
            });
        });
    <?php } ?>
</script>