<?php
$class = $name = value('position', 'drop--down');
$name = str_replace('--', '', ucfirst($name));

if (value('reverse')) {
    $class .= ' reverse-align';
} ?>

<div class="example-center">
    <div class="button-group">
        <button type="button" class="button js-drop" data-drop="#drop-1">
            Open <?php echo $name; ?>
            <span class="caret-down"></span>
        </button>

        <ul class="<?php echo $class; ?>" id="drop-1">
            <li><a href="">Some Item</a></li>
            <li><a href="">With A Divider</a></li>
            <li class="drop-divider"></li>
            <li class="has-children">
                <a href="">
                    <span class="caret-right"></span>
                    Contains Children
                </a>
                <ul class="drop--down">
                    <li><a href="">Action</a></li>
                    <li><a href="">Another Action</a></li>
                    <li><a href="">Last Action</a></li>
                </ul>
            </li>
            <li><a href="">Last Item</a></li>
        </ul>
    </div>

    <div class="button-group">
        <button type="button" class="button js-drop" data-drop="#drop-2">
            Open <?php echo $name; ?>
            <span class="caret-down"></span>
        </button>

        <ul class="<?php echo $class; ?>" id="drop-2">
            <li class="drop-heading">Heading</li>
            <li><a href="">Another Item</a></li>
            <li><a href="">Contains Headings</a></li>
            <li class="drop-heading">Heading</li>
            <li><a href="">Last Item</a></li>
        </ul>
    </div>
</div>

<script>
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $$('.js-drop').drop({
                mode: <?php string('mode', 'click'); ?>,
                hideOpened: <?php bool('hideOpened'); ?>
            });
        });
    <?php } else { ?>
        $(function() {
            $('.js-drop').drop({
                mode: <?php string('mode', 'click'); ?>,
                hideOpened: <?php bool('hideOpened'); ?>
            });
        });
    <?php } ?>
</script>