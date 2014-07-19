require "sinatra"
require "sinatra/reloader" if development?
require "slim"
require "./models.rb"
require "json"

configure :development do
  set :bind, '0.0.0.0'
  set :port, 3000
  set :chars, Chars.new
end


get "/" do
    slim :main
end

get "/char_json/:id" do
    char = settings.chars.find(params[:id])
    if char
        content_type :json
        char[:json]
    else
        slim :nothing
    end
end

post "/char_json" do
    dat = params[:data]
    char = Char.new
    char.json = JSON.parse(dat)
    if char.save then "true" else 'false' end
end