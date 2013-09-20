<div class="example-header">Pin</div>

<div class="example pin-right">
    <div class="pin" id="pin-right">
        This div should stay positioned at the top right of the page, regardless of window scroll.<br><br>
        It will also stay contained within the parent.
    </div>

    <?php for ($i = 0; $i <= 10; $i++) { ?>
        <p id="t<?php echo $i; ?>">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>
    <?php } ?>
</div>

<div class="example pin-left">
    <div class="pin" id="pin-left1">
        This div should stay positioned at the top right of the page, regardless of window scroll.<br><br>
        It will also stay contained within the parent.
    </div>

    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>
</div>

<div class="example pin-left">
    <div class="pin" id="pin-left2">
        This div should stay positioned at the top right of the page, regardless of window scroll.<br><br>
        It will also stay contained within the parent.
    </div>

    <?php for ($i = 0; $i <= 10; $i++) { ?>
        <p id="b<?php echo $i; ?>">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>
    <?php } ?>
</div>

<div class="example">
    <div class="example-title">Events</div>

    <p>onInit, onShow, onHide, onScroll, onResize</p>
</div>

<script type="text/javascript">
    <?php if ($library === 'mootools') { ?>
        window.addEvent('domready', function() {
            $('pin-right').pin();
            $('pin-left1').pin({ location: 'left' });
            $('pin-left2').pin({ location: 'left', xOffset: 10 });
        });
    <?php } else { ?>
        $(function() {
            $('#pin-right').pin();
            $('#pin-left1').pin({ location: 'left' });
            $('#pin-left2').pin({ location: 'left', xOffset: 10 });
        });
    <?php } ?>
</script>