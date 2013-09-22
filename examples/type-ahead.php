<div class="example-header">Type Ahead</div>

<div class="example">
    <p>Array: Source data is defined as a literal array.<br>
    Shadow text will be displayed within the input (start with "n" to see it).</p>

    <input type="text" id="ta-1">
</div>

<div class="example">
    <p>Function: Source data is returned from a function.</p>

    <input type="text" id="ta-2">
</div>

<div class="example">
    <p>AJAX: Source data is returned from an AJAX call on demand.<br>
    Sorting and matching is handled by the remote endpoint.</p>

    <input type="text" id="ta-3">
</div>

<div class="example">
    <p>AJAX-Prefetch: Source data is returned from an AJAX call that is pre-fetched and cached.<br>
    Sorting and matching is handled within Type Ahead.</p>

    <input type="text" id="ta-4">
</div>

<div class="example">
    <div class="example-title">Events</div>

    <p>onInit, onShow, onHide, onSelect, onReset</p>
</div>

<script type="text/javascript">
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
        { title: 'Notepad' }
    ];

    <?php if ($vendor === 'mootools') { ?>
        window.addEvent('domready', function() {
            $('ta-1').typeAhead({ source: langs, shadow: true });
            $('ta-2').typeAhead({
                source: function() {
                    return langs;
                }
            });
            $('ta-3').typeAhead({ sorter: false, matcher: false, source: 'ajax/type-ahead.php?unique' });
            $('ta-4').typeAhead({ prefetch: true, source: 'ajax/type-ahead.php' });
        });
    <?php } else { ?>
        $(function() {
            $('#ta-1').typeAhead({ source: langs, shadow: true });
            $('#ta-2').typeAhead({
                source: function() {
                    return langs;
                }
            });
            $('#ta-3').typeAhead({ sorter: false, matcher: false, source: 'ajax/type-ahead.php?unique' });
            $('#ta-4').typeAhead({ prefetch: true, source: 'ajax/type-ahead.php' });
        });
    <?php } ?>
</script>