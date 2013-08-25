<div class="example-header">Grid &amp; Responsive</div>

<div class="example">
	<p>Examples of a 12 column grid system (desktop only). Inherits styles for test examples.</p>

	<div class="grid grid-test">
		<div class="col desktop-1">1</div>
		<div class="col desktop-1">1</div>
		<div class="col desktop-1">1</div>
		<div class="col desktop-1">1</div>
		<div class="col desktop-1">1</div>
		<div class="col desktop-1">1</div>
		<div class="col desktop-1">1</div>
		<div class="col desktop-1">1</div>
		<div class="col desktop-1">1</div>
		<div class="col desktop-1">1</div>
		<div class="col desktop-1">1</div>
		<div class="col desktop-1">1</div>
	</div>

	<div class="grid grid-test">
		<div class="col desktop-2">2</div>
		<div class="col desktop-2">2</div>
		<div class="col desktop-2">2</div>
		<div class="col desktop-2">2</div>
		<div class="col desktop-2">2</div>
		<div class="col desktop-2">2</div>
	</div>

	<div class="grid grid-test">
		<div class="col desktop-3">3</div>
		<div class="col desktop-3">3</div>
		<div class="col desktop-3">3</div>
		<div class="col desktop-3">3</div>
	</div>

	<div class="grid grid-test">
		<div class="col desktop-4">4</div>
		<div class="col desktop-4">4</div>
		<div class="col desktop-4">4</div>
	</div>

	<div class="grid grid-test">
		<div class="col desktop-5">5</div>
		<div class="col desktop-2">2</div>
		<div class="col desktop-5">5</div>
	</div>

	<div class="grid grid-test">
		<div class="col desktop-6">6</div>
		<div class="col desktop-6">6</div>
	</div>

	<div class="grid grid-test">
		<div class="col desktop-7">7</div>
		<div class="col desktop-5">5</div>
	</div>

	<div class="grid grid-test">
		<div class="col desktop-8">8</div>
		<div class="col desktop-4">4</div>
	</div>

	<div class="grid grid-test">
		<div class="col desktop-9">9</div>
		<div class="col desktop-3">3</div>
	</div>

	<div class="grid grid-test">
		<div class="col desktop-10">10</div>
		<div class="col desktop-2">2</div>
	</div>

	<div class="grid grid-test">
		<div class="col desktop-11">11</div>
		<div class="col desktop-1">1</div>
	</div>

	<div class="grid grid-test">
		<div class="col desktop-12">12</div>
	</div>
</div>

<div class="example">
	<div class="example-title">Responsive Grid</div>

	<p>Different column sizes for mobile (3), tablet (6) and desktop (12).</p>

	<div class="grid grid-test">
		<div class="col desktop-3 tablet-2 mobile-1">
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

	<p>The columns should stay the same percentage in all sizes.</p>

	<div class="grid grid-test">
		<div class="col span-2">16%</div>
		<div class="col span-8">66%</div>
		<div class="col span-2">16%</div>
	</div>
</div>

<div class="example">
	<div class="example-title">Nesting</div>

	<div class="grid grid-test">
		<div class="col desktop-6">
			Lorem ipsum dolor sit amet.
			<div class="grid grid-test">
				<div class="col desktop-4">4</div>
				<div class="col desktop-4">4</div>
				<div class="col desktop-4">4</div>
			</div>
			Lorem ipsum dolor sit amet.
		</div>
		<div class="col desktop-6">
			Lorem ipsum dolor sit amet.
			<div class="grid grid-test">
				<div class="col desktop-7">7</div>
				<div class="col desktop-5">5</div>
			</div>
			Lorem ipsum dolor sit amet.
		</div>
	</div>
</div>

<div class="example">
	<div class="example-title">Push, Pull</div>

	<div class="grid grid-test">
		<div class="col desktop-4">4</div>
		<div class="col desktop-4 desktop-push-4">4</div>
	</div>
	<div class="grid grid-test">
		<div class="col desktop-6">6</div>
		<div class="col desktop-1 desktop-pull-1">1</div>
	</div>
	<div class="grid grid-test">
		<div class="col desktop-3">3</div>
		<div class="col desktop-8 desktop-push-1">8</div>
	</div>
	<div class="grid grid-test">
		<div class="col desktop-9 desktop-push-3">9 (first)</div>
		<div class="col desktop-3 desktop-pull-9">3 (second)</div>
	</div>
	<div class="grid grid-test">
		<div class="col desktop-7 desktop-push-3">7</div>
	</div>

	<p>For desktop, tablet and mobile!</p>

	<div class="grid grid-test">
		<div class="col desktop-4 tablet-2 mobile-1">
			Desktop: 33%<br>
			Tablet: 33%<br>
			Mobile: 33%
		</div>
		<div class="col desktop-6 desktop-push-2 tablet-3 tablet-push-1 mobile-2">
			Desktop: 50%, 16% push<br>
			Tablet: 50%, 16% push<br>
			Mobile: 33%, no push<br>
		</div>
	</div>

	<p>Test the global push pull with the device overrides.</p>

	<div class="grid grid-test">
		<div class="col span-4 desktop-5 desktop-push-1">
			Global: 33%<br>
			Desktop: 41%, 8% push
		</div>
		<div class="col span-7 push-1 desktop-5">
			Global: 58%, 8% push<br>
			Desktop: 41%
		</div>
	</div>
</div>

<div class="example">
	<div class="example-title">Responsive</div>

	<div class="grid grid-test">
		<div class="col desktop-4 show-mobile" style="color: red">Visible in mobile</div>
		<div class="col desktop-4 show-tablet" style="color: blue">Visible in tablets</div>
		<div class="col desktop-4 show-desktop" style="color: green">Visible in desktops</div>
	</div>

	<div class="grid grid-test">
		<div class="col desktop-4 hide-mobile" style="color: red">Hidden in mobile</div>
		<div class="col desktop-4 hide-tablet" style="color: blue">Hidden in tablets</div>
		<div class="col desktop-4 hide-desktop" style="color: green">Hidden in desktops</div>
	</div>

	<div class="grid grid-test">
		<div class="col desktop-4 hide-landscape" style="color: red">Hidden in landscape</div>
		<div class="col desktop-4 hide-portrait" style="color: blue">Hidden in portrait</div>
		<div class="col desktop-4 show-landscape" style="color: red">Visible in landscape</div>
		<div class="col desktop-4 show-portrait" style="color: blue">Visible in portrait</div>
	</div>
</div>