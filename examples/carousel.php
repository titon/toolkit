<?php
$count = (int) value('count', 3);
$mod = value('modifier', '');
$class = '';

if ($mod) {
    $class = 'carousel--' . $mod;
} else {
    $class = 'carousel';
} ?>

<div class="example-carousel">
    <div class="<?php echo $class; ?>" id="carousel">
        <div class="carousel-items">
            <ul>
                <?php for ($i = 1; $i <= $count; $i++) { ?>
                    <li>
                        <?php if ($mod === 'wide') { ?>
                            <img src="http://lorempixel.com/640/360/?c=<?php echo $i; ?>">

                        <?php } else if ($mod === 'square') { ?>
                            <img src="http://lorempixel.com/500/500/?c=<?php echo $i; ?>">

                        <?php } else { ?>
                            <img src="http://lorempixel.com/400/300/?c=<?php echo $i; ?>">
                        <?php } ?>

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
                autoCycle: <?php bool('autoCycle', true); ?>,
                stopOnHover: <?php bool('stopOnHover', true); ?>
            });
        });
    <?php } else { ?>
        $(function() {
            $('#carousel').carousel({
                animation: <?php string('animation', 'slide'); ?>,
                duration: <?php number('duration', 5000); ?>,
                autoCycle: <?php bool('autoCycle', true); ?>,
                stopOnHover: <?php bool('stopOnHover', true); ?>
            });
        });
    <?php } ?>
</script>