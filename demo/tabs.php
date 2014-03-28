
<div class="tabs" id="tabs-1">
    <nav class="tabs-nav">
        <ul>
            <li><a href="#section-1" class="button"><span>Tab 1 via DOM</span></a></li>
            <li><a href="#section-2" class="button">Tab 2 via DOM</a></li>
            <li><a href="ajax/tab.php" class="button">Tab 3 via AJAX</a></li>
        </ul>
    </nav>

    <section class="tabs-section" id="section-1">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>
    </section>

    <section class="tabs-section" id="section-2">
        <p>Suspendisse interdum malesuada mi non dictum. Quisque cursus imperdiet lorem, in posuere quam eleifend non. Integer eros libero, lacinia nec fringilla non, vulputate vitae felis. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis ligula sapien, tristique sit amet tempor id, iaculis vel nisl.</p>
        <p>Maecenas rhoncus facilisis lacus non blandit. Nam quis erat arcu. Suspendisse facilisis venenatis elit, et posuere leo dictum a. Integer at tellus leo, sit amet malesuada orci. Proin placerat nulla vitae diam mattis at volutpat risus pellentesque.</p>
    </section>

    <section class="tabs-section">
        <ul>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
            <li>Aliquam dapibus tempor risus, a ultricies libero posuere ut.</li>
            <li>Proin vitae enim fermentum, vulputate justo id, imperdiet nunc.</li>
            <li>Curabitur pellentesque convallis lectus a porta.</li>
            <li>Quisque tristique lectus sem, vel lacinia ipsum bibendum a.</li>
        </ul>
        <p>Sed malesuada scelerisque semper. Mauris imperdiet nibh eros. Fusce quis vulputate enim. Proin a enim sit amet purus interdum ultricies. In hac habitasse platea dictumst. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut a magna sem, nec placerat nibh. Proin quis metus nunc, at vulputate erat. Etiam quis diam est. Nullam quam turpis, condimentum et iaculis in, pharetra sed enim.</p>
    </section>
</div>

<div class="example-title">Horizontal</div>

<div class="tabs--horizontal grid" id="tabs-2">
    <nav class="tabs-nav col span-2">
        <ul>
            <li><a href="#tab-1" class="button">Tab 1 via DOM</a></li>
            <li><a href="#tab-2" class="button">Tab 2 via DOM</a></li>
            <li><a href="ajax/tab.php" class="button">Tab 3 via AJAX</a></li>
        </ul>
    </nav>

    <div class="col span-9 push-1">
        <section class="tabs-section">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor gravida diam. Donec eget magna nunc. Suspendisse ipsum lacus, pellentesque sit amet lacinia quis, convallis sed ligula. Nullam lobortis sapien et dolor gravida ac convallis erat fermentum. Mauris nec justo lacus. Sed varius varius ligula, sit amet egestas mi blandit dictum. Phasellus sapien tortor, bibendum vitae vehicula a, molestie in odio. Fusce porttitor quam nec libero condimentum eget imperdiet nibh elementum.</p>
        </section>

        <section class="tabs-section">
            <p>Suspendisse interdum malesuada mi non dictum. Quisque cursus imperdiet lorem, in posuere quam eleifend non. Integer eros libero, lacinia nec fringilla non, vulputate vitae felis. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis ligula sapien, tristique sit amet tempor id, iaculis vel nisl.</p>
            <p>Maecenas rhoncus facilisis lacus non blandit. Nam quis erat arcu. Suspendisse facilisis venenatis elit, et posuere leo dictum a. Integer at tellus leo, sit amet malesuada orci. Proin placerat nulla vitae diam mattis at volutpat risus pellentesque.</p>
        </section>

        <section class="tabs-section">
            <ul>
                <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
                <li>Aliquam dapibus tempor risus, a ultricies libero posuere ut.</li>
                <li>Proin vitae enim fermentum, vulputate justo id, imperdiet nunc.</li>
                <li>Curabitur pellentesque convallis lectus a porta.</li>
                <li>Quisque tristique lectus sem, vel lacinia ipsum bibendum a.</li>
            </ul>
            <p>Sed malesuada scelerisque semper. Mauris imperdiet nibh eros. Fusce quis vulputate enim. Proin a enim sit amet purus interdum ultricies. In hac habitasse platea dictumst. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut a magna sem, nec placerat nibh. Proin quis metus nunc, at vulputate erat. Etiam quis diam est. Nullam quam turpis, condimentum et iaculis in, pharetra sed enim.</p>
        </section>
    </div>
</div>

<script>
    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $('tabs-1').tabs({
                mode: <?php string('mode', 'click'); ?>,
                ajax: <?php bool('ajax', true); ?>,
                collapsible: <?php bool('collapsible', false); ?>,
                defaultIndex: <?php number('defaultIndex'); ?>,
                persistState: <?php bool('persistState', false); ?>,
                loadFragment: <?php bool('loadFragment', true); ?>,
                preventDefault: <?php bool('preventDefault', true); ?>,
                cookie: <?php string('cookie'); ?>,
                cookieDuration: <?php number('defaultIndex', 30); ?>
            });

            $('tabs-2').tabs({
                mode: <?php string('mode', 'click'); ?>,
                ajax: <?php bool('ajax', true); ?>,
                collapsible: <?php bool('collapsible', false); ?>,
                defaultIndex: <?php number('defaultIndex'); ?>,
                persistState: <?php bool('persistState', false); ?>,
                loadFragment: <?php bool('loadFragment', true); ?>,
                preventDefault: <?php bool('preventDefault', true); ?>,
                cookie: <?php string('cookie'); ?>,
                cookieDuration: <?php number('cookieDuration', 30); ?>
            });
        });
    <?php } else { ?>
        $(function() {
            $('#tabs-1').tabs({
                mode: <?php string('mode', 'click'); ?>,
                ajax: <?php bool('ajax', true); ?>,
                collapsible: <?php bool('collapsible', false); ?>,
                defaultIndex: <?php number('defaultIndex'); ?>,
                persistState: <?php bool('persistState', false); ?>,
                loadFragment: <?php bool('loadFragment', true); ?>,
                preventDefault: <?php bool('preventDefault', true); ?>,
                cookie: <?php string('cookie'); ?>,
                cookieDuration: <?php number('cookieDuration', 30); ?>
            });

            $('#tabs-2').tabs({
                mode: <?php string('mode', 'click'); ?>,
                ajax: <?php bool('ajax', true); ?>,
                collapsible: <?php bool('collapsible', false); ?>,
                defaultIndex: <?php number('defaultIndex'); ?>,
                persistState: <?php bool('persistState', false); ?>,
                loadFragment: <?php bool('loadFragment', true); ?>,
                preventDefault: <?php bool('preventDefault', true); ?>,
                cookie: <?php string('cookie'); ?>,
                cookieDuration: <?php number('cookieDuration', 30); ?>
            });
        });
    <?php } ?>
</script>