<?php
$class = '';

if ($mod = value('modifier')) {
    $class = 'icon--' . $mod;
} ?>

<span class="icon-16-1 <?php echo $class; ?>"></span>
<span class="icon-16-2 <?php echo $class; ?>"></span>
<span class="icon-16-3 <?php echo $class; ?>"></span>
<span class="icon-16-4 <?php echo $class; ?>"></span>
<span class="icon-16-5 <?php echo $class; ?>"></span>

<div class="example-title">Buttons</div>

<button type="button" class="button">
    <span class="icon-16-1 <?php echo $class; ?>"></span>
    Filter
</button>

<button type="button" class="button is-info round">
    <span class="icon-16-2 <?php echo $class; ?>"></span>
    Home
</button>

<button type="button" class="button is-warning pill">
    <span class="icon-16-3 <?php echo $class; ?>"></span>
    Tag
</button>

<button type="button" class="button is-success oval">
    <span class="icon-16-4 <?php echo $class; ?>"></span>
    Update
</button>

<button type="button" class="button is-error skew">
    <span class="icon-16-5 <?php echo $class; ?>"></span>
    Add
</button>

<button type="button" class="button">Button (No Icon)</button>