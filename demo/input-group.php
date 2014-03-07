<?php
$class = value('round') ? 'round' : '';

if ($size = value('size')) {
    $class .= ' ' . $size;
} ?>

<form action="" method="get">
    <div class="field">
        <label class="field-label" for="g1">Text</label>
        <div class="input-group <?php echo $class; ?>">
            <div class="input-addon">=</div>
            <input id="g1" type="text" class="input" name="text">
        </div>
    </div>

    <div class="field">
        <label class="field-label" for="g2">Email</label>
        <div class="input-group <?php echo $class; ?>">
            <input id="g2" type="email" class="input" name="email">
            <div class="input-addon">@</div>
            <input id="g2b" type="email" class="input" name="email2">
        </div>
    </div>

    <div class="field">
        <label class="field-label" for="g3">URL</label>
        <div class="input-group <?php echo $class; ?>">
            <div class="input-addon">http://</div>
            <input id="g3" type="url" class="input" name="url">
            <div class="input-addon">.com</div>
        </div>
    </div>

    <div class="field">
        <label class="field-label" for="g4">Number</label>
        <div class="input-group <?php echo $class; ?>">
            <input id="g4" type="number" class="input" name="number">
            <div class="input-addon">%</div>
            <button type="button" class="button">Stop</button>
        </div>
    </div>

    <div class="field">
        <label class="field-label" for="g5">Password</label>
        <div class="input-group <?php echo $class; ?>">
            <a href="javascript:;" class="button">Check</a>
            <input id="g5" type="password" class="input" name="password">
        </div>
        <div class="field-help">This is a string of help text below the input</div>
    </div>

    <div class="field">
        <label class="field-label" for="g7">Search</label>
        <div class="input-group <?php echo $class; ?>">
            <a href="javascript:;" class="button">Check</a>
            <input id="g7" type="search" class="input" name="search">
            <button type="button" class="button">Go</button>
        </div>
    </div>
</form>