<?php
$mode = isset($_GET['mode']) ? $_GET['mode'] : 'single'; ?>

<div class="example-header">
    Matrix
</div>

<div class="example">
    <p class="clear-fix">
        <button type="button" onclick="appendItem();" class="float-right">Append Item</button>
        <button type="button" onclick="prependItem();" class="float-right">Prepend Item</button>
        <button type="button" onclick="removeItem();" class="float-right">Remove Item</button>

        <span class="float-left">
            View:
            <a href="?component=matrix&theme=<?php echo $_GET['theme']; ?>&library=<?php echo $libraryFile; ?>&mode=multiple">Multiple column spanning items</a> |
            <a href="?component=matrix&theme=<?php echo $_GET['theme']; ?>&library=<?php echo $libraryFile; ?>&mode=single">Single column items</a>
        </span>
    </p>

    <ul id="matrix">
        <?php for ($i = 0, $x = 0; $i <= 25; $i++) { ?>

            <li class="matrix-grid">
                <?php if ($mode === 'single') { ?>
                    <img src="http://lorempixel.com/200/<?php echo rand(200, 600); ?>/">
                <?php } else { ?>
                    <img src="http://lorempixel.com/<?php echo rand(200, 600); ?>/<?php echo rand(100, 600); ?>/">
                <?php } ?>
            </li>

        <?php } ?>
    </ul>
</div>

<script type="text/javascript">
    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function appendItem() {
        newItem('append');
    }

    function prependItem() {
        newItem('prepend');
    }

    function removeItem() {
        <?php if ($library === 'mootools') { ?>
            $('matrix').matrix().remove($$('.matrix-grid').shuffle()[0]);
        <?php } else { ?>
            $('#matrix').toolkit('matrix').remove($('.matrix-grid')[0]);
        <?php } ?>
    }

    function newItem(where) {
        var w = 200,
            h = random(200, 600),
            i = new Image();

        <?php if ($mode === 'multiple') { ?>
            w = random(200, 600);
        <?php } ?>

        i.src = 'http://lorempixel.com/' + w + '/' + h + '/';
        i.onload = function() {
            <?php if ($library === 'mootools') { ?>
                $('matrix').matrix()[where](new Element('li.matrix-grid').grab(i));
            <?php } else { ?>
                $('#matrix').toolkit('matrix')[where]($('<li/>').addClass('matrix-grid').html(i));
            <?php } ?>
        };
    }

    <?php if ($library === 'mootools') { ?>
        window.addEvent('domready', function() {
            $('matrix').matrix({
                selector: '.matrix-grid'
            });
        });
    <?php } else { ?>
        $(function() {
            $('#matrix').matrix({
                selector: '.matrix-grid'
            });
        });
    <?php } ?>
</script>