<?php

$mode = isset($_GET['mode']) ? $_GET['mode'] : 'single';
$images = array(
    array(200, 200),
    array(100, 100),
    array(300, 150),
    array(200, 400),
    array(500, 200),
    array(200, 175),
    array(250, 200),
    array(200, 200),
    array(200, 100),
    array(200, 150),
    array(200, 400),
    array(300, 225),
    array(200, 175),
    array(150, 400)
);

shuffle($images); ?>

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
            <a href="?component=matrix&theme=<?php echo $_GET['theme']; ?>&mode=multiple">Multiple column spanning items</a> |
            <a href="?component=matrix&theme=<?php echo $_GET['theme']; ?>&mode=single">Single column items</a>
        </span>
    </p>

    <div id="matrix">
        <?php for ($i = 0, $x = 0; $i <= 25; $i++) {
            if ($x >= count($images)) {
                $x = 0;
            } ?>

            <div class="matrix-grid">
                <?php if ($mode === 'single') { ?>
                    <img src="http://lorempixel.com/200/<?php echo rand(100, 600); ?>/">
                <?php } else { ?>
                    <img src="http://lorempixel.com/<?php echo $images[$x][0]; ?>/<?php echo $images[$x][1]; ?>/">
                <?php } ?>
            </div>

        <?php $x++;
        } ?>
    </div>
</div>

<script type="text/javascript">
    function appendItem() {
        newItem('append');
    }

    function prependItem() {
        newItem('prepend');
    }

    function removeItem() {
        var items = $$('.matrix-grid').shuffle();

        $('matrix').matrix().remove(items[0]);
    }

    function newItem(where) {
        var w = 200,
            h = Number.random(200, 600),
            i = new Image();

        <?php if ($mode === 'multiple') { ?>
            w = Number.random(200, 600);
        <?php } ?>

        i.src = 'http://lorempixel.com/' + w + '/' + h + '/';
        i.onload = function() {
            $('matrix').matrix()[where](new Element('div.matrix-grid').grab(i));
        };
    }

    window.addEvent('domready', function() {
        setTimeout(function() {
            $('matrix').matrix({
                selector: '.matrix-grid'
            });
        }, 4000); // Wait for images to load
    });
</script>