<?php
$class = ['switch'];

if (value('round')) {
    $class[] = 'round';
}

if ($size = value('size')) {
    $class[] = $size;
}

if ($mod = value('modifier')) {
    $class[] = 'switch--' . $mod;
}

$class = implode(' ', $class); ?>

<label for="switch-1">With Labels</label>

<label for="switch-1" class="<?= $class; ?>">
    <input type="checkbox" value="1" id="switch-1" name="switch-1">

    <span class="switch-bar" data-switch-on="On" data-switch-off="Off">
        <span class="switch-toggle"></span>
    </span>
</label>

<input type="text" class="input <?= value('size'); ?>">

<br><br>

<label for="switch-3">No Labels</label>

<label for="switch-3" class="<?= $class; ?>">
    <input type="checkbox" value="1" id="switch-3" name="switch-3">

    <span class="switch-bar">
        <span class="switch-toggle"></span>
    </span>
</label>