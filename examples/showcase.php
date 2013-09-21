<div class="example-header">Showcase</div>

<div class="example">
    <p>Single media.</p>

    <a href="http://lorempixel.com/640/360/?s=1" title="Some title." class="js-showcase"><img src="http://lorempixel.com/320/180/?s=1"></a>
    <a href="http://lorempixel.com/640/360/?s=2" title="A really really long title will go here. It can be very loooong." class="js-showcase"><img src="http://lorempixel.com/320/180/?s=2"></a>
    <a href="http://lorempixel.com/640/360/?s=3" title="" class="js-showcase"><img src="http://lorempixel.com/320/180/?s=3"></a>
    <a href="http://lorempixel.com/640/360/?s=4" title="And maybe another." class="js-showcase"><img src="http://lorempixel.com/320/180/?s=4"></a>
    <a href="http://lorempixel.com/640/360/?s=5" title="Another title here." class="js-showcase"><img src="http://lorempixel.com/320/180/?s=5"></a>

    <p>Multiple items via category. Different image sizes.</p>

    <a href="http://lorempixel.com/640/360/?s=1" title="Some title." class="js-showcase" data-showcase="Titon"><img src="http://lorempixel.com/320/180/?s=1"></a>
    <a href="http://lorempixel.com/540/200/?s=2" title="A really really long title will go here. It can be very loooong." class="js-showcase" data-showcase="Titon"><img src="http://lorempixel.com/270/100/?s=2"></a>
    <a href="http://lorempixel.com/250/250/?s=3" title="" class="js-showcase" data-showcase="Titon"><img src="http://lorempixel.com/175/175/?s=3"></a>
    <a href="http://lorempixel.com/700/300/?s=4" title="And maybe another." class="js-showcase" data-showcase="Titon"><img src="http://lorempixel.com/350/150/?s=4"></a>
    <a href="http://lorempixel.com/250/500/?s=5" title="Another title here." class="js-showcase" data-showcase="Titon"><img src="http://lorempixel.com/175/250/?s=5"></a>
</div>

<script type="text/javascript">
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $$('.js-showcase').showcase();
        });
    <?php } else { ?>
        $(function() {
            $('.js-showcase').showcase();
        });
    <?php } ?>
</script>