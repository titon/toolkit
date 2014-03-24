<?php
$classes = array(value('size'), value('shape'));
$classes = implode(' ', array_filter($classes)); ?>

<div class="progress <?php echo $classes; ?>" role="progressbar" aria-valuenow="<?php number('width', 55); ?>" aria-valuemin="0" aria-valuemax="100">
    <div class="progress-bar <?php echo value('state'); ?>" style="width: <?php number('width', 55); ?>%">
        <?php number('width', 55); ?>%
    </div>
</div>

<br><br>

<div class="progress <?php echo $classes; ?>">
    <div class="progress-bar is-success" style="width: 45%">45%</div>
    <div class="progress-bar is-error" style="width: 25%">25%</div>
</div>