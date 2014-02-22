<?php
$classes = array(value('state'));
$disabled = value('disabled', false);
$size = value('size', '');

if (value('required')) {
    $classes[] = 'is-required';
}

$classes = implode(' ', array_filter($classes)); ?>

<form action="" method="get">
    <fieldset class="no-legend">
        <div class="field <?php echo $classes; ?>">
            <label class="field-label" for="i1">Text</label>
            <input id="i1" type="text" class="input <?php echo $size; ?>" name="text" <?php if ($disabled) echo 'disabled'; ?>>
        </div>

        <div class="field <?php echo $classes; ?>">
            <label class="field-label" for="i1r">Text + Readonly</label>
            <input id="i1r" type="text" class="input <?php echo $size; ?>" name="readonly" readonly value="Some value here" <?php if ($disabled) echo 'disabled'; ?>>
        </div>

        <div class="field <?php echo $classes; ?>">
            <label class="field-label">Text + Static</label>
            <div class="input-static <?php echo $size; ?>">email@domain.com</div>
        </div>

        <div class="field <?php echo $classes; ?>">
            <label class="field-label" for="i2">Email</label>
            <input id="i2" type="email" class="input <?php echo $size; ?>" name="email" <?php if ($disabled) echo 'disabled'; ?>>
        </div>

        <div class="field <?php echo $classes; ?>">
            <label class="field-label" for="i3">URL</label>
            <input id="i3" type="url" class="input <?php echo $size; ?>" name="url" <?php if ($disabled) echo 'disabled'; ?>>
        </div>

        <div class="field <?php echo $classes; ?>">
            <label class="field-label" for="i4">Number</label>
            <input id="i4" type="number" class="input <?php echo $size; ?>" name="number" <?php if ($disabled) echo 'disabled'; ?>>
        </div>

        <div class="field <?php echo $classes; ?>">
            <label class="field-label" for="i5">Password</label>
            <input id="i5" type="password" class="input <?php echo $size; ?>" name="password" <?php if ($disabled) echo 'disabled'; ?>>
            <div class="field-help">This is a string of help text below the input</div>
        </div>

        <div class="field <?php echo $classes; ?>">
            <label class="field-label" for="i6">File</label>
            <input id="i6" type="file" class="input <?php echo $size; ?>" name="file" <?php if ($disabled) echo 'disabled'; ?>>
        </div>

        <div class="field <?php echo $classes; ?>">
            <label class="field-label" for="i7">Hidden</label>
            <input id="i7" type="hidden" name="hidden" <?php if ($disabled) echo 'disabled'; ?>>
        </div>

        <div class="field <?php echo $classes; ?>">
            <label class="field-label" for="i8">Search</label>
            <input id="i8" type="search" class="input <?php echo $size; ?>" name="search" <?php if ($disabled) echo 'disabled'; ?>>
        </div>
    </fieldset>

    <fieldset>
        <legend>Selects</legend>

        <div class="field <?php echo $classes; ?>">
            <label class="field-label" for="i9">Select</label>
            <select id="i9" class="input <?php echo $size; ?>" name="select" <?php if ($disabled) echo 'disabled'; ?>>
                <option value="">CSS</option>
                <option value="">HTML</option>
                <option value="">JavaScript</option>
            </select>
        </div>

        <div class="field <?php echo $classes; ?>">
            <label class="field-label" for="i10">Select + Optgroup</label>
            <select id="i10" class="input <?php echo $size; ?>" name="select_group" <?php if ($disabled) echo 'disabled'; ?>>
                <optgroup label="Front-end">
                    <option value="">CSS</option>
                    <option value="">HTML</option>
                    <option value="">JavaScript</option>
                </optgroup>
                <optgroup label="Back-end">
                    <option value="">PHP</option>
                    <option value="">Python</option>
                    <option value="">Ruby</option>
                </optgroup>
            </select>
        </div>

        <div class="field <?php echo $classes; ?>">
            <label class="field-label" for="i11">Select + Multiple</label>
            <select id="i11" class="input <?php echo $size; ?>" name="select_multi" multiple <?php if ($disabled) echo 'disabled'; ?>>
                <option value="">CSS</option>
                <option value="">HTML</option>
                <option value="">JavaScript</option>
                <option value="">PHP</option>
                <option value="">Python</option>
                <option value="">Ruby</option>
            </select>
        </div>

        <div class="form-actions">
            <button type="submit" class="button is-success <?php echo $size; ?>">Submit</button>
            <button type="reset" class="button <?php echo $size; ?>">Reset</button>
        </div>
    </fieldset>

    <fieldset>
        <legend>Others</legend>

        <div class="field <?php echo $classes; ?>">
            <label class="field-label" for="i12">Textarea</label>
            <textarea id="i12" class="input <?php echo $size; ?> span-4" name="textarea" <?php if ($disabled) echo 'disabled'; ?>>Lorem ipsum dolor sit amet.</textarea>
        </div>

        <div class="field <?php echo $classes; ?>">
            <label class="input-checkbox <?php echo $size; ?>" for="i15"><input id="i15" type="checkbox" name="checkbox" <?php if ($disabled) echo 'disabled'; ?>> Checkbox inline</label>
        </div>

        <div class="field <?php echo $classes; ?>">
            <label class="input-radio <?php echo $size; ?>" for="i16"><input id="i16" type="radio" name="radio" <?php if ($disabled) echo 'disabled'; ?>> Radio first option</label><br>
            <label class="input-radio <?php echo $size; ?>" for="i17"><input id="i17" type="radio" name="radio" <?php if ($disabled) echo 'disabled'; ?>> Radio second option</label>
        </div>

        <div class="form-actions">
            <button type="submit" class="button is-success <?php echo $size; ?>">Submit</button>
            <button type="reset" class="button <?php echo $size; ?>">Reset</button>
        </div>
    </fieldset>
</form>

<div class="example-title">Horizontal</div>

<form action="" method="get" class="form--horizontal">
    <fieldset>
        <legend>Horizontal</legend>

    <div class="field <?php echo $classes; ?>">
        <label class="field-label col span-4" for="h1">Text</label>
        <div class="field-col col span-8">
            <input id="h1" type="text" class="input <?php echo $size; ?>" name="text" <?php if ($disabled) echo 'disabled'; ?>>
        </div>
    </div>

    <div class="field <?php echo $classes; ?>">
        <label class="field-label col span-4">Text + Static</label>
        <div class="field-col col span-8">
            <div class="input-static <?php echo $size; ?>">email@domain.com</div>
        </div>
    </div>

    <div class="field <?php echo $classes; ?>">
        <label class="field-label col span-4" for="h2">Select</label>
        <div class="field-col col span-8">
            <select id="h2" class="input <?php echo $size; ?>" name="select" <?php if ($disabled) echo 'disabled'; ?>>
                <option value="">CSS</option>
                <option value="">HTML</option>
                <option value="">JavaScript</option>
            </select>
        </div>
    </div>

    <div class="field <?php echo $classes; ?>">
        <label class="field-label col span-4" for="h3">Textarea</label>
        <div class="field-col col span-8">
            <textarea id="h3" class="input <?php echo $size; ?> span-6" name="textarea" <?php if ($disabled) echo 'disabled'; ?>>Lorem ipsum dolor sit amet.</textarea>
        </div>
    </div>

    <div class="field <?php echo $classes; ?>">
        <div class="field-col col span-8 push-4">
            <label class="input-checkbox <?php echo $size; ?>" for="h4"><input id="h4" type="checkbox" name="checkbox" <?php if ($disabled) echo 'disabled'; ?>> Checkbox</label>
        </div>
    </div>

    <div class="field <?php echo $classes; ?>">
        <div class="field-col col span-8 push-4">
            <label class="input-radio <?php echo $size; ?>" for="h5"><input id="h5" type="radio" name="radio" <?php if ($disabled) echo 'disabled'; ?>> Radio option</label>
        </div>
    </div>

    <div class="form-actions">
        <button type="submit" class="button is-success <?php echo $size; ?>">Submit</button>
        <button type="reset" class="button <?php echo $size; ?>">Reset</button>
    </div>

    </fieldset>
</form>

<div class="example-title">Inline</div>

<form action="" method="get" class="form--inline">
    <div class="field <?php echo $classes; ?>">
        <label class="field-label" for="n1">Text</label>
        <input id="n1" type="text" class="input <?php echo $size; ?>" name="text" <?php if ($disabled) echo 'disabled'; ?>>
    </div>

    <div class="field <?php echo $classes; ?>">
        <label class="field-label">Text + Static</label>
        <div class="input-static <?php echo $size; ?>">email@domain.com</div>
    </div>

    <div class="field <?php echo $classes; ?>">
        <label class="field-label" for="n2">Select</label>
        <select id="n2" class="input <?php echo $size; ?>" name="select" <?php if ($disabled) echo 'disabled'; ?>>
            <option value="">CSS</option>
            <option value="">HTML</option>
            <option value="">JavaScript</option>
        </select>
    </div>

    <div class="field <?php echo $classes; ?>">
        <label class="input-checkbox <?php echo $size; ?>" for="n3"><input id="n3" type="checkbox" name="checkbox" <?php if ($disabled) echo 'disabled'; ?>> Checkbox</label>
    </div>

    <div class="field <?php echo $classes; ?>">
        <label class="input-radio <?php echo $size; ?>" for="n4"><input id="n4" type="radio" name="radio" <?php if ($disabled) echo 'disabled'; ?>> Radio option</label>
    </div>

    <div class="form-actions">
        <button type="submit" class="button success <?php echo $size; ?>">Submit</button>
        <button type="reset" class="button <?php echo $size; ?>">Reset</button>
    </div>
</form>

<div class="example-title">Line Height</div>

<input type="text" class="input <?php echo $size; ?>" value="Input">
<select class="input <?php echo $size; ?>"><option>Select</option></select>
<button type="Button" class="button <?php echo $size; ?>">Button</button>
<a href="javascript:;" class="button <?php echo $size; ?>">Anchor</a>
<input type="submit" class="button <?php echo $size; ?>" value="Input">