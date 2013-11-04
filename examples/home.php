<div class="example-header">
    <a href="https://github.com/titon/toolkit" class="button float-right is-info round" style="font-size: 16px">
        View On GitHub
    </a>

    Titon Toolkit v<?php echo file_get_contents('../version.md'); ?>
</div>

<div class="grid">
    <div class="col desktop-3 tablet-3">
        <div class="intro">
            <h4>What is Toolkit?</h4>

            <p>Toolkit is a collection of very powerful user-interface components and utility classes.
            Each component represents encapsulated HTML, CSS and JS (either MooTools or jQuery) functionality for role specific page elements.</p>

            <p>Titon makes use of the latest and greatest technology. This includes CSS3 for animation,
            Sass for CSS pre-processing, and Grunt for task and package management.</p>
        </div>

        <div class="intro">
            <h4>What are Toolkit's key features?</h4>

            <p>Toolkit was designed with the following patterns and ideology in mind.</p>

            <ul>
                <li><a href="http://www.abookapart.com/products/mobile-first">Mobile first design philosophy</a></li>
                <li><a href="http://en.wikipedia.org/wiki/Progressive_enhancement">Progressive enhancement</a> and graceful degradation</li>
                <li><a href="http://milesj.me/blog/read/responsive-cascading-inheritance">Cascading CSS inheritance</a></li>
                <li>Modularity pattern</li>
                <li>Configuration over convention</li>
                <li>Fluid over fixed</li>
                <li>Responsive integration for all components</li>
                <li>Scaling with <var>em</var> and <var>rem</var> only</li>
                <li>Animations purely with CSS</li>
            </ul>
        </div>
    </div>

    <div class="col desktop-3 tablet-3">
        <div class="intro">
            <h4>How is Toolkit different than Bootstrap or Foundation?</h4>

            <p>In essence, they are all very similar. They all provide a base framework to implement front-end functionality quickly and efficiently.</p>

            <p>What separates Toolkit apart from the others is its extensibility. Toolkit was engineered to be used as the groundwork for a project, <b>not</b> to be tacked on for random functionality, and <b>not</b> to be used for throwing up quick websites (that all look a like).
            Because of this mindset, the base CSS does not provide advanced styles beyond the basics, like padding, margin, display and positioning (you can see this in action by using no theme below). Any custom colors, backgrounds, shadows, aesthetics in general, should be implemented by you, the developer, by extending the base Toolkit CSS styles.</p>

            <p>On the JavaScript side, Toolkit supports both jQuery and MooTools, so feel free to use any vendor you wish! All of the JS components were built with modularity and configuration in mind.
            Want to style the elements a certain way? Style away. Want to change the HTML structure of a component? Easy through configuration. Want to interact with the class objects directly? Sure, why not.</p>
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

                foreach (array_chunk($compList, ceil(count($compList) / 2), true) as $comps) { ?>
                    <ul class="col span-6">
                        <?php foreach ($comps as $key => $component) { ?>
                            <li>
                                <a href="?component=<?php echo $key; ?>"><?php echo $component['title']; ?></a>
                            </li>
                        <?php } ?>
                    </ul>
                <?php } ?>
            </div>
        </div>

        <div class="intro">
            <h4>Where can I download Toolkit?</h4>

            <p>You can find the latest compressed and minified files in the <a href="https://github.com/titon/toolkit/tree/master/dist">distribution folder</a> (includes all components).
            Or you can <a href="https://github.com/titon/toolkit/blob/master/docs/CustomBuilds.md">create a custom build using Grunt</a>.
            Or you can install the Ruby gem and <a href="https://github.com/titon/toolkit/blob/master/docs/UsingWithCompass.md">use the Sass files directly with Compass</a>.
            Or you can install <a href="https://github.com/titon/toolkit/blob/master/docs/UsingWithBower.md">through Bower</a>.</p>
        </div>

        <div class="intro">
            <h4>Reserved Classes</h4>

            <p>Toolkit reserves global classes that are used for state. These classes <b>should not</b> have default styling and should be implemented per component. States begin with is- or has- so no conflicts occur.</p>

            <p>The following state classes are available: is-error, is-warning, is-success, is-info, is-active, is-disabled, is-required, is-dragging, is-draggable, is-open, is-loading, has-failed, has-children</p>

            <p>Some other global classes are reserved such as: small, medium, large, round, pill, oval, skew</p>
        </div>
    </div>
</div>