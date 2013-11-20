<?php
$class = '';

if ($mod = value('modifier')) {
    $class = 'on-' . $mod;
}

if ($pos = value('align')) {
    $class .= ' ' . $pos;
} ?>

<div class="example-center">
    <div class="button-group">
        <button type="button" class="button js-dropdown" data-dropdown="#dropdown-1">
            Open Dropdown
            <span class="caret-down"></span>
        </button>

        <ul class="dropdown <?php echo $class; ?>" id="dropdown-1">
            <li><a href="">Some Dropdown</a></li>
            <li><a href="">With A Divider</a></li>
            <li class="dropdown-divider"></li>
            <li class="has-children">
                <a href="">
                    <span class="caret-right"></span>
                    Contains Children
                </a>
                <ul class="dropdown">
                    <li><a href="">Action</a></li>
                    <li><a href="">Another Action</a></li>
                    <li><a href="">Last Action</a></li>
                </ul>
            </li>
            <li><a href="">Last Item</a></li>
        </ul>
    </div>

    <div class="button-group">
        <button type="button" class="button js-dropdown" data-dropdown="#dropdown-2">
            Open Dropdown
            <span class="caret-down"></span>
        </button>

        <ul class="dropdown <?php echo $class; ?>" id="dropdown-2">
            <li class="dropdown-heading">Heading</li>
            <li><a href="">Another Dropdown</a></li>
            <li><a href="">Contains Headings</a></li>
            <li class="dropdown-heading">Heading</li>
            <li><a href="">Last Item</a></li>
        </ul>
    </div>
</div>

<script>
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $$('.js-dropdown').dropdown({
                mode: <?php string('mode', 'click'); ?>,
                hideOpened: <?php bool('hideOpened'); ?>
            });
        });
    <?php } else { ?>
        $(function() {
            $('.js-dropdown').dropdown({
                mode: <?php string('mode', 'click'); ?>,
                hideOpened: <?php bool('hideOpened'); ?>
            });
        });
    <?php } ?>
</script>