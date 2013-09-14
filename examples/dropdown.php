<div class="example-header">Dropdowns</div>

<div class="example">
    <ul class="dropdown show" style="position: static; margin: 0 auto;">
        <li><a href="">Action</a></li>
        <li><a href="">Another Action</a></li>
        <li><a href="">Last Action</a></li>
    </ul>

    <p>With headings.</p>

    <ul class="dropdown show" style="position: static; margin: 0 auto;">
        <li class="heading">Heading</li>
        <li><a href="">Another Action</a></li>
        <li><a href="">Last Action</a></li>
        <li class="heading">Heading</li>
        <li><a href="">Some Action</a></li>
    </ul>

    <p>With dividers and sub-menus.</p>

    <ul class="dropdown show" style="position: static; margin: 0 auto;">
        <li>
            <a href="">
                <span class="caret-right"></span>
                Another Action
            </a>
        </li>
        <li class="has-children">
            <a href="">
                <span class="caret-right"></span>
                Last Action
            </a>

            <ul class="dropdown">
                <li><a href="">Action</a></li>
                <li><a href="">Another Action</a></li>
                <li><a href="">Last Action</a></li>
            </ul>
        </li>
        <li class="divider"></li>
        <li><a href="">Some Action</a></li>
    </ul>
</div>

<div class="example">
    <div class="example-title">Button Dropdowns</div>

    <div class="button-group">
        <button type="button" class="button js-dropdown" data-toggle="#bg-dropdown-1">
            Button
            <span class="caret-down"></span>
        </button>

        <ul class="dropdown" id="bg-dropdown-1">
            <li><a href="">Action</a></li>
            <li><a href="">Another Action</a></li>
            <li><a href="">Last Action</a></li>
        </ul>
    </div>

    <div class="button-group">
        <a href="javascript:;" class="button">Button</a>
        <button type="button" class="button js-dropdown" data-toggle="#bg-dropdown-2">
            <span class="caret-down"></span>
        </button>

        <ul class="dropdown" id="bg-dropdown-2">
            <li><a href="">Action</a></li>
            <li><a href="">Another Action</a></li>
            <li><a href="">Last Action</a></li>
        </ul>
    </div>

    <div class="button-group">
        <a href="javascript:;" class="button">Button + Right Align</a>
        <button type="button" class="button js-dropdown" data-toggle="#bg-dropdown-3">
            <span class="caret-down"></span>
        </button>

        <ul class="dropdown dropdown--right" id="bg-dropdown-3">
            <li><a href="">Action</a></li>
            <li><a href="">Another Action</a></li>
            <li><a href="">Last Action</a></li>
        </ul>
    </div>

    <div class="button-group">
        <button type="button" class="button js-dropdown" data-toggle="#bg-dropdown-4">
            Button + Reverse Dropdown
            <span class="caret-down"></span>
        </button>

        <ul class="dropdown dropdown--top" id="bg-dropdown-4">
            <li><a href="">Action</a></li>
            <li><a href="">Another Action</a></li>
            <li><a href="">Last Action</a></li>
        </ul>
    </div>
</div>

<script type="text/javascript">
    window.addEvent('domready', function() {
        $$('.js-dropdown').dropdown();
    });
</script>