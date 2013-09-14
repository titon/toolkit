<?php
$p1 = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>';
$p2 = '<p>Suspendisse interdum malesuada mi non dictum. Quisque cursus imperdiet lorem, in posuere quam eleifend non. Integer eros libero, lacinia nec fringilla non, vulputate vitae felis. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis ligula sapien, tristique sit amet tempor id, iaculis vel nisl. Maecenas rhoncus facilisis lacus non blandit. Nam quis erat arcu. Suspendisse facilisis venenatis elit, et posuere leo dictum a. Integer at tellus leo, sit amet malesuada orci. Proin placerat nulla vitae diam mattis at volutpat risus pellentesque.</p>';
$p3 = '<p>Sed malesuada scelerisque semper. Mauris imperdiet nibh eros. Fusce quis vulputate enim. Proin a enim sit amet purus interdum ultricies. In hac habitasse platea dictumst. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut a magna sem, nec placerat nibh. Proin quis metus nunc, at vulputate erat. Etiam quis diam est. Nullam quam turpis, condimentum et iaculis in, pharetra sed enim.</p>'; ?>

<div class="example-header">Accordion</div>

<div class="example">
    <p>Default functionality.</p>

    <ul class="accordion acc-1" id="acc-1">
        <li>
            <header class="accordion-head">
                <h4>One</h4>
            </header>
            <section class="accordion-inner">
                <div class="accordion-body"><?php echo $p1; ?></div>
            </section>
        </li>
        <li>
            <header class="accordion-head">
                <h4>Two</h4>
            </header>
            <section class="accordion-inner">
                <div class="accordion-body"><?php echo $p2; ?></div>
            </section>
        </li>
        <li>
            <header class="accordion-head">
                <h4>Three</h4>
            </header>
            <section class="accordion-inner">
                <div class="accordion-body"><?php echo $p3; ?></div>
            </section>
        </li>
    </ul>
</div>

<div class="example">
    <p>Collapsible sections. Multiple visibility.</p>

    <ul class="accordion acc-2">
        <li>
            <header class="accordion-head">
                <h4>One</h4>
            </header>
            <section class="accordion-inner">
                <div class="accordion-body"><?php echo $p1; ?></div>
            </section>
        </li>
        <li>
            <header class="accordion-head">
                <h4>Two</h4>
            </header>
            <section class="accordion-inner">
                <div class="accordion-body"><?php echo $p2; ?></div>
            </section>
        </li>
        <li>
            <header class="accordion-head">
                <h4>Three</h4>
            </header>
            <section class="accordion-inner">
                <div class="accordion-body"><?php echo $p3; ?></div>
            </section>
        </li>
    </ul>
</div>

<div class="example">
    <p>Toggle with hover.</p>

    <ul class="accordion acc-3">
        <li>
            <header class="accordion-head">
                <h4>One</h4>
            </header>
            <section class="accordion-inner">
                <div class="accordion-body"><?php echo $p1; ?></div>
            </section>
        </li>
        <li>
            <header class="accordion-head">
                <h4>Two</h4>
            </header>
            <section class="accordion-inner">
                <div class="accordion-body"><?php echo $p2; ?></div>
            </section>
        </li>
        <li>
            <header class="accordion-head">
                <h4>Three</h4>
            </header>
            <section class="accordion-inner">
                <div class="accordion-body"><?php echo $p3; ?></div>
            </section>
        </li>
    </ul>
</div>

<div class="example">
    <div class="example-title">Events</div>

    <p>onInit, onShow, onHide</p>
</div>

<script type="text/javascript">
    window.addEvent('domready', function() {
        $('acc-1').accordion();
        $$('.acc-2').accordion({ multiple: true, collapsible: true });
        $$('.acc-3').accordion({ mode: 'hover' });
    });
</script>