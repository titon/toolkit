require 'compass'

root = File.join(File.dirname(__FILE__), "..")

if defined?(Compass)
	Compass::Frameworks.register("toolkit",
		:path => root,
		:stylesheets_directory => File.join(root, "scss"),
		:templates_directory => File.join(root, "templates")
	)
end