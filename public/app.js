if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(predicate) {
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        if (i in list) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return value;
          }
        }
      }
      return undefined;
    }
  });
}

function Char($q,$http) {
    this.data = {};
    this.q = $q;
    this.http = $http;
}

Char.prototype.save = function(first_argument) {
    $http.post(); //usw
};

Char.prototype.init = function() {
    this.points = 300;
    this.freeAttr = 2;
    this.attr_changes = [];
    return this;
};


SMHApp = angular.module('SMHApp',[])

SMHApp.run([ '$rootScope', function ($rs) {
    $rs.curr_char = new Char().init();
}]);

SMHApp.controller('RaceCntrl', ['$scope','$q','$http', function ($sc,$q,$http) {
    $sc.getRaceDataPromise = function () {
        var prom = $q.defer()

        $http.get("/rasse.json").then(function (resp) {
            prom.resolve(resp.data);
        });

        return prom.promise;
    };

    $sc.init_RC = function () {
        $sc.getRaceDataPromise().then(function (json) {
            $sc.raceList = json;
        });
    };

    //functional

    $sc.chooseRace = function  (rasse) {
        $sc.curr_char.race = rasse;
    }
}]);

SMHApp.controller('AttrCntrl', [ '$scope','$q','$http', function ($sc,$q,$http) {

    $sc.getAttrDataPromise = function () {
        var prom = $q.defer()
        $http.get("/attr.json").then(function (resp) {  prom.resolve(resp.data); });
        return prom.promise;
    };

    $sc.init_AC = function () {
        $sc.char = new Char($q,$http);
        $sc.getAttrDataPromise().then(function (json) {
            $sc.attr = json;
            $sc.attrNames = $sc.attr.map(function (obj) { return obj.name  });
            $sc.selVal = $sc.attr[6];
            $sc.computeAttr();
        });
    };

    $sc.computeAttr = function () {
        $sc.attrAggrgtn = $sc.attr.map(function(attr) {
            var base_val = 2,
                chng_for_this = $sc.curr_char.attr_changes.filter(function(chng) {return chng.code == attr.code});
            end_val = chng_for_this.reduce(function(acc,chng) {return acc+chng.val}, base_val)
            return {name: attr.name, val: end_val}
         });
    }

    //presenters
    $sc.usedInc = function () {
        return $sc.curr_char.attr_changes.filter(function (chng) { return chng.reason == "freerace" || chng.reson == "create" }).length;
    };

    $sc.freeIncRace = function () {
        if(!$sc.curr_char || !$sc.curr_char.race) return "?";
        var base = $sc.curr_char.race.freeInc,
            used = $sc.curr_char.attr_changes.filter(function (chng) { return chng.reason == "freerace"}).length
        return base - used;
    };

    $sc.freeIncCreate = function () {
        if(!$sc.curr_char) return "?";
        var base = $sc.curr_char.freeAttr,
            used = $sc.curr_char.attr_changes.filter(function (chng) { return chng.reason == "create"}).length
        return base - used;
    };

    $sc.buyInc = function () {
        return $sc.curr_char.attr_changes;
    };

    //functional
    $sc.incCurr = function () {
        var fr = $sc.freeIncRace(),
            fc = $sc.freeIncCreate();
        console.log(fc, fr);
        if ( fr+fc < 1) return;
        console.log('try add');
        add_profile = {val: 1, code: $sc.selVal.code}
        if (fc > 0)
            add_profile.reason = "create";
        else
            add_profile.reason = "freerace";
        $sc.curr_char.attr_changes.push(add_profile);
        $sc.computeAttr();
    };

    $sc.decCurr = function () {


    }

}]);