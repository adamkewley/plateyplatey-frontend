#!/usr/bin/env ruby

number_of_points = 16
grid_width = 25
grid_height = 25
radius = 8
angular_step = (Math::PI * 2) / number_of_points
starting_x = 0
starting_y = radius

coordinates = (1..number_of_points).map do |i|
  angle_of_rotation = i * angular_step

  # Two-dimensional rotation matrix about the origin
  x = (starting_x * Math.cos(angle_of_rotation)) - 
      (starting_y * Math.sin(angle_of_rotation))

  y = (starting_x * Math.sin(angle_of_rotation)) +
      (starting_y * Math.cos(angle_of_rotation))

  [x, y]
end

# Translate the origin to be in the top-right
translated_coordinates = coordinates.map do |x, y|
  [x + grid_width / 2, y + grid_height / 2]
end

# Round a coordinate near to its integer
rounded_coordinates = translated_coordinates.map do |x, y|
  [x.round, y.round]
end

well_json = rounded_coordinates.each_with_index.map do |coord, i|
  %|{ "x": #{coord.first}, "y": #{coord[1]}, "id": "#{i}" }|
end

all_json = %|
{
  "gridWidth": #{grid_width},
  "gridHeight": #{grid_height},
  "selectors": [],
  "wells": [
    #{well_json.join(",\n")}
  ]
}|

puts all_json
  
