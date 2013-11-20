<?php
$classes = array(value('size'), value('state'));

if ($mod = value('modifier')) {
    $classes[] = 'label--' . $mod;
} else {
    $classes[] = 'label';
}

$classes = implode(' ', array_filter($classes)); ?>

<span class="<?php echo $classes; ?>">Label</span>
<span class="<?php echo $classes; ?>"><?php echo rand(0, 200); ?></span>