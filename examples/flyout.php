
<a href="/" class="button js-flyout">Display Root Menu</a>
<br><br>
<a href="/3/0" class="button js-flyout">Display 3>0 Menu</a>
<br><br>
<a href="/0/0/1" class="button js-flyout">Display 0>0>1 Menu</a>

<script>
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $$('.button').addEvent('click', function(e) {
                e.preventDefault();
            });

            $$('.js-flyout').flyout('ajax/flyout.php', {
                delegate: '.js-flyout',
                className: <?php string('className'); ?>,
                mode: <?php string('mode', 'hover'); ?>,
                getUrl: <?php string('getUrl', 'href'); ?>,
                xOffset: <?php number('xOffset'); ?>,
                yOffset: <?php number('yOffset'); ?>,
                showDelay: <?php number('showDelay', 350); ?>,
                hideDelay: <?php number('hideDelay', 500); ?>,
                itemLimit: <?php number('itemLimit', 15); ?>
            });
        });
    <?php } else { ?>
        $(function() {
            $('.button').on('click', function(e) {
                e.preventDefault();
            });

            $('.js-flyout').flyout('ajax/flyout.php', {
                className: <?php string('className'); ?>,
                mode: <?php string('mode', 'hover'); ?>,
                getUrl: <?php string('getUrl', 'href'); ?>,
                xOffset: <?php number('xOffset'); ?>,
                yOffset: <?php number('yOffset'); ?>,
                showDelay: <?php number('showDelay', 350); ?>,
                hideDelay: <?php number('hideDelay', 500); ?>,
                itemLimit: <?php number('itemLimit', 15); ?>
            });
        });
    <?php } ?>
</script>