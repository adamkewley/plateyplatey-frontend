use Rack::Static,
    :root => "bin"

map "/" do
  use Rack::Static,
      :urls => [""], :root => File.expand_path("bin"), :index => 'index.html'
  run lambda {|*|}
end
