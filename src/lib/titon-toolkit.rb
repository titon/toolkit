require 'compass'

root = File.join(File.dirname(__FILE__), "..")

Compass::Frameworks.register("toolkit",
    :stylesheets_directory => File.join(root, "scss"),
    :templates_directory => File.join(root, "templates")
)