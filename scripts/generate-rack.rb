#!/usr/bin/env ruby

require 'json'

name = ARGV[0]
rows = ARGV[1].to_i(10)
columns = ARGV[2].to_i(10)

grid_width = columns + 2
grid_height = rows + 2

wells = 
  (1..rows).map do |row|
  row_id = (((row - 1) % 26) + 65).chr
  (1..columns).map do |column|
    column_id = column.to_s
    { x: column, y: row, id: row_id + column_id }
  end
  end.flatten

entire_object = {
  name: name,
  gridWidth: grid_width,
  gridHeight: grid_height,
  selectors: [],
  wells: wells
}

puts JSON.pretty_generate(entire_object)
