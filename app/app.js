var myApp = angular.module("myApp", ["ngRoute", "ngCookies"]);

myApp.run(($rootScope, $location) => {
  const searchObject = $location.$$absUrl.split("?");
  if (searchObject.length === 2) {
    const parameters = searchObject[1].split("&");
    const nameParts = parameters[0].split("=")[1];
    $rootScope.productName = nameParts;

    if (nameParts.split("%20").length > 1) {
      let name = "";
      let parts = nameParts.split("%20");
      parts.forEach((i) => {
        name += i;
        name += " ";
      });

      $rootScope.productName = name;
    }

    $rootScope.image =
      "/imgs/partsImg/img" + parameters[2].split("=")[1] + ".jpg";
    $rootScope.productPrice = parameters[1].split("=")[1];
  }
});

myApp.controller(
  "HomeController",
  ($scope, $window, $location, $http, $cookies) => {
    $scope.parts = async () => {
      var myCookieValue = await $cookies.get("token");

      console.log(myCookieValue);
      if (myCookieValue === "") {
        $window.location.href = "/signin";
      } else {
        $window.location.href = "/parts";
      }
    };

    $scope.signin = () => {
      $window.location.href = "/signin";
    };

    $scope.signup = () => {
      $window.location.href = "/signup";
    };
  }
);

myApp.controller("SignupController", ($scope, $http, $window, $location) => {
  $scope.sendPost = async () => {
    var postData = {
      email: $scope.email,
      password: $scope.password,
    };

    var data = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    var user = await data.json();

    if (data.status !== false) {
      $window.location.href = "/signin";
    }
    // else
    // {
    // }
  };
});

myApp.controller(
  "SigninController",
  ($scope, $http, $window, $location, $cookies) => {
    $scope.getCred = async () => {
      var data = {
        email: $scope.email,
        password: $scope.password,
      };

      var res = await fetch("/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      var user = await res.json();
      // console.log(user);

      if (res.status === 200) {
        $window.location.href = "/parts";
      } else {
        $window.location.href = "/signup";
      }
    };
  }
);

myApp.controller(
  "PartsController",
  async ($rootScope, $scope, $http, $cookies, $window, $location) => {


    $scope.load = false;
    $scope.x = [];
    $scope.y = 0;
    $scope.total = 0;


    $scope.parts = () => {
      $window.location.href = "/parts";
    };



    $scope.details = (x1, y1, no) => {
      $window.location.href =
        "/productpage?title=" + x1 + "&name=" + y1 + "&imgNo=" + no;
    };



    $scope.getDetails = async () => {
      var res = await fetch("/cart", {
        method: "POST",
      });
      var user = await res.json();

      $scope.load = true;
      $scope.x = user.userCart;
      $scope.y = $scope.x.length;

      const button = document.getElementById("myButton");
      button.click();
      button.addEventListener("click", function () {
        button.disabled = true;
      });
      
      for (let i = 0; i < $scope.x.length; i++) {
        $scope.total += $scope.x[i].price;
      }
      button.addEventListener("click", function () {
        button.disabled = false;
      });
      button.click();
      button.addEventListener("click", function () {
        button.disabled = true;
      });

    }


    $window.onload = $scope.getDetails;



    $scope.goToCart = () => {
      $window.location.href = "/cart";
    };



    $scope.addToCart = async () => {
      $scope.name = $rootScope.productName;
      $scope.quantity;
      $scope.price = $scope.quantity * $rootScope.productPrice;

      var data = {
        name: $scope.name,
        qty: $scope.quantity,
        price: $scope.quantity * $rootScope.productPrice,
      };
      var res = await fetch("/parts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      var user = await res.json();

      // userCart = user.userCart;
      // numOfItems = userCart.length;

      if (res.status === 200) {
        $window.location.href = "/parts";
      } else {
      }
    };



    $scope.removeItem = async (i) => {

      var res = await fetch("/cart", {
        method: "POST",
      });
      var user = await res.json();
      var userCart = user.userCart;
      // console.log(user);
      const objToRemove = {name:i.name, qty:i.qty, price:i.price};
      const indexToRemove = userCart.findIndex(obj => obj.name === objToRemove.name);
      // console.log(userCart);
      var res = await fetch("/changeCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({index:indexToRemove}),
      });
      var user = await res.json();
      // console.log(user.userCart);
      const button = document.getElementById("myButton");
      button.addEventListener("click", function () {
        button.disabled = false;
      });
      button.click();
      button.addEventListener("click", function () {
        button.disabled = true;
      });

      $scope.load = true;
      $scope.x = user.userCart;
      $scope.y = $scope.x.length;
      $scope.total = user.total;
      
      
      if (res.status === 200) {
        console.log($scope.x)
        console.log($scope.y)
        console.log($scope.total)
        $window.location.href = "/cart";
      }
    };




    $scope.logout = async () => {
      var data = await fetch("/logout", {
        method: "POST",
      });

      if (data.status !== false) {
        $window.location.href = "/";
      }
    };

  }
);
