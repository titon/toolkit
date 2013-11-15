
<ul class="button-group" id="stalker-target">
    <li><a href="#a" class="button">A</a></li>
    <li><a href="#b" class="button">B</a></li>
    <li><a href="#d" class="button">D</a></li>
    <li><a href="#e" class="button">E</a></li>
</ul>

<div class="example-stalker" id="stalker">
    <?php $titles = array('A', 'B', 'C', 'D', 'E');
    for ($i = 0; $i < 5; $i++) { ?>
        <h3 id="<?php echo strtolower($titles[$i]); ?>"><?php echo $titles[$i]; ?></h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>
    <?php } ?>
</div>

<script>
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $('stalker').stalker({
                target: '#stalker-target a',
                threshold: <?php number('threshold', 50); ?>,
                applyToParent: <?php bool('applyToParent', true); ?>
            });
        });
    <?php } else { ?>
        $(function() {
            $('#stalker').stalker({
                target: '#stalker-target a',
                threshold: <?php number('threshold', 50); ?>,
                applyToParent: <?php bool('applyToParent', true); ?>
            });
        });
    <?php } ?>
</script>