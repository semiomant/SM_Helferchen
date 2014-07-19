require "json"
require "sequel"

DB = Sequel.sqlite("splimo.sqlite")

class Char < Sequel::Model

    def initialize str=false
        super()
        if str then self[:json] = str end
    end

    def json= hsh
        str = hsh.to_json
        self[:json] = str
        self
    end

    def json
        JSON.parse self[:json]
    end
end

class Chars

    def initialize
        @list = DB.from(:chars)
    end

    def find id
        char =  @list[id:id]
        if char then Char.new char[:json] end
    end

end



