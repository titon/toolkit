<?php
$count = (int) value('count', 3); ?>

<div class="carousel" id="carousel">
    <ul class="carousel-items">
        <?php for ($i = 1; $i <= $count; $i++) { ?>
            <li>
                <img src="http://lorempixel.com/640/360/?c=<?php echo $i; ?>">

                <?php if (value('captions')) { ?>
                    <div class="carousel-caption">
                        <h5><a href="">Slide #<?php echo $i; ?></a></h5>
                        <p>Lorem ipsum dolor sit amet.</p>
                    </div>
                <?php } ?>
            </li>
        <?php } ?>
    </ul>

    <?php if (value('tabs')) { ?>
        <ol class="carousel-tabs">
            <?php for ($i = 1; $i <= $count; $i++) { ?>
                <li><a href="javascript:;"<?php if ($i == 1) echo ' class="is-active"'; ?>></a></li>
            <?php } ?>
        </ol>
    <?php } ?>

    <?php if (value('arrows')) { ?>
        <a href="javascript:;" class="carousel-prev">
            <span class="icon-chevron-sign-left"></span>
        </a>

        <a href="javascript:;" class="carousel-next">
            <span class="icon-chevron-sign-right"></span>
        </a>
    <?php } ?>
</div>

<script>
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $('carousel').carousel({
                className: <?php string('className'); ?>,
                animation: <?php string('animation', 'slide'); ?>,
                duration: <?php number('duration', 5000); ?>,
                autoCycle: <?php bool('autoCycle', true); ?>,
                stopOnHover: <?php bool('stopOnHover', true); ?>
            });
        });
    <?php } else { ?>
        $(function() {
            $('#carousel').carousel({
                className: <?php string('className'); ?>,
                animation: <?php string('animation', 'slide'); ?>,
                duration: <?php number('duration', 5000); ?>,
                autoCycle: <?php bool('autoCycle', true); ?>,
                stopOnHover: <?php bool('stopOnHover', true); ?>
            });
        });
    <?php } ?>
</script>