
<div class="example-center">
    <p>Toasts need to be manually created through the class instance.</p>

    <p>
        <button type="button" class="button" id="toast-text">Create Text Toast</button>
        <button type="button" class="button" id="toast-html">Create HTML Toast</button>
        <button type="button" class="button" id="toast-dismiss">Create Dismissable Toast</button>
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

            $('toast-text').addEvent('click', function() {
                document.body.toolkit('toast', 'create', 'This is a string of text!');
            });

            $('toast-html').addEvent('click', function() {
                document.body.toolkit('toast', 'create', new Element('a').set('html', 'This is an anchor link!'));
            });

            $('toast-dismiss').addEvent('click', function() {
                var toast = document.body..toolkit('toast'),
                    link = new Element('a')
                        .set('href', 'javascript:;')
                        .set('html', 'This message will persist until dismissed.')
                        .addEvent('click', function(e) {
                            toast.hide(e.target.parentNode);
                        });

                toast.create(link, { duration: 0 });
            });
        });

    <?php } else { ?>
        $(function() {
            $('body').toast({
                position: <?php string('position', 'bottom-left'); ?>,
                animation: <?php string('animation', 'slide-up'); ?>,
                duration: <?php number('duration', 5000); ?>
            });

            $('#toast-text').on(Toolkit.isTouch ? 'touchstart' : 'click', function() {
                $('body').toolkit('toast', 'create', 'This is a string of text!');
            });

            $('#toast-html').on(Toolkit.isTouch ? 'touchstart' : 'click', function() {
                $('body').toolkit('toast', 'create', $('<a/>').html('This is an anchor link!'));
            });

            $('#toast-dismiss').on(Toolkit.isTouch ? 'touchstart' : 'click', function() {
                var toast = $('body').toolkit('toast'),
                    link = $('<a/>')
                        .attr('href', 'javascript:;')
                        .html('This message will persist until dismissed.')
                        .click(function() {
                            toast.hide(this.parentNode);
                        });

                toast.create(link, { duration: 0 });
            });
        });
    <?php } ?>
</script>