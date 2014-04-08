<div class="example-header">
    <a href="https://github.com/titon/toolkit" class="button float-right is-info round" style="font-size: 16px">
        View GitHub
    </a>

    <a href="http://titon.io" class="button float-right is-info round" style="font-size: 16px; margin-right: 10px;">
        View Website
    </a>

    Titon Toolkit v<?php echo file_get_contents('../version.md'); ?>
</div>

<div class="grid">
    <div class="col desktop-6 tablet-6">
        <div class="intro">
            <h4>Where can I download Toolkit?</h4>

            <p>You can find the latest compressed and minified files in the <a href="https://github.com/titon/toolkit/tree/master/dist">distribution folder</a> (includes all components).
                Or you can <a href="https://github.com/titon/toolkit/blob/master/docs/en/setup/custom-builds.md">create a custom build using Grunt</a>.
                Or you can install the Ruby gem and <a href="https://github.com/titon/toolkit/blob/master/docs/en/setup/installing.md#sass--compass-integration">use the Sass files directly with Compass</a>.
                Or you can install <a href="https://github.com/titon/toolkit/blob/master/docs/en/setup/installing.md#bower-dependency">through Bower</a>.</p>
        </div>

        <div class="intro">
            <h4>Have a question or issue report?</h4>

            <p>I would love to get any feedback, so please email me through my personal website or open an issue on the GitHub repository!</p>
        </div>
    </div>

    <div class="col desktop-6 tablet-6">
        <div class="intro">
            <h3>Available Components</h3>

            <div class="grid">
                <?php
                $compList = $components;
                unset($compList['home']);

                foreach (array_chunk($compList, ceil(count($compList) / 3), true) as $comps) { ?>
                    <ul class="col medium-4 large-4">
                        <?php foreach ($comps as $key => $component) { ?>
                            <li>
                                <a href="?component=<?php echo $key; ?>"><?php echo $component['title']; ?></a>
                            </li>
                        <?php } ?>
                    </ul>
                <?php } ?>
            </div>
        </div>
    </div>
</div>