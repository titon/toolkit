<?php
$classes = array(value('size'), value('state'));

if ($mod = value('modifier')) {
    $classes[] = 'label--' . $mod;
}

$classes = implode(' ', array_filter($classes)); ?>

<span class="label <?php echo $classes; ?>">Label</span>
<span class="label <?php echo $classes; ?>"><?php echo rand(0, 200); ?></span>