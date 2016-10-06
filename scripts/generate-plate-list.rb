require 'json'
require 'pathname'

plate_folder = File.expand_path "../../src/plates", __FILE__
json_file_wildcard = File.join(plate_folder, "*.json")
plate_files = Dir.glob(json_file_wildcard)

plates = plate_files.map do |path|
  file_content = File.read path
  plate_details = JSON.parse file_content

  { name: plate_details["name"], path: "plates/#{File.basename path}" }
end

puts JSON.pretty_generate(plates)
