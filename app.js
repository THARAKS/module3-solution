(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController )
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
 .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");


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
  function isEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? false : true;
}
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var list = this;
  var isItemNotFound=false;
list.getItems=function(itemDesc)
  {
   list.display=false;
  var description=isEmpty(itemDesc)


//  console.log("length",itemDesc.length );
  var promise = MenuSearchService.getMatchedMenuItems();
  promise.then(function (response) {
  var foundItems = response.data;
  angular.forEach(foundItems.menu_items, function (item, idx) {
    if (item.description.indexOf(itemDesc)!== -1 && description )
    {
    list.display=true;
      items.push(item);
      list.items=items;
      console.log("matched items",list.items);
    }


  });
if(!list.display || !description)
{
  list.show=true;
  list.display=false;
}
else{
  list.show=false;
  list.display=true;

}

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

MenuSearchService.$inject = ['$http','ApiBasePath'];
function MenuSearchService($http,ApiBasePath) {
  var service = this;
  service.getMatchedMenuItems = function () {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json"),
      headers: { 'Cache-Control' : 'no-cache' }
    });
    return response;
  };
  service.removeItem = function (itemIndex) {
    items.splice(itemIndex, 1);
  };

}

})();
