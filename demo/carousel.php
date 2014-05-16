<?php
$count = (int) value('count', 6);
$animation = value('animation', '');
$toShow = (int) value('itemsToShow', 1);
$mod = value('modifier', '');
$class = '';

if ($mod) {
    $class = 'carousel--' . $mod;
} else {
    $class = 'carousel';
}

if ($animation === 'fade') {
    $toShow = 1;
}

if ($mod === 'wide') {
    if ($animation === 'slide') {
        $dims = [round(640 / $toShow), 360];
    } else {
        $dims = [640, round(360 / $toShow)];
    }
} else if ($mod === 'square') {
    if ($animation === 'slide') {
        $dims = [round(500 / $toShow), 500];
    } else {
        $dims = [500, round(500 / $toShow)];
    }
} else {
    if ($animation === 'slide') {
        $dims = [round(400 / $toShow), 300];
    } else {
        $dims = [400, round(300 / $toShow)];
    }
} ?>

<div class="example-carousel">
    <div class="<?php echo $class; ?>" id="carousel">
        <div class="carousel-items">
            <ul>
                <?php for ($i = 1; $i <= $count; $i++) { ?>
                    <li>
                        <img src="http://lorempixel.com/<?= $dims[0]; ?>/<?= $dims[1]; ?>/?c=<?= $i; ?>" alt="">

                        <?php if (value('captions', true)) { ?>
                            <div class="carousel-caption">
                                <h5><a href="">Slide #<?php echo $i; ?></a></h5>
                                Lorem ipsum dolor sit amet.
                            </div>
                        <?php } ?>
                    </li>
                <?php } ?>
            </ul>
        </div>

        <?php if (value('tabs', true)) { ?>
            <div class="carousel-tabs">
                <ol class="bullets">
                    <?php for ($i = 1; $i <= $count; $i++) { ?>
                        <li><a href="javascript:;"<?php if ($i == 1) echo ' class="is-active"'; ?>></a></li>
                    <?php } ?>
                </ol>
            </div>
        <?php } ?>

        <?php if (value('arrows', true)) { ?>
            <a href="javascript:;" class="carousel-prev">
                <span class="arrow-left"></span>
            </a>

            <a href="javascript:;" class="carousel-next">
                <span class="arrow-right"></span>
            </a>
        <?php } ?>
    </div>
</div>

<script>
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $('carousel').carousel({
                animation: <?php string('animation', 'slide'); ?>,
                duration: <?php number('duration', 5000); ?>,
                itemsToShow: <?php number('itemsToShow', 1); ?>,
                itemsToCycle: <?php number('itemsToCycle', 1); ?>,
                defaultIndex: <?php number('defaultIndex', 0); ?>,
                reverse: <?php bool('reverse', false); ?>,
                loop: <?php bool('loop', true); ?>,
                infinite: <?php bool('infinite', true); ?>,
                autoCycle: <?php bool('autoCycle', true); ?>,
                stopOnHover: <?php bool('stopOnHover', true); ?>
            });
        });
    <?php } else { ?>
        $(function() {
            $('#carousel').carousel({
                animation: <?php string('animation', 'slide'); ?>,
                duration: <?php number('duration', 5000); ?>,
                itemsToShow: <?php number('itemsToShow', 1); ?>,
                itemsToCycle: <?php number('itemsToCycle', 1); ?>,
                defaultIndex: <?php number('defaultIndex', 0); ?>,
                reverse: <?php bool('reverse', false); ?>,
                loop: <?php bool('loop', true); ?>,
                infinite: <?php bool('infinite', true); ?>,
                autoCycle: <?php bool('autoCycle', true); ?>,
                stopOnHover: <?php bool('stopOnHover', true); ?>
            });
        });
    <?php } ?>
</script>