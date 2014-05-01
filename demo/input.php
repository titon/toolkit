<?php
$disabled = value('disabled', false); ?>

<form action="" method="get" id="form">
    <div class="field">
        <label class="input-checkbox" for="checkboxes1"><input id="checkboxes1" type="checkbox" name="checkboxes[]" checked <?php if ($disabled) echo 'disabled'; ?>> Checkboxes</label>
        <label class="input-checkbox" for="checkboxes2"><input id="checkboxes2" type="checkbox" class="cb-2" name="checkboxes[]" <?php if ($disabled) echo 'disabled'; ?>> Checkboxes</label>
        <label class="input-checkbox" for="checkboxes3"><input id="checkboxes3" type="checkbox" name="checkboxes[]" <?php if ($disabled) echo 'disabled'; ?>> Checkboxes</label>
        <label class="input-checkbox" for="checkboxes4"><input id="checkboxes4" type="checkbox" class="cb-4" name="checkboxes[]" <?php if ($disabled) echo 'disabled'; ?>> Checkboxes</label>
        <label class="input-checkbox" for="checkboxes5"><input id="checkboxes5" type="checkbox" name="checkboxes[]" <?php if ($disabled) echo 'disabled'; ?>> Checkboxes</label>
    </div>

    <div class="field">
        <label class="input-radio" for="radios1"><input id="radios1" type="radio" class="radio-1" name="radios[]" <?php if ($disabled) echo 'disabled'; ?>> Radios</label>
        <label class="input-radio" for="radios2"><input id="radios2" type="radio" name="radios[]" <?php if ($disabled) echo 'disabled'; ?>> Radios</label>
        <label class="input-radio" for="radios3"><input id="radios3" type="radio" name="radios[]" <?php if ($disabled) echo 'disabled'; ?>> Radios</label>
        <label class="input-radio" for="radios4"><input id="radios4" type="radio" name="radios[]" <?php if ($disabled) echo 'disabled'; ?>> Radios</label>
        <label class="input-radio" for="radios5"><input id="radios5" type="radio" class="radio-5" name="radios[]" checked <?php if ($disabled) echo 'disabled'; ?>> Radios</label>
    </div>

    <div class="field">
        <label class="field-label" for="select_single">Select</label>
        <select id="select_single" class="input custom-class" name="select_single" <?php if ($disabled) echo 'disabled'; ?>>
            <option value="css">CSS</option>
            <option value="html" selected>HTML</option>
            <option value="js">JavaScript</option>
        </select>
    </div>

    <div class="field">
        <label class="field-label" for="select_single2">Select w/ Custom labels</label>
        <select id="select_single2" class="input custom-class" name="select_single2" <?php if ($disabled) echo 'disabled'; ?>>
            <option value="css" title="Style">CSS</option>
            <option value="html" title="Markup">HTML</option>
            <option value="js" title="Script">JavaScript</option>
        </select>
    </div>

    <div class="field">
        <label class="field-label" for="select_single3">Select w/ Disabled options</label>
        <select id="select_single3" class="input custom-class" name="select_single3" <?php if ($disabled) echo 'disabled'; ?>>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
            <option value="js" disabled>JavaScript</option>
        </select>
    </div>

    <div class="field">
        <label class="field-label" for="select_group">Select + Optgroup w/ Descriptions</label>
        <select id="select_group" class="another-class input" name="select_group" <?php if ($disabled) echo 'disabled'; ?>>
            <optgroup label="Front-end">
                <option value="css" data-description="Cascading Style Sheets">CSS</option>
                <option value="html" data-description="Hyper Text Markup Lang">HTML</option>
                <option value="js">JavaScript</option>
            </optgroup>
            <optgroup label="Back-end">
                <option value="php" data-description="Hyper Text Pre-Processor">PHP</option>
                <option value="python">Python</option>
                <option value="ruby">Ruby</option>
            </optgroup>
        </select>
    </div>

    <div class="field">
        <label class="field-label" for="select_group2">Select + Optgroup w/ Disabled options</label>
        <select id="select_group2" class="another-class input" name="select_group2" <?php if ($disabled) echo 'disabled'; ?>>
            <optgroup label="Front-end">
                <option value="css">CSS</option>
                <option value="html">HTML</option>
                <option value="js" disabled>JavaScript</option>
            </optgroup>
            <optgroup label="Back-end" disabled>
                <option value="php">PHP</option>
                <option value="python">Python</option>
                <option value="ruby">Ruby</option>
            </optgroup>
        </select>
    </div>

    <div class="field">
        <label class="field-label" for="select_multi">Multiple Select</label>
        <select id="select_multi" class="input" name="select_multi" multiple <?php if ($disabled) echo 'disabled'; ?>>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
            <option value="js">JavaScript</option>
            <option value="php">PHP</option>
            <option value="python">Python</option>
            <option value="ruby">Ruby</option>
        </select>
    </div>

    <div class="field">
        <label class="field-label" for="select_multi2">Multiple Select w/ Default label</label>
        <select id="select_multi2" class="input" name="select_multi2" title="-- Select One --" multiple <?php if ($disabled) echo 'disabled'; ?>>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
            <option value="js">JavaScript</option>
            <option value="php">PHP</option>
            <option value="python">Python</option>
            <option value="ruby">Ruby</option>
        </select>
    </div>

    <div class="field">
        <label class="field-label" for="select_multi">Multiple Select + Many items w/ Disabled options</label>
        <select id="select_multi" class="input" name="select_multi" multiple <?php if ($disabled) echo 'disabled'; ?>>
            <?php for ($i = 0; $i <= 50; $i++) { ?>
                <option value="<?php echo $i; ?>"<?php echo ($i % 3 == 0) ? ' disabled' : ''; ?>><?php echo $i; ?></option>
            <?php } ?>
        </select>
    </div>

    <br><br><br><br><br><br><br>
</form>

<script>
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $('form').input({
                checkbox: '<?php echo value('checkbox', true) ? 'input[type="checkbox"]' : ''; ?>',
                radio: '<?php echo value('radio', true) ? 'input[type="radio"]' : ''; ?>',
                select: '<?php echo value('select', true) ? 'select' : ''; ?>',
                native: <?php bool('native', false); ?>,
                multipleFormat: <?php string('multipleFormat', 'count'); ?>,
                listLimit: <?php number('listLimit', 5); ?>,
                hideOpened: <?php bool('hideOpened', true); ?>,
                hideFirst: <?php bool('hideFirst', false); ?>,
                hideSelected: <?php bool('hideSelected', false); ?>
            });
        });
    <?php } else { ?>
        $(function() {
            $('#form').input({
                checkbox: '<?php echo value('checkbox', true) ? 'input:checkbox' : ''; ?>',
                radio: '<?php echo value('radio', true) ? 'input:radio' : ''; ?>',
                select: '<?php echo value('select', true) ? 'select' : ''; ?>',
                native: <?php bool('native', false); ?>,
                multipleFormat: <?php string('multipleFormat', 'count'); ?>,
                listLimit: <?php number('listLimit', 5); ?>,
                hideOpened: <?php bool('hideOpened', true); ?>,
                hideFirst: <?php bool('hideFirst', false); ?>,
                hideSelected: <?php bool('hideSelected', false); ?>
           });
        });
    <?php } ?>
</script>