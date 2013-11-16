
<ul class="button-group" id="stalker-target">
    <li><a href="#a" class="button">A</a></li>
    <li><a href="#b" class="button">B</a></li>
    <li><a href="#d" class="button">D</a></li>
    <li><a href="#e" class="button">E</a></li>
</ul>

<div id="stalker">
    <?php $titles = array('A', 'B', 'C', 'D', 'E');
    for ($i = 0; $i < 5; $i++) { ?>

        <div id="<?php echo strtolower($titles[$i]); ?>">
            <h3><?php echo $titles[$i]; ?></h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>
        </div>
    <?php } ?>
</div>

<div class="example-title">Overflow Auto</div>

<ul class="button-group" id="stalker2-target">
    <li><a href="#u" class="button">U</a></li>
    <li><a href="#v" class="button">V</a></li>
    <li><a href="#x" class="button">X</a></li>
    <li><a href="#z" class="button">Z</a></li>
</ul>

<div id="stalker2" class="example-stalker">
    <?php $titles = array('U', 'V', 'W', 'X', 'Y', 'Z');
    for ($i = 0; $i < 6; $i++) { ?>

        <div id="<?php echo strtolower($titles[$i]); ?>">
            <h3><?php echo $titles[$i]; ?></h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>
        </div>
    <?php } ?>
</div>

<script>
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            document.body.stalker({
                target: '#stalker-target a',
                marker: '#stalker div[id]',
                threshold: <?php number('threshold', 50); ?>,
                applyToParent: <?php bool('applyToParent', true); ?>
            });

            $('stalker2').stalker({
                target: '#stalker2-target a',
                marker: 'div[id]',
                threshold: <?php number('threshold', 50); ?>,
                applyToParent: <?php bool('applyToParent', true); ?>
            });
        });
    <?php } else { ?>
        $(function() {
            $('body').stalker({
                target: '#stalker-target a',
                marker: '#stalker div[id]',
                threshold: <?php number('threshold', 50); ?>,
                applyToParent: <?php bool('applyToParent', true); ?>
            });

            $('#stalker2').stalker({
                target: '#stalker2-target a',
                marker: 'div[id]',
                threshold: <?php number('threshold', 50); ?>,
                applyToParent: <?php bool('applyToParent', true); ?>
            });
        });
    <?php } ?>
</script>