<?php
$class = $name = value('position', 'drop--down');
$name = str_replace('--', '', ucfirst($name));

if (value('reverse')) {
    $class .= ' reverse-align';
} ?>

<div class="example-center">
    <div class="button-group">
        <button type="button" class="button js-drop" data-drop="#drop-1" aria-controls="drop-1" aria-haspopup="true">
            Open <?php echo $name; ?>
            <span class="caret-down"></span>
        </button>

        <ul class="drop <?php echo $class; ?>" id="drop-1" role="menu">
            <li><a href="" role="menuitem">Some Item</a></li>
            <li><a href="" role="menuitem">With A Divider</a></li>
            <li class="drop-divider" role="separator"></li>
            <li class="has-children" aria-haspopup="true">
                <a href="" role="menuitem">
                    <span class="caret-right"></span>
                    Contains Children
                </a>
                <ul class="drop drop--down" role="menu">
                    <li><a href="" role="menuitem">Action</a></li>
                    <li><a href="" role="menuitem">Another Action</a></li>
                    <li><a href="" role="menuitem">Last Action</a></li>
                </ul>
            </li>
            <li><a href="" role="menuitem">Last Item</a></li>
        </ul>
    </div>

    <div class="button-group">
        <button type="button" class="button js-drop" data-drop="#drop-2" aria-controls="drop-2" aria-haspopup="true">
            Open <?php echo $name; ?>
            <span class="caret-down"></span>
        </button>

        <ul class="drop <?php echo $class; ?>" id="drop-2" role="menu">
            <li class="drop-heading">Heading</li>
            <li><a href="" role="menuitem">Another Item</a></li>
            <li><a href="" role="menuitem">Contains Headings</a></li>
            <li class="drop-heading">Heading</li>
            <li><a href="" role="menuitem">Last Item</a></li>
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