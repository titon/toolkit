<?php
$classes = array(value('size'), value('state'), value('shape'), value('effect'));

if (value('active')) {
    $classes[] = 'is-active';
} else if (value('disabled')) {
    $classes[] = 'is-disabled';
}

$classes = implode(' ', array_filter($classes)); ?>

<button type="button" class="button <?php echo $classes; ?>" role="button">Button</button>
<a href="javascript:;" class="button <?php echo $classes; ?>" role="button">Anchor</a>
<input class="button <?php echo $classes; ?>" type="button" role="button" value="Input">
<input class="button <?php echo $classes; ?>" type="submit" role="button" value="Submit">