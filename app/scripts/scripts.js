"use strict";angular.module("KiwiApp",["ngCookies","ngResource","ngSanitize","ngRoute","ui.bootstrap","common.dragdrop","common.confirm","firebase"]).config(["$routeProvider","$locationProvider","$httpProvider",function(a,b,c){a.when("/",{templateUrl:"partials/main",controller:"MainCtrl"}).when("/kiwis",{templateUrl:"partials/kiwis",controller:"KiwisCtrl",authenticate:!0}).when("/profile",{templateUrl:"partials/profile",controller:"ProfileCtrl",authenticate:!0}).when("/groups",{templateUrl:"partials/groups",controller:"GroupCtrl",authenticate:!0}).when("/groups/:fbId/:groupRef",{templateUrl:"partials/public_group",controller:"PublicGroupCtrl"}).when("/special",{templateUrl:"partials/special",controller:"SpecialCtrl"}).otherwise({redirectTo:"/"}),b.html5Mode(!0),c.interceptors.push(["$q","$location",function(a,b){return{responseError:function(c){return 401===c.status?(b.path("/login"),a.reject(c)):a.reject(c)}}}])}]).run(["$rootScope","$location","Auth","$cookies",function(a,b,c,d){a.Firebase=Firebase;var e=new a.Firebase("https://kiwidb.firebaseio.com/");a.auth=new FirebaseSimpleLogin(e,function(b,c){b?console.log("Error with login. Error:, ",b):c&&a.$apply(function(){a.currentUser=c,d.kiwiSpecial=c.firebaseAuthToken,d.kiwiUid=c.uid})}),a.$on("$routeChangeStart",function(a,d){d.authenticate&&!c.isLoggedIn()&&b.path("/")})}]),angular.module("KiwiApp").controller("NavbarCtrl",["$scope","$rootScope","$location","Auth","$q","$http","$firebase",function(a,b,c,d,e,f){a.menu=[{title:"Home",link:"/"},{title:"Settings",link:"/settings"}],a.login=function(){d.login(function(c){b.currentUser=c,a.getCreds(c),$cookies.kiwiSpecial=c.firebaseAuthToken,$cookies.kiwiUid=c.uid})},a.logout=function(){d.logout()},a.getCreds=function(a){f({method:"POST",url:"/api/createUser",data:a}).success(function(){console.log("sent to server")})},a.isActive=function(a){return a===c.path()}}]),angular.module("KiwiApp").controller("ProfileCtrl",["$scope","$rootScope","Profile",function(a,b,c){var d=function(){c.getSettings(function(c){var d=b.currentUser.thirdPartyUserData.email;a.settings=c||{},a.settings.email=d})};a.msg="",a.update=function(){var b=a.settings.email.match(/\@/),c=a.settings.email.match(/\./),d=a.settings.email.lastIndexOf(".");return!c||d<b.index?void(a.msg="Please enter a valid email."):void(a.profileForm.$valid&&a._db.set(a.settings,function(b){a.$apply(b?function(){a.msg="Error saving data."}:function(){a.msg="Your changes have been saved."})}))},d()}]),angular.module("KiwiApp").controller("GroupCtrl",["$scope","$rootScope","alerter","Group","Kiwi",function(a,b,c,d,e){var f=4,g=function(){a.fixed="",a.isLoading=!0,a.predicate="date",e.getKiwis(function(b){a.kiwis=b,d.getGroups(a.kiwis,function(b){a.groups=b,a.isLoading=!1})}),jQuery(document).scroll(function(){a.$apply(jQuery("body").scrollTop()>470?function(){a.fixed="sidebar-fixed"}:function(){a.fixed=""})})};a.editing=function(a){a.editing=!0},a.changeFocus=function(a){a.editing=!1},a.removeFromGroup=function(a,c){var d=a.kiwis.indexOf(c),e=a.kiwiHashes.indexOf(c.hash);d>-1&&e>-1&&(Array.prototype.splice.call(a.kiwis,d,1),Array.prototype.splice.call(a.kiwiHashes,e,1),b.$broadcast("updateCustom"))},a.save=function(a){var b={};b.name=a.name,b.kiwiHashes=a.kiwiHashes||[],b.description=a.description||"",b.isPublic=a.isPublic,d.save(b,a.groupHash,function(){c.alert("Your graph has been saved! :)")})},a.createGroup=function(){var b={name:a.groupName,isPublic:!1,kiwis:[],kiwiHashes:[]};a.groups.push(b),$(".input").val("")},a.updateGroup=function(a,d,e,g){a.kiwiHashes.length===f?c.alert("Maximum "+f+" Kiwis per group."):_.contains(a.kiwiHashes,g.hash)?c.alert("That Kiwi is already part of that group."):(a.kiwiHashes.push(g.hash),a.kiwis.push(g),b.$broadcast("updateCustom"))},Array.prototype.clean=function(a){for(var b=0;b<this.length;b++)this[b]==a&&(this.splice(b,1),b--);return this},g()}]),angular.module("KiwiApp").controller("KiwisCtrl",["$scope","$rootScope","alerter","Kiwi","Group",function(a,b,c,d,e){var f=function(){a.isLoading=!0,a.predicate="date",d.getKiwis(function(b){_.each(b,function(a){_.each(a.values,function(a){a.date=Date.parse(a.date)})}),a.kiwis=b,a.isLoading=!1})};a.editing=function(a){a.editing=!0},a.edit=function(a){d.editTitle(a,function(){a.editing=!1,c.alert("Your kiwi has been saved! :)")})},a.changeFocus=function(a){a.editing=!1},a.delete=function(b){d.deleteKiwi(b,function(){delete a.kiwis[b.hash],e.getAll(function(a){_.each(a,function(a){_.contains(a.kiwiHashes,b.hash)&&e.deleteHashFromGroup(a,b.hash,function(){c.alert("Your kiwi has been deleted :(")})})})})},f()}]),angular.module("KiwiApp").controller("SpecialCtrl",["$scope","$http","$cookies","$firebase","$firebaseSimpleLogin",function(a,b){new Firebase("https://kiwidb.firebaseio.com/");a.doStuff=function(){var c=new Firebase("https://kiwidb.firebaseio.com/"),d=new FirebaseSimpleLogin(c,function(c,d){c?console.log("Error:, ",c):d&&d.uid&&(document.cookie="kiwiSpecial="+d.firebaseAuthToken+"; expires=Fri, 3 Aug 2014 20:47:11 UTC; path=/",document.cookie="kiwiUid="+d.uid+"; expires=Fri, 3 Aug 2014 20:47:11 UTC; path=/",a.message="You have been successfully logged in!",b({method:"POST",url:"/api/createUser",data:d}).success(function(){console.log("sent to server")}),setTimeout(function(){open(location,"_self").close()},5e3))});d.login("facebook",{rememberMe:!0})}}]),angular.module("KiwiApp").controller("PublicGroupCtrl",["$scope","$http","$routeParams","$location","$rootScope","NumberParser",function(a,b,c,d,e,f){a.isLoading=!0,a.group={},a.user=e.currentUser;var g=function(a){return Object.keys(a).map(function(b){return a[b]})},h=function(a){a.values=g(a.values);var b=a.values.shift(),c=new f(b,a.values);return c.isNumerical()?c.parseAll():_.pluck(a.values,"value")};b({method:"GET",url:"/api/groups/"+c.fbId+"/"+c.groupRef}).success(function(b){_.each(b.kiwis,function(a){a.values=h(a),a.values=_.map(a.values,function(a){return{date:a.date,value:a.value}})}),a.group=b,a.isLoading=!1}).error(function(){d.path("/")})}]),angular.module("KiwiApp").directive("multiYaxisGraph",function(){return{template:'<div class="multi-graph"></div>',restrict:"E",scope:{group:"="},link:function(a,b){var c=[{divider:1e18,suffix:"P"},{divider:1e15,suffix:"E"},{divider:1e12,suffix:"T"},{divider:1e9,suffix:"G"},{divider:1e6,suffix:"M"},{divider:1e3,suffix:"k"}],d=function(a){if(0>a)return"-"+d(-a);for(var b=0;b<c.length;b++)if(a>=c[b].divider)return(a/c[b].divider).toPrecision(3)+c[b].suffix;return a},e=function(a,b){return d3.max(a,function(a){return a[b]})},f=function(a,b){return d3.min(a,function(a){return a[b]})},g=function(a,b){return d3.svg.line().x(function(b){return a(b[0])}).y(function(a){return b(a[1])})},h=function(a,b,c,e,f){var g=d3.svg.axis().scale(b).ticks(c).orient("left").tickFormat(function(a){return d(a)}),h=1===a?-0:-f*(a-1);e.append("svg:g").attr("class","y axis axis"+a).attr("transform","translate("+h+",0)").call(g)},i=function(a){_.each(a.kiwis,function(a){a.values.sort(function(a,b){return Date.parse(a.date)>Date.parse(b.date)})});var c=_.pluck(a.kiwis,"values"),d=c.length,i=40,j=[10,5,20,d*i],k=615-j[1]-j[3],l=300-j[0]-j[2],m=6,n=4,o=.05,p=_.map(c,function(a){return _.map(a,function(a){return[Date.parse(a.date),a.value]})}),q=d3.min(p,function(a){return d3.min(a,function(a){return a[0]})}),r=d3.max(p,function(a){return d3.max(a,function(a){return a[0]})}),s=.05*(r-q),t=d3.time.scale().domain([q-s,r+s]).range([0,k]),u=b.find("div");u.empty();var v=k+j[1]+j[3],w=l+j[0]+j[2],x=d3.select(u[0]).append("svg:svg").attr("viewBox","0 0 "+v+" "+w).attr("perserveAspectRatio","xMinYMin meet").append("svg:g").attr("transform","translate("+j[3]+","+j[0]+")"),y=d3.svg.axis().scale(t).ticks(m);x.append("svg:g").attr("class","x axis").attr("transform","translate(0,"+l+")").call(y);for(var z=[],A=[],B=0;B<p.length;B++){var C=e(p[B],1),D=Math.min(f(p[B],1),0),E=d3.scale.linear().domain([D,C*(1+o)]).range([l,0]);A.push(E),z.push(g(t,E)),h(B+1,E,n,x,i)}for(var F=0;F<p.length;F++){x.append("svg:path").attr("d",z[F](p[F])).attr("class","data"+(F+1));for(var G=0;G<p[F].length;G++)x.append("svg:circle").transition().duration(500).attr("cx",t(p[F][G][0])).attr("cy",A[F](p[F][G][1])).attr("class","data"+(F+1)+"-point").attr("style","stroke: rgb(255, 255, 255); stroke-width: 2px;").attr("r",3)}};window.onresize=function(){var a=$(".group").width();b.find("svg").attr("width",a)},a.$watch("group",function(){i(a.group)}),a.$on("updateCustom",function(){i(a.group)})}}}),function(){angular.module("common.dragdrop",[]).factory("DragDropHandler",[function(){return{dragObject:void 0,addObject:function(a,b,c){b.splice(c,0,a)},moveObject:function(){}}}]).directive("draggable",["DragDropHandler",function(a){return{scope:{draggable:"="},link:function(b,c,d){c.draggable({connectToSortable:d.draggableTarget,helper:"clone",revert:"invalid",start:function(){a.dragObject=b.draggable},stop:function(){a.dragObject=void 0}}),c.disableSelection()}}}]).directive("droppable",["DragDropHandler",function(a){return{scope:{droppable:"=",ngUpdate:"&",ngCreate:"&"},link:function(b,c){c.droppable({greedy:!1}),c.disableSelection(),c.on("dropdeactivate",function(d,e){var f=c.height(),g=c.width(),h=c.offset().top,i=c.offset().left,j=e.offset.top,k=e.offset.left;j>h&&h+f>j&&k>i&&i+g>k&&(b.$apply(function(){b.ngUpdate({kiwi:a.dragObject})}),c.find("li.ui-draggable").remove())})}}}])}(),angular.module("KiwiApp").factory("Auth",["$location","$rootScope","$firebase","$cookies","alerter",function(a,b,c,d,e){return{login:function(a){a||angular.noop;b.auth.login("facebook",{rememberMe:!0,scope:"email"})},logout:function(){b.currentUser=null,b.auth.logout(),d.kiwiSpecial=null,d.kiwiUid=null,a.path("/"),e.alert("You have been logged out. Goodbye for now!")},isLoggedIn:function(){var a=b.currentUser;return!!a||d.kiwiSpecial}}}]),angular.module("KiwiApp").factory("alerter",function(){return{alert:function(a){$(".__kiwiSuccess").remove(),$("body").prepend("<div class='__kiwiSuccess'\n     style='background-color: #FAFF9A;\n            position: fixed;\n            z-index: 9000;\n            color: black;\n            font-family: Helvetica;\n            height: 40px;\n            font-size: 14px;\n            width: 96%;\n            padding: 10px 10px;\n            margin: 10px 12px;'>\n            "+a+"</div>"),$(".__kiwiSuccess").delay(1e3).fadeTo(3500,0,function(){return $(this).remove()})}}}),function(a,b){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))&&b()}(navigator.userAgent||navigator.vendor||window.opera,function(){$(".__kiwiSuccess").remove(),$("body").prepend("<div class='__kiwiSuccess'\n     style='background-color: #FAFF9A;\n            position: fixed;\n            z-index: 9000;\n            color: black;\n            font-family: Helvetica;\n            height: 40px;\n            font-size: 14px;\n            width: 96%;\n            padding: 10px 10px;\n            margin: 10px 12px;'>\n            This site isn't optimised for mobile browsing...</div>"),$(".__kiwiSuccess").delay(1e3).fadeTo(3500,0,function(){return $(this).remove()}),setTimeout(function(){$(".__kiwiSuccess").remove(),$("body").prepend("<div class='__kiwiSuccess'\n     style='background-color: #FAFF9A;\n            position: fixed;\n            z-index: 9000;\n            color: black;\n            font-family: Helvetica;\n            height: 40px;\n            font-size: 14px;\n            width: 96%;\n            padding: 10px 10px;\n            margin: 10px 12px;'>\n            We recommend you use something with a nice, big screen.</div>"),$(".__kiwiSuccess").delay(1e3).fadeTo(3500,0,function(){return $(this).remove()})},5e3)}),angular.module("KiwiApp").factory("NumberParser",function(){var a=function(a,b){this.initialize=function(){this.original=a,this.rest=b,this.forumla=null,this.origLength=a.length},this.initialize()};return a.prototype.isNumerical=function(){var a=this.original.value.match(/[a-zA-Z]/g),b=this.original.value.match(/\d+/g);return null===b?!1:null!==a?b.length>a.length:!0},a.prototype._cleanNumber=function(a){var b=a.value.replace(/\s/g,""),c=b.match(/[0-9 , \.]+/g);if(c)var d=c.join("");return null!==d?(a.value=parseFloat(d),a):void 0},a.prototype._matchLength=function(a){return-1!==a.value.indexOf(this.original.value)?this.original.value:a},a.prototype._getCurrency=function(){var a=this.original.match(/\$/g);return a&&a.length?a[0]:""},a.prototype.parseAll=function(){return _.flatten([this._cleanNumber(this.original),this.parse()])},a.prototype.parse=function(){var a=[],b=(this.original,this.origLength,this);return _.each(this.rest,function(c){var d=b._cleanNumber(c);d&&a.push(d)}),a},a}),angular.module("ui.bootstrap",["ui.bootstrap.tpls","ui.bootstrap.transition","ui.bootstrap.carousel"]),angular.module("ui.bootstrap.tpls",["template/carousel/carousel.html","template/carousel/slide.html"]),angular.module("ui.bootstrap.transition",[]).factory("$transition",["$q","$timeout","$rootScope",function(a,b,c){function d(a){for(var b in a)if(void 0!==f.style[b])return a[b]}var e=function(d,f,g){g=g||{};var h=a.defer(),i=e[g.animation?"animationEndEventName":"transitionEndEventName"],j=function(){c.$apply(function(){d.unbind(i,j),h.resolve(d)})};return i&&d.bind(i,j),b(function(){angular.isString(f)?d.addClass(f):angular.isFunction(f)?f(d):angular.isObject(f)&&d.css(f),i||h.resolve(d)}),h.promise.cancel=function(){i&&d.unbind(i,j),h.reject("Transition cancelled")},h.promise},f=document.createElement("trans"),g={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"},h={WebkitTransition:"webkitAnimationEnd",MozTransition:"animationend",OTransition:"oAnimationEnd",transition:"animationend"};return e.transitionEndEventName=d(g),e.animationEndEventName=d(h),e}]),angular.module("ui.bootstrap.carousel",["ui.bootstrap.transition"]).controller("CarouselController",["$scope","$timeout","$transition","$q",function(a,b,c){function d(){e();var c=+a.interval;!isNaN(c)&&c>=0&&(g=b(f,c))}function e(){g&&(b.cancel(g),g=null)}function f(){h?(a.next(),d()):a.pause()}var g,h,i=this,j=i.slides=[],k=-1;i.currentSlide=null;var l=!1;i.select=function(e,f){function g(){if(!l){if(i.currentSlide&&angular.isString(f)&&!a.noTransition&&e.$element){e.$element.addClass(f);{e.$element[0].offsetWidth}angular.forEach(j,function(a){angular.extend(a,{direction:"",entering:!1,leaving:!1,active:!1})}),angular.extend(e,{direction:f,active:!0,entering:!0}),angular.extend(i.currentSlide||{},{direction:f,leaving:!0}),a.$currentTransition=c(e.$element,{}),function(b,c){a.$currentTransition.then(function(){h(b,c)},function(){h(b,c)})}(e,i.currentSlide)}else h(e,i.currentSlide);i.currentSlide=e,k=m,d()}}function h(b,c){angular.extend(b,{direction:"",active:!0,leaving:!1,entering:!1}),angular.extend(c||{},{direction:"",active:!1,leaving:!1,entering:!1}),a.$currentTransition=null}var m=j.indexOf(e);void 0===f&&(f=m>k?"next":"prev"),e&&e!==i.currentSlide&&(a.$currentTransition?(a.$currentTransition.cancel(),b(g)):g())},a.$on("$destroy",function(){l=!0}),i.indexOfSlide=function(a){return j.indexOf(a)},a.next=function(){var b=(k+1)%j.length;return a.$currentTransition?void 0:i.select(j[b],"next")},a.prev=function(){var b=0>k-1?j.length-1:k-1;return a.$currentTransition?void 0:i.select(j[b],"prev")},a.select=function(a){i.select(a)},a.isActive=function(a){return i.currentSlide===a},a.slides=function(){return j},a.$watch("interval",d),a.$on("$destroy",e),a.play=function(){h||(h=!0,d())},a.pause=function(){a.noPause||(h=!1,e())},i.addSlide=function(b,c){b.$element=c,j.push(b),1===j.length||b.active?(i.select(j[j.length-1]),1==j.length&&a.play()):b.active=!1},i.removeSlide=function(a){var b=j.indexOf(a);j.splice(b,1),j.length>0&&a.active?i.select(b>=j.length?j[b-1]:j[b]):k>b&&k--}}]).directive("carousel",[function(){return{restrict:"EA",transclude:!0,replace:!0,controller:"CarouselController",require:"carousel",templateUrl:"template/carousel/carousel.html",scope:{interval:"=",noTransition:"=",noPause:"="}}}]).directive("slide",["$parse",function(a){return{require:"^carousel",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/carousel/slide.html",scope:{},link:function(b,c,d,e){if(d.active){var f=a(d.active),g=f.assign,h=b.active=f(b.$parent);b.$watch(function(){var a=f(b.$parent);return a!==b.active&&(a!==h?h=b.active=a:g(b.$parent,a=h=b.active)),a})}e.addSlide(b,c),b.$on("$destroy",function(){e.removeSlide(b)}),b.$watch("active",function(a){a&&e.select(b)})}}}]),angular.module("template/carousel/carousel.html",[]).run(["$templateCache",function(a){a.put("template/carousel/carousel.html",'<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel">\n    <ol class="carousel-indicators" ng-show="slides().length > 1">\n        <li ng-repeat="slide in slides()" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>\n    </ol>\n    <div class="carousel-inner" ng-transclude></div>\n    <a class="left carousel-control" ng-click="prev()" ng-show="slides().length > 1"><span class="icon-prev"></span></a>\n    <a class="right carousel-control" ng-click="next()" ng-show="slides().length > 1"><span class="icon-next"></span></a>\n</div>\n')}]),angular.module("template/carousel/slide.html",[]).run(["$templateCache",function(a){a.put("template/carousel/slide.html","<div ng-class=\"{\n    'active': leaving || (active && !entering),\n    'prev': (next || active) && direction=='prev',\n    'next': (next || active) && direction=='next',\n    'right': direction=='prev',\n    'left': direction=='next'\n  }\" class=\"item text-center\" ng-transclude></div>\n")}]),angular.module("KiwiApp").service("Kiwi",["$http","$rootScope","Auth","$cookies","NumberParser",function(a,b,c,d,e){return{valuesToArray:function(a){return void 0!==a?Object.keys(a).map(function(b){return a[b]}):void 0},editTitle:function(b,c){d.kiwiUid&&a({method:"PUT",url:"https://kiwidb.firebaseio.com/users/"+encodeURIComponent(d.kiwiUid)+"/kiwis/"+encodeURIComponent(b.hash)+"/title.json?auth="+d.kiwiSpecial,data:JSON.stringify(b.title)}).success(function(a){c(a)}).error(function(a){console.error(a)})},washKiwi:function(a){a.values=this.valuesToArray(a.values);var b=a.values.shift(),c=new e(b,a.values);return c.isNumerical()?c.parseAll():_.pluck(a.values,"value")},getKiwis:function(a){var b=this;this.getAll(function(c){_.each(c,function(a,c){a.values=b.washKiwi(a),a.hash=c}),a(c)})},getAll:function(b){d.kiwiUid&&a({method:"GET",url:"https://kiwidb.firebaseio.com/users/"+d.kiwiUid+"/kiwis.json?auth="+d.kiwiSpecial}).success(function(a){"null"!==a&&b(a)}).error(function(a){console.error(a)})},deleteKiwi:function(b,c){d.kiwiUid&&a({method:"DELETE",url:"https://kiwidb.firebaseio.com/users/"+encodeURIComponent(d.kiwiUid)+"/kiwis/"+encodeURIComponent(b.hash)+".json?auth="+d.kiwiSpecial}).success(function(a){c(a)}).error(function(a){console.error(a)})}}}]),angular.module("KiwiApp").service("Group",["$http","$rootScope","Auth","$cookies",function(a,b,c,d){return{getGroups:function(a,b){var c=this;this.getAll(a,function(a,d){var e=[];for(var f in d){var g=d[f],h=g.kiwiHashes,i=c.getKiwisFromHash(a,h);g.kiwiHashes=h||[],g.kiwis=i,g.isPublic=g.isPublic||!1,g.groupHash=f,e.push(g)}b(e)})},getAll:function(b,c){d.kiwiUid&&a({method:"GET",url:"https://kiwidb.firebaseio.com/users/"+encodeURIComponent(d.kiwiUid)+"/groups.json?auth="+d.kiwiSpecial}).success(function(a){"null"!==a&&c(b,a)}).error(function(a){console.error(a)})},getKiwisFromHash:function(a,b){var c=[];if(Array.isArray(b)?b.clean(void 0):b=_.map(b,function(a){return a}).clean(void 0),b){for(var d=0;d<b.length;d++)c.push(a[b[d]]);return c}},save:function(b,c,e){d.kiwiUid&&a({method:"PUT",data:b,url:"https://kiwidb.firebaseio.com/users/"+encodeURIComponent(d.kiwiUid)+"/groups/"+encodeURIComponent(c)+".json?auth="+d.kiwiSpecial}).success(function(){e()}).error(function(a){console.error(a)})},deleteHashFromGroup:function(b,c,e){d.kiwiUid&&a({method:"DELETE",url:"https://kiwidb.firebaseio.com/users/"+d.kiwiUid+"/groups/"+encodeURIComponent(b.name)+"/kiwiHashes/"+b.kiwiHashes.indexOf(c)+".json?auth="+d.kiwiSpecial}).success(function(a){e(a)}).error(function(a){console.error(a)})}}}]),angular.module("KiwiApp").service("Profile",["$http","$cookies","$rootScope",function(a,b){return{getSettings:function(c){b.kiwiUid&&a({method:"GET",url:"https://kiwidb.firebaseio.com/users/"+encodeURIComponent(b.kiwiUid)+"/settings.json?auth="+b.kiwiSpecial}).success(function(a){"null"!==a&&c(a)}).error(function(a){console.error(a)})}}}]),angular.module("KiwiApp").controller("MainCtrl",["$scope","$http",function(a){a.myInterval=5e3;var b=a.slides=[];a.addSlide=function(){b.push({image:"images/carousel-01.png"}),b.push({image:"images/carousel-02.png"}),b.push({image:"images/carousel-03.png"})},a.addSlide()}]);