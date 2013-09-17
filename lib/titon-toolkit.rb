require 'compass'

root = File.join(File.dirname(__FILE__), "..")

Compass::Frameworks.register("toolkit",
    :path => root,
    :stylesheets_directory => File.join(root, "scss")
)

module TitonToolkit
end