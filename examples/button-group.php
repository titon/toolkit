<?php
$classes = array(value('size'), value('shape'), value('effect'));
$state = value('state');
$count = (int) value('count', 3);

if (value('active')) {
    $classes[] = 'is-active';
} else if (value('disabled')) {
    $classes[] = 'is-disabled';
}

if ($mod = value('modifier')) {
    $classes[] = 'button-group--' . $mod;
}

$classes = implode(' ', array_filter($classes)); ?>

<p>Default button group.</p>

<div class="button-group <?php echo $classes; ?>">
    <?php for ($i = 1; $i <= $count; $i++) { ?>
        <button type="button" class="button <?php echo $state; ?>">Button</button>
    <?php } ?>
</div>

<p>With anchor links.</p>

<div class="button-group <?php echo $classes; ?>">
    <?php for ($i = 1; $i <= $count; $i++) { ?>
        <a href="javascript:;" class="button <?php echo $state; ?>">Anchor</a>
    <?php } ?>
</div>

<p>Using an unordered list.</p>

<ul class="button-group <?php echo $classes; ?>">
    <?php for ($i = 1; $i <= $count; $i++) { ?>
        <li><a href="javascript:;" class="button <?php echo $state; ?>">Anchor</a></li>
    <?php } ?>
</ul>