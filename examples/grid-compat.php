<div class="example-header">Grid &amp; Responsive (Compatibility)</div>

<div class="example">
	<p>Examples of a 12 column grid system. Inherits styles for test examples.</p>

	<div class="grid grid-test">
		<div class="col-1">1</div>
		<div class="col-1">1</div>
		<div class="col-1">1</div>
		<div class="col-1">1</div>
		<div class="col-1">1</div>
		<div class="col-1">1</div>
		<div class="col-1">1</div>
		<div class="col-1">1</div>
		<div class="col-1">1</div>
		<div class="col-1">1</div>
		<div class="col-1">1</div>
		<div class="col-1">1</div>
	</div>

	<div class="grid grid-test">
		<div class="col-2">2</div>
		<div class="col-2">2</div>
		<div class="col-2">2</div>
		<div class="col-2">2</div>
		<div class="col-2">2</div>
		<div class="col-2">2</div>
	</div>

	<div class="grid grid-test">
		<div class="col-3">3</div>
		<div class="col-3">3</div>
		<div class="col-3">3</div>
		<div class="col-3">3</div>
	</div>

	<div class="grid grid-test">
		<div class="col-4">4</div>
		<div class="col-4">4</div>
		<div class="col-4">4</div>
	</div>

	<div class="grid grid-test">
		<div class="col-5">5</div>
		<div class="col-2">2</div>
		<div class="col-5">5</div>
	</div>

	<div class="grid grid-test">
		<div class="col-6">6</div>
		<div class="col-6">6</div>
	</div>

	<div class="grid grid-test">
		<div class="col-7">7</div>
		<div class="col-5">5</div>
	</div>

	<div class="grid grid-test">
		<div class="col-8">8</div>
		<div class="col-4">4</div>
	</div>

	<div class="grid grid-test">
		<div class="col-9">9</div>
		<div class="col-3">3</div>
	</div>

	<div class="grid grid-test">
		<div class="col-10">10</div>
		<div class="col-2">2</div>
	</div>

	<div class="grid grid-test">
		<div class="col-11">11</div>
		<div class="col-1">1</div>
	</div>

	<div class="grid grid-test">
		<div class="col-12">12</div>
	</div>
</div>

<div class="example">
	<div class="example-title">Nesting</div>

	<div class="grid grid-test">
		<div class="col-6">
			Lorem ipsum dolor sit amet.
			<div class="grid grid-test">
				<div class="col-4">4</div>
				<div class="col-4">4</div>
				<div class="col-4">4</div>
			</div>
			Lorem ipsum dolor sit amet.
		</div>
		<div class="col-6">
			Lorem ipsum dolor sit amet.
			<div class="grid grid-test">
				<div class="col-7">7</div>
				<div class="col-5">5</div>
			</div>
			Lorem ipsum dolor sit amet.
		</div>
	</div>
</div>

<div class="example">
	<div class="example-title">Push, Pull</div>

	<div class="grid grid-test">
		<div class="col-4">4</div>
		<div class="col-4 push-4">4</div>
	</div>
	<div class="grid grid-test">
		<div class="col-6">6</div>
		<div class="col-1 pull-1">1</div>
	</div>
	<div class="grid grid-test">
		<div class="col-3">3</div>
		<div class="col-8 push-1">8</div>
	</div>
	<div class="grid grid-test">
		<div class="col-9 push-3">9 (first)</div>
		<div class="col-3 pull-9">3 (second)</div>
	</div>
	<div class="grid grid-test">
		<div class="col-7 push-3">7</div>
	</div>
</div>

<div class="example">
	<div class="example-title">Responsive</div>

	<div class="grid grid-test">
		<div class="col-4 visible-mobile" style="color: red">Visible in mobile</div>
		<div class="col-4 visible-tablet" style="color: blue">Visible in tablets</div>
		<div class="col-4 visible-desktop" style="color: green">Visible in desktops</div>
	</div>

	<div class="grid grid-test">
		<div class="col-4 hidden-mobile" style="color: red">Hidden in mobile</div>
		<div class="col-4 hidden-tablet" style="color: blue">Hidden in tablets</div>
		<div class="col-4 hidden-desktop" style="color: green">Hidden in desktops</div>
	</div>
</div>