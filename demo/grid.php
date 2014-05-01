
<div class="grid example-grid">
    <div class="col span-1">1</div>
    <div class="col span-1">1</div>
    <div class="col span-1">1</div>
    <div class="col span-1">1</div>
    <div class="col span-1">1</div>
    <div class="col span-1">1</div>
    <div class="col span-1">1</div>
    <div class="col span-1">1</div>
    <div class="col span-1">1</div>
    <div class="col span-1">1</div>
    <div class="col span-1">1</div>
    <div class="col span-1">1</div>
</div>

<div class="grid example-grid">
    <div class="col span-2">2</div>
    <div class="col span-2">2</div>
    <div class="col span-2">2</div>
    <div class="col span-2">2</div>
    <div class="col span-2">2</div>
    <div class="col span-2">2</div>
</div>

<div class="grid example-grid">
    <div class="col span-3">3</div>
    <div class="col span-3">3</div>
    <div class="col span-3">3</div>
    <div class="col span-3">3</div>
</div>

<div class="grid example-grid">
    <div class="col span-4">4</div>
    <div class="col span-4">4</div>
    <div class="col span-4">4</div>
</div>

<div class="grid example-grid">
    <div class="col span-5">5</div>
    <div class="col span-2">2</div>
    <div class="col span-5">5</div>
</div>

<div class="grid example-grid">
    <div class="col span-6">6</div>
    <div class="col span-6">6</div>
</div>

<div class="grid example-grid">
    <div class="col span-7">7</div>
    <div class="col span-5">5</div>
</div>

<div class="grid example-grid">
    <div class="col span-8">8</div>
    <div class="col span-4">4</div>
</div>

<div class="grid example-grid">
    <div class="col span-9">9</div>
    <div class="col span-3">3</div>
</div>

<div class="grid example-grid">
    <div class="col span-10">10</div>
    <div class="col span-2">2</div>
</div>

<div class="grid example-grid">
    <div class="col span-11">11</div>
    <div class="col span-1">1</div>
</div>

<div class="grid example-grid">
    <div class="col span-12">12</div>
</div>

<div class="example-title">Responsive Grid</div>

<p>Different column sizes for mobile &lt;=480px (3 columns), tablet 481px-1024px (6 columns) and desktop &gt;1024px (12 columns).</p>

<div class="grid example-grid">
    <div class="col span-3 tablet-2 mobile-1">
        Desktop: 25%<br>
        Tablet: 33%<br>
        Mobile: 33%
    </div>
    <div class="col desktop-6 tablet-4 mobile-1">
        Desktop: 50%<br>
        Tablet: 66%<br>
        Mobile: 33%
    </div>
    <div class="col desktop-3 hide-tablet mobile-1">
        Desktop: 25%<br>
        Tablet: hidden<br>
        Mobile: 33%
    </div>
</div>

<p>Different column sizes for small &lt;=768px (6 columns), medium 769px-1280px (8 columns) and large &gt;1280px (12 columns).</p>

<div class="grid example-grid">
    <div class="col large-4 medium-2 small-1">
        Large: 33%<br>
        Medium: 25%<br>
        Small: 16%
    </div>
    <div class="col large-4 medium-2 small-3">
        Large: 33%<br>
        Medium: 25%<br>
        Small: 50%
    </div>
    <div class="col large-4 medium-4 hide-small">
        Large: 33%<br>
        Medium: 50%<br>
        Small: hidden
    </div>
</div>

<p>The columns should stay the same percentage in all sizes, devices and resolutions.</p>

<div class="grid example-grid">
    <div class="col span-2">16%</div>
    <div class="col span-8">66%</div>
    <div class="col span-2">16%</div>
</div>

<div class="example-title">Nesting</div>

<div class="grid example-grid">
    <div class="col span-6">
        Lorem ipsum dolor sit amet.
        <div class="grid example-grid">
            <div class="col span-4">4</div>
            <div class="col span-4">4</div>
            <div class="col span-4">4</div>
        </div>
        Lorem ipsum dolor sit amet.
    </div>
    <div class="col span-6">
        Lorem ipsum dolor sit amet.
        <div class="grid example-grid">
            <div class="col span-7">7</div>
            <div class="col span-5">5</div>
        </div>
        Lorem ipsum dolor sit amet.
    </div>
</div>

<div class="example-title">Push, Pull</div>

<div class="grid example-grid">
    <div class="col span-4">4</div>
    <div class="col span-4 push-4">4</div>
</div>
<div class="grid example-grid">
    <div class="col span-6">6</div>
    <div class="col span-1 pull-1">1</div>
</div>
<div class="grid example-grid">
    <div class="col span-3">3</div>
    <div class="col span-8 push-1">8</div>
</div>
<div class="grid example-grid">
    <div class="col span-9 push-3">9 (first)</div>
    <div class="col span-3 pull-9">3 (second)</div>
</div>
<div class="grid example-grid">
    <div class="col span-7 push-3">7</div>
</div>

<p>For desktop, tablet and mobile!</p>

<div class="grid example-grid">
    <div class="col desktop-4 tablet-2 mobile-1">
        Desktop: 33%<br>
        Tablet: 33%<br>
        Mobile: 33%
    </div>
    <div class="col desktop-6 desktop-push-2 tablet-3 tablet-push-1 mobile-2">
        Desktop: 50%, 16% push<br>
        Tablet: 50%, 16% push<br>
        Mobile: 66%, no push
    </div>
</div>

<p>For large, medium and small!</p>

<div class="grid example-grid">
    <div class="col large-4 medium-3 small-2">
        Large: 33%<br>
        Medium: 37%<br>
        Small: 33%
    </div>
    <div class="col large-6 large-push-2 medium-4 medium-push-1 small-3 small-push-1">
        Large: 50%, 16% push<br>
        Medium: 50%, 12% push<br>
        Small: 50%, 16%
    </div>
</div>

<p>Test the global push pull with the device overrides.</p>

<div class="grid example-grid">
    <div class="col span-4 desktop-5 desktop-push-1">
        Global: 33%<br>
        Desktop: 41%, 8% push
    </div>
    <div class="col span-7 push-1 desktop-5">
        Global: 58%, 8% push<br>
        Desktop: 41%
    </div>
</div>

<div class="example-title">Ending</div>

<div class="grid example-grid">
    <div class="col large-5 medium-3 small-2">Left</div>
    <div class="col large-5 medium-3 small-2 end">Right</div>
</div>