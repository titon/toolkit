<div class="example-header">Badge</div>

<div class="example">
    <h1>Heading 1 <span class="badge"><?php echo rand(0, 500); ?></span></h1>
    <h2>Heading 2 <span class="badge is-info"><?php echo rand(0, 500); ?></span></h2>
    <h3>Heading 3 <span class="badge is-warning"><?php echo rand(0, 500); ?></span></h3>
    <h4>Heading 4 <span class="badge is-success"><?php echo rand(0, 500); ?></span></h4>
    <h5>Heading 5 <span class="badge is-error"><?php echo rand(0, 500); ?></span></h5>
    <h6>Heading 6 <span class="badge"><?php echo rand(0, 500); ?></span></h6>

    <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <?php foreach ($types as $type => $typeTitle) { ?>
            <span class="badge <?php echo $type; ?>"><?php echo rand(0, 500); ?></span>
        <?php } ?>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </p>
</div>

<div class="example-header">Label</div>

<div class="example">
    <h1>Heading 1 <span class="label label--left">Default</span></h1>
    <h2>Heading 2 <span class="label label--left is-info">Info</span></h2>
    <h3>Heading 3 <span class="label label--left is-warning">Warning</span></h3>
    <h4>Heading 4 <span class="label label--left is-success">Success</span></h4>
    <h5>Heading 5 <span class="label label--left is-error">Error</span></h5>
    <h6>Heading 6 <span class="label label--right">New</span></h6>

    <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <?php foreach ($types as $type => $typeTitle) { ?>
            <span class="label <?php echo $type; ?>"><?php echo $typeTitle; ?></span>
        <?php } ?>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </p>
</div>

<div class="example">
    <div class="example-title">Arrows</div>

    <div class="example-row">
        <?php foreach ($types as $type => $typeTitle) { ?>
            <span class="label label--left <?php echo $type; ?>"><?php echo $typeTitle; ?></span>
        <?php } ?>
    </div>

    <div class="example-row">
        <?php foreach ($types as $type => $typeTitle) { ?>
            <span class="label label--right <?php echo $type; ?>"><?php echo $typeTitle; ?></span>
        <?php } ?>
    </div>
</div>