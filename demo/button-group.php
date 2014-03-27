<?php
$classes = array(value('size'), value('shape'), value('effect'));
$state = value('state');
$count = (int) value('count', 3);

if ($mod = value('modifier')) {
    $classes[] = 'button-group--' . $mod;
} else {
    $classes[] = 'button-group';
}

if (value('active')) {
    $classes[] = 'is-active';
} else if (value('disabled')) {
    $classes[] = 'is-disabled';
}

$classes = implode(' ', array_filter($classes)); ?>

<p>Default button group.</p>

<div class="<?php echo $classes; ?>" role="toolbar"<?php if (value('modifier') === 'vertical') { ?> aria-orientation="vertical"<?php } ?>>
    <?php for ($i = 1; $i <= $count; $i++) { ?>
        <button type="button" class="button <?php echo $state; ?>" role="button">Button</button>
    <?php } ?>
</div>

<p>With anchor links.</p>

<div class="<?php echo $classes; ?>" role="toolbar"<?php if (value('modifier') === 'vertical') { ?> aria-orientation="vertical"<?php } ?>>
    <?php for ($i = 1; $i <= $count; $i++) { ?>
        <a href="javascript:;" class="button <?php echo $state; ?>" role="button">Anchor</a>
    <?php } ?>
</div>

<p>Using an unordered list.</p>

<ul class="<?php echo $classes; ?>" role="toolbar"<?php if (value('modifier') === 'vertical') { ?> aria-orientation="vertical"<?php } ?>>
    <?php for ($i = 1; $i <= $count; $i++) { ?>
        <li><a href="javascript:;" class="button <?php echo $state; ?>" role="button">Anchor</a></li>
    <?php } ?>
</ul>