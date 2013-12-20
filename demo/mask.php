<div class="example-center">
    <button type="button" class="button" id="mask">Mask Top</button>
    <button type="button" class="button">Mask 1st</button>
    <button type="button" class="button">Mask 2nd</button>
    <button type="button" class="button">Mask 3rd</button>
</div>

<div class="js-mask">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero purus, aliquet eget ante at, rhoncus aliquet mi. Donec ornare, magna nec rhoncus sagittis, ante metus egestas lectus, eu volutpat urna metus ut nunc. Phasellus ante sem, hendrerit vel sagittis nec, sollicitudin vitae lectus. Duis eu elementum tortor. Fusce et molestie urna, ac dapibus arcu. Duis nec tincidunt urna. Proin eget sapien orci. Donec fermentum laoreet eros, et ultricies enim gravida et. Praesent at lorem arcu. Ut placerat feugiat neque vestibulum feugiat. Duis lorem lacus, blandit eu pellentesque quis, placerat a leo. Etiam ultrices vulputate tellus non volutpat. Donec bibendum mi eu nulla faucibus, quis condimentum orci vehicula. Quisque et orci in nunc mollis consequat eu sodales massa. Suspendisse cursus interdum viverra.
</div>

<br>

<div class="grid example-grid">
    <div class="col span-3 js-mask">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero purus, aliquet eget ante at, rhoncus aliquet mi. Donec ornare, magna nec rhoncus sagittis, ante metus egestas lectus, eu volutpat urna metus ut nunc. Phasellus ante sem, hendrerit vel sagittis nec, sollicitudin vitae lectus. Duis eu elementum tortor. Fusce et molestie urna, ac dapibus arcu. Duis nec tincidunt urna. Proin eget sapien orci. Donec fermentum laoreet eros, et ultricies enim gravida et. Praesent at lorem arcu. Ut placerat feugiat neque vestibulum feugiat. Duis lorem lacus, blandit eu pellentesque quis, placerat a leo. Etiam ultrices vulputate tellus non volutpat. Donec bibendum mi eu nulla faucibus, quis condimentum orci vehicula. Quisque et orci in nunc mollis consequat eu sodales massa. Suspendisse cursus interdum viverra.
    </div>

    <div class="col span-3 push-1 js-mask">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero purus, aliquet eget ante at, rhoncus aliquet mi. Donec ornare, magna nec rhoncus sagittis, ante metus egestas lectus, eu volutpat urna metus ut nunc. Phasellus ante sem, hendrerit vel sagittis nec, sollicitudin vitae lectus.
    </div>

    <div class="col span-3 push-2 js-mask">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris libero purus, aliquet eget ante at, rhoncus aliquet mi.
    </div>
</div>

<script>
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $$('.js-mask').mask({
            });
        });
    <?php } else { ?>
        $(function() {
            $('.js-mask').mask({
            });
        });
    <?php } ?>
</script>