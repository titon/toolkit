<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>

<button type="button" onclick="doCanvas('left');">LEFT</button>
<button type="button" onclick="doCanvas('right');">RIGHT</button>

<div class="off-canvas--left" id="left-canvas">
    Left Canvas
</div>

<div class="off-canvas--right" id="right-canvas">
    Right Canvas
</div>

<script>
    function doCanvas(side) {
        var sidebar = $('#' + side + '-canvas');

        if (sidebar.hasClass('show')) {
            $('body').css('padding-' + side, 0);
            sidebar.removeClass('show');
        } else {
            $('body').css('padding-' + side, sidebar.width());
            sidebar.reveal();
        }
    }

    $(function() {
        $('body').addClass('off-canvas-container');
    })
</script>