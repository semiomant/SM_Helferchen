require "sequel"

db = Sequel.sqlite("./splimo.sqlite")

db.create_table :chars do
    primary_key :id
    Text :json
end