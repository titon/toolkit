<?php
$classes = array(value('size'), value('state'), value('shape'), value('effect'));

if (value('active')) {
    $classes[] = 'is-active';
} else if (value('disabled')) {
    $classes[] = 'is-disabled';
}

$classes = implode(' ', array_filter($classes)); ?>

<button type="button" class="button <?php echo $classes; ?>">Button</button>
<a href="javascript:;" class="button <?php echo $classes; ?>">Anchor</a>