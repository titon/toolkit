<div class="example-center">
    <button type="button" class="button" data-mask="#mask-0">Mask Top</button>
    <button type="button" class="button" data-mask="#mask-1">Mask 1st</button>
    <button type="button" class="button" data-mask="#mask-2">Mask 2nd</button>
    <button type="button" class="button" data-mask="#mask-3">Mask 3rd</button>
    <button type="button" class="button" data-mask="body">Mask Document</button>
</div>

<div class="js-mask" id="mask-0">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero purus, aliquet eget ante at, rhoncus aliquet mi. Donec ornare, magna nec rhoncus sagittis, ante metus egestas lectus, eu volutpat urna metus ut nunc. Phasellus ante sem, hendrerit vel sagittis nec, sollicitudin vitae lectus. Duis eu elementum tortor. Fusce et molestie urna, ac dapibus arcu. Duis nec tincidunt urna. Proin eget sapien orci. Donec fermentum laoreet eros, et ultricies enim gravida et. Praesent at lorem arcu. Ut placerat feugiat neque vestibulum feugiat. Duis lorem lacus, blandit eu pellentesque quis, placerat a leo. Etiam ultrices vulputate tellus non volutpat. Donec bibendum mi eu nulla faucibus, quis condimentum orci vehicula. Quisque et orci in nunc mollis consequat eu sodales massa. Suspendisse cursus interdum viverra.
</div>

<br>

<div class="grid example-grid">
    <div class="col span-3 js-mask" id="mask-1">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero purus, aliquet eget ante at, rhoncus aliquet mi. Donec ornare, magna nec rhoncus sagittis, ante metus egestas lectus, eu volutpat urna metus ut nunc. Phasellus ante sem, hendrerit vel sagittis nec, sollicitudin vitae lectus. Duis eu elementum tortor. Fusce et molestie urna, ac dapibus arcu. Duis nec tincidunt urna. Proin eget sapien orci. Donec fermentum laoreet eros, et ultricies enim gravida et. Praesent at lorem arcu. Ut placerat feugiat neque vestibulum feugiat. Duis lorem lacus, blandit eu pellentesque quis, placerat a leo. Etiam ultrices vulputate tellus non volutpat. Donec bibendum mi eu nulla faucibus, quis condimentum orci vehicula. Quisque et orci in nunc mollis consequat eu sodales massa. Suspendisse cursus interdum viverra.
    </div>

    <div class="col span-3 push-1 js-mask" id="mask-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero purus, aliquet eget ante at, rhoncus aliquet mi. Donec ornare, magna nec rhoncus sagittis, ante metus egestas lectus, eu volutpat urna metus ut nunc. Phasellus ante sem, hendrerit vel sagittis nec, sollicitudin vitae lectus.

        <div class="mask hide">
            <div class="mask-message">This message is defined automatically in the source.</div>
        </div>
    </div>

    <div class="col span-3 push-2 js-mask" id="mask-3">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero purus, aliquet eget ante at, rhoncus aliquet mi.
    </div>
</div>

<div class="mask hide" id="body-mask">
    <div class="mask-message">
        <div class="loader bar-wave">
            <span></span><span></span><span></span><span></span><span></span>

            <div class="loader-message">
                Mask with loader...
            </div>
        </div>
    </div>
</div>

<script>
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $('body-mask').inject(document.body, 'bottom');

            $$('.js-mask').mask({
                revealOnClick: <?php bool('revealOnClick', false); ?>,
                messageContent: 'This message is defined through options.'
            });

            document.body.mask({
                revealOnClick: <?php bool('revealOnClick', false); ?>
            });

            $$('.button').addEvent('click', function(e) {
                var target = e.target.get('data-mask');

                if (target === 'body') {
                    document.body.toolkit('mask').toggle();
                } else {
                    $(target.substr(1)).toolkit('mask').toggle();
                }
            });
        });
    <?php } else { ?>
        $(function() {
            $('#body-mask').appendTo('body');

            $('.js-mask').mask({
                revealOnClick: <?php bool('revealOnClick', false); ?>,
                messageContent: 'This message is defined through options.'
            });

            $('body').mask({
                revealOnClick: <?php bool('revealOnClick', false); ?>
            });

            $('.button').click(function(e) {
                $($(e.target).data('mask')).toolkit('mask').toggle();
            });
        });
    <?php } ?>
</script>