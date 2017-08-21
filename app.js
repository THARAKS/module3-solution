(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController )
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);


function FoundItemsDirective() {
 var ddo = {
   templateUrl: 'foundList.html',
   scope: {
     items: '<',
     onRemove: '&'
   },
   controller: FoundItemsDirectiveListDirectiveController,
   controllerAs: 'list',
   bindToController: true
 };

 return ddo;
}

function FoundItemsDirectiveListDirectiveController() {
  var list = this;


}
  var items =[];
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var list = this;
list.getItems=function(itemDesc)
  {
  var description=itemDesc;
  var promise = MenuSearchService.getMatchedMenuItems();
  promise.then(function (response) {
  var foundItems = response.data;
  angular.forEach(foundItems.menu_items, function (item, idx) {
    if (item.description.indexOf(description)!== -1)
    {
      list.flag=true;
      items.push(item);
      list.items=items;
      console.log("matched items",list.items);
    }
    if(list.flag)
    {
      list.show=false;
    }
    else{
        list.show=true;
    }

  });
})
  .catch(function (error) {
    console.log("Something went terribly wrong.");
  });


}
list.removeItem = function (itemIndex) {
    console.log("'this' is: ", this);
    MenuSearchService.removeItem(itemIndex);
  };
}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
  var service = this;
  service.getMatchedMenuItems = function () {
    var response = $http({
      method: "GET",
      url: "https:davids-restaurant.herokuapp.com/menu_items.json",
    });
    return response;
  };
  service.removeItem = function (itemIndex) {
    items.splice(itemIndex, 1);
  };
}

})();
