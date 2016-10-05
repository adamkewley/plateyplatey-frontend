#!/usr/bin/env ruby

rows = ARGV[0].to_i(10)
columns = ARGV[1].to_i(10)

grid_width = columns + 2
grid_height = rows + 2

row_array = (1..rows).map { |i| i + 1 }
column_array = (1..columns).map { |i| i + 1 }

puts row_array
