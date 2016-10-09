#!/usr/bin/env ruby

require 'json'

name = ARGV[0]
rows = ARGV[1].to_i(10)
columns = ARGV[2].to_i(10)

# 1 space for labels, one space to move it from being cut off by the
# top-edge of the plate. Same goes for the y-axis (with the left edge).
plate_x_origin = 2
plate_y_origin = 2

grid_width = columns + plate_x_origin
grid_height = rows + plate_y_origin

# row IDs are A..Z, columns are 1..n
row_ids = (1..rows).map { |row| (((row - 1) % 26) + 65).chr }
column_ids = (1..columns).map { |col| col.to_s }

row_data = row_ids.each_with_index.map { |id, i| { id: id, y: i + plate_y_origin } }
column_data = column_ids.each_with_index.map { |id, i| { id: id, x: i + plate_x_origin } }

wells = row_data.product(column_data).map do |row, col|
  { id: row[:id] + col[:id], x: col[:x], y: row[:y] }
end

row_labels = wells.group_by { |well| well[:y] }.map do |y, rows|
  { x: 1, y: y, label: y, selects: rows.map { |row| row[:id] } }
end

column_labels = wells.group_by { |well| well[:x] }.map do |x, cols|
  { x: x, y: 1, label: x, selects: cols.map { |col| col[:id] } }
end

entire_object = {
  name: name,
  gridWidth: grid_width,
  gridHeight: grid_height,
  selectors: [],
  wells: wells,
  selectors: row_labels + column_labels
}

puts JSON.pretty_generate(entire_object)
