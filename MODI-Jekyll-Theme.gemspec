# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "MODI-Jekyll-Theme"
  spec.version       = "0.1.0"
  spec.authors       = ["Thomas Nagel"]
  spec.email         = ["tmj.nagel@gmail.com"]

  spec.summary       = "This Jekyll Theme is property of TU/e"
  spec.homepage      = "https://github.com/modi-data/MODI-Jekyll-Theme"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets|_data|_layouts|_includes|_sass|LICENSE|README|_config\.yml)!i) }

  spec.add_runtime_dependency "jekyll", "~> 4.3"
end
