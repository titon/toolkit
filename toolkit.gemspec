Gem::Specification.new do |gem|
    gem.name = "titon-toolkit"
    gem.version = "1.5.2"

    # Info
    gem.authors = ["Project Titon", "Miles Johnson"]
    gem.description = "A collection of extensible front-end UI components for the responsive and mobile web."
    gem.summary = "Provides Titon Toolkit Sass files for use in projects."
    gem.homepage = "http://titon.io"
    gem.license = "BSD-3"

    # Files
    gem.files = ["lib/titon-toolkit.rb"]
    gem.files += Dir.glob("scss/**/*")
    gem.files += Dir.glob("*.md")

    # Dependencies
    gem.add_dependency("sass", [">= 3.3.0"])
    gem.add_dependency("compass", [">= 0.12"])
end