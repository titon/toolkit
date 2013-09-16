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
            <a href="?component=matrix&theme=<?php echo $_GET['theme']; ?>&mode=multiple">Multiple column spanning items</a> |
            <a href="?component=matrix&theme=<?php echo $_GET['theme']; ?>&mode=single">Single column items</a>
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
            $('matrix').matrix()[where](new Element('li.matrix-grid').grab(i));
        };
    }

    window.addEvent('domready', function() {
        $('matrix').matrix({
            selector: '.matrix-grid'
        });
    });
</script>