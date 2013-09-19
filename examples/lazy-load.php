<div class="example-header">LazyLoad</div>

<div class="example">
    <?php $c = time(); ?>

    <div class="example-col align-center">
        <div class="example-title">Default</div>

        <?php for ($x = 0; $x <= 10; $x++) { ?>

            <div class="lazy-load-0 lazy-load" style="background-image: url('http://lorempixel.com/200/200/?c=<?php echo $c; ?>')">
                <!-- Background styles are lazy loaded via CSS -->
            </div>

        <?php $c++; } ?>
    </div>

    <div class="example-col align-center">
        <div class="example-title">Force Load</div>

        <?php for ($x = 0; $x <= 10; $x++) { ?>

            <div class="lazy-load-1 lazy-load">
                <img data-lazyload="http://lorempixel.com/200/200/?c=<?php echo $c; ?>">
            </div>

        <?php $c++; } ?>
    </div>

    <span class="clear"></span>
</div>

<div class="example">
    <div class="example-title">Events</div>

    <p>onInit, onShow, onLoad, onLoadAll, onShutdown</p>
</div>

<script type="text/javascript">
    <?php if ($library === 'mootools') { ?>
        $$('.lazy-load-0').lazyLoad({ lazyClass: '.lazy-load-0' });
        $$('.lazy-load-1').lazyLoad({ lazyClass: '.lazy-load-1', forceLoad: true, delay: 5000 });
    <?php } else { ?>
        $('.lazy-load-0').lazyLoad();
        $('.lazy-load-1').lazyLoad({ forceLoad: true, delay: 5000 });
    <?php } ?>
</script>