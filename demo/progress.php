<?php
$classes = array(value('size'), value('shape'));
$classes = implode(' ', array_filter($classes)); ?>

<div class="progress <?php echo $classes; ?>">
    <div class="progress-bar <?php echo value('state'); ?>" style="width: <?php number('width', 55); ?>%">
        <?php number('width', 55); ?>%
    </div>
</div>

<br><br>

<div class="progress <?php echo $classes; ?>">
    <div class="progress-bar is-success" style="width: 45%">45%</div>
    <div class="progress-bar is-error" style="width: 25%">25%</div>
</div>