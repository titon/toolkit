<p>Uses a static array for each lookup.</p>

<input type="text" id="ta-static" class="input">

<p>Uses an AJAX call for each lookup.</p>

<input type="text" id="ta-dynamic" class="input">

<script>
    var langs = [
        { title: 'PHP', description: 'Pre-HyperText Processor', category: 'Backend' },
        { title: 'CakePHP', category: 'Framework' },
        { title: 'Symfony', category: 'Framework' },
        { title: 'Zend', category: 'Framework' },
        { title: 'Code Igniter', category: 'Framework' },
        { title: 'Lithium', category: 'Framework' },
        { title: 'HTML', description: 'Hyper Text Markup Language', category: 'Frontend' },
        { title: 'Javascript', category: 'Frontend' },
        { title: 'MooTools', category: 'Framework' },
        { title: 'jQuery', category: 'Framework' },
        { title: 'Ruby', category: 'Backend' },
        { title: 'Ruby on Rails', category: 'Framework' },
        { title: 'Java', category: 'Backend' },
        { title: 'Python', category: 'Backend' },
        { title: 'Go', category: 'Backend' },
        { title: 'Node.js', category: 'Backend' },
        { title: 'Asp.net', category: 'Backend' },
        { title: 'CSS' }
    ];

    var options = {
        className: <?php string('className'); ?>,
        source: langs,
        minLength: <?php number('minLength', 1); ?>,
        itemLimit: <?php number('itemLimit', 15); ?>,
        throttle: <?php number('throttle', 250); ?>,
        prefetch: <?php bool('prefetch', false); ?>,
        shadow: <?php bool('shadow', false); ?>
    };

    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $('ta-static').typeAhead(options);

            options.source = 'ajax/type-ahead.php';
            $('ta-dynamic').typeAhead(options);
        });
    <?php } else { ?>
        $(function() {
            $('#ta-static').typeAhead(options);

            options.source = 'ajax/type-ahead.php';
            $('#ta-dynamic').typeAhead(options);
        });
    <?php } ?>
</script>