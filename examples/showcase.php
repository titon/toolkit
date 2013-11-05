<?php
$group = value('group', true) ? 'Titon' : '';

for ($i = 1; $i <= value('count', 5); $i++) {
    $width = rand(200, 800);
    $height = rand(200, 800);?>

    <a href="http://lorempixel.com/<?php echo $width; ?>/<?php echo $height; ?>/?s=<?php echo $i; ?>a" title="Lorem ipsum dolor sit amet." class="js-showcase" data-showcase="<?php echo $group; ?>">
        <img src="http://lorempixel.com/<?php echo round($width / 2); ?>/<?php echo round($height / 2); ?>/?s=<?php echo $i; ?>b">
    </a>

<?php } ?>

<script>
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $$('.js-showcase').showcase({
                className: <?php string('className'); ?>,
                blackout: <?php bool('blackout', true); ?>,
                gutter: <?php number('gutter', 50); ?>
            });
        });
    <?php } else { ?>
        $(function() {
            $('.js-showcase').showcase({
                className: <?php string('className'); ?>,
                blackout: <?php bool('blackout', true); ?>,
                gutter: <?php number('gutter', 50); ?>
            });
        });
    <?php } ?>
</script>