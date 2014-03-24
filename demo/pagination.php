<?php
$count = value('count', 5);
$state = value('state');
$classes = array(value('size'), value('shape'), value('effect'));

if ($mod = value('modifier')) {
    $classes[] = 'pagination--' . $mod;
} else {
    $classes[] = 'pagination';
}

$classes = implode(' ', array_filter($classes)); ?>

<nav class="<?php echo $classes; ?>" role="navigation" aria-label="Paged Navigation">
    <ul>
        <li><a href="javascript:;" class="button <?php echo $state; ?>">&laquo;</a></li>
        <?php for ($i = 1; $i <= $count; $i++) { ?>
            <li><a href="javascript:;" class="button <?php echo $state; ?>"><?php echo $i; ?></a></li>
        <?php } ?>
        <li><a href="javascript:;" class="button <?php echo $state; ?>">&raquo;</a></li>
    </ul>
</nav>