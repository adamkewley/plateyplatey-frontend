require 'json'
require 'pathname'

plate_files = ARGV

plates = plate_files.map do |path|
  file_content = File.read path
  plate_details = JSON.parse file_content

  { name: plate_details["name"], path: "plates/#{File.basename path}" }
end

puts JSON.pretty_generate(plates)
