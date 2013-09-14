<div class="example-header">Popover</div>

<div class="example">
    <div class="example-title">Content Loading</div>

    <button type="button" class="button popover-base" data-popover="This is the data-popover attribute">Via Data Attribute (Default)</button>
    <button type="button" class="button popover-base" data-popover="#hidden">Via DOM Element</button>
    <button type="button" class="button popover-ajax" data-popover="ajax/popover.php">Via AJAX</button>
    <button type="button" class="button popover-ajax" data-popover="ajax/popover.php?slow">Via AJAX w/ Loader</button>

    <div id="hidden" style="display: none">This is loaded from a hidden DOM element</div>
</div>

<div class="example">
    <div class="example-title">Options</div>

    <button type="button" class="button popover-delay" data-popover="Popover is shown after 300ms">Show Delay</button>
    <button type="button" class="button popover-base" data-popover="#hidden" title="Custom Title">Title and Content</button>
    <button type="button" class="button popover-offset" data-popover="Popover will have its axis altered">X/Y Offsets</button>
</div>

<div class="example">
    <div class="example-title">Animations</div>

    <button type="button" class="button popover-fade" data-popover="Popover will fade in and out">Fade In/Out</button>
    <button type="button" class="button popover-from-above" data-popover="Popover is falls in from above">From Above</button>
    <button type="button" class="button popover-from-below" data-popover="Popover is moves in from below">From Below</button>
    <button type="button" class="button popover-flip-rotate" data-popover="Popover will flip and rotate into place">Flip Rotate</button>
    <button type="button" class="button popover-slide-in" data-popover="Popover will slide into place (works on all directions)">Slide In</button>
</div>

<div class="example">
    <div class="example-title">Positioning</div>

    <div class="row">
        <button type="button" class="button popover-tl" data-popover="Positioned at top left">Top Left</button>
        <button type="button" class="button popover-tc" data-popover="Positioned at top center">Top Center (Default)</button>
        <button type="button" class="button popover-tr" data-popover="Positioned at top right">Top Right</button>
    </div>

    <div class="row">
        <button type="button" class="button popover-cl" data-popover="Positioned at center left">Center Left</button>
        <button type="button" class="button popover-cr" data-popover="Positioned at center right">Center Right</button>
    </div>

    <div class="row">
        <button type="button" class="button popover-bl" data-popover="Positioned at bottom left">Bottom Left</button>
        <button type="button" class="button popover-bc" data-popover="Positioned at bottom center">Bottom Center</button>
        <button type="button" class="button popover-br" data-popover="Positioned at bottom right">Bottom Right</button>
    </div>
</div>

<div class="example">
    <div class="example-title">Events</div>

    <p>onInit, onShow, onHide</p>
</div>

<script type="text/javascript">
    window.addEvent('domready', function() {
        $$('.popover-base').popover({ delegate: '.popover-base' });
        $$('.popover-ajax').popover({ delegate: '.popover-ajax', ajax: true });
        $$('.popover-delay').popover({ delegate: '.popover-delay', delay: 250 });
        $$('.popover-offset').popover({ delegate: '.popover-offset', xOffset: 15, yOffset: 15 });
        $$('.popover-fade').popover({ delegate: '.popover-fade', animation: 'fade' });
        $$('.popover-from-above').popover({ delegate: '.popover-from-above', animation: 'from-above' });
        $$('.popover-from-below').popover({ delegate: '.popover-from-below', animation: 'from-below' });
        $$('.popover-flip-rotate').popover({ delegate: '.popover-flip-rotate', animation: 'flip-rotate' });
        $$('.popover-slide-in').popover({ delegate: '.popover-slide-in', animation: 'slide-in' });
        $$('.popover-tl').popover({ delegate: '.popover-tl', position: 'topLeft' });
        $$('.popover-tc').popover({ delegate: '.popover-tc', position: 'topCenter' });
        $$('.popover-tr').popover({ delegate: '.popover-tr', position: 'topRight' });
        $$('.popover-cl').popover({ delegate: '.popover-cl', position: 'centerLeft' });
        $$('.popover-cr').popover({ delegate: '.popover-cr', position: 'centerRight' });
        $$('.popover-bl').popover({ delegate: '.popover-bl', position: 'bottomLeft' });
        $$('.popover-bc').popover({ delegate: '.popover-bc', position: 'bottomCenter' });
        $$('.popover-br').popover({ delegate: '.popover-br', position: 'bottomRight' });
    });
</script>