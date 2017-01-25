require 'json'
require 'pathname'

plate_files = ARGV

plates =
  plate_files.map do |path|
    file_content = File.read path
    plate_details = JSON.parse file_content

    filename = File.basename(path)
    file_name_without_extension = filename.sub(/\.[^.]+$/, "")
    plate_id = file_name_without_extension
    
    [plate_id, { name: plate_details["name"], path: "plates/#{filename}" }]
  end.
  reduce({}) do |hash, (plate_id, plate_data)|
    hash[plate_id] = plate_data
    hash
  end  

puts JSON.pretty_generate(plates)
