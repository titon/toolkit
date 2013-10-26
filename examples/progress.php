<?php
$classes = array(value('size'), value('state'));
$classes = implode(' ', array_filter($classes)); ?>

<div class="progress <?php echo $classes; ?>">
    <div class="progress-bar" style="width: <?php number('width'); ?>%"><?php number('width'); ?>%</div>
</div>