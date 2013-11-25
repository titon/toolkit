<?php
$classes = array(value('size'), value('state'), value('shape'));
$classes = implode(' ', array_filter($classes)); ?>

<div class="progress <?php echo $classes; ?>">
    <div class="progress-bar" style="width: <?php number('width', 55); ?>%"><?php number('width', 55); ?>%</div>
</div>