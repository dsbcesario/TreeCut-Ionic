angular.module('app.controllers', ['ngCordova'])

    .controller('denunciaCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams) {


        }])

    .controller('localizacaoCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
        // You can include any angular dependencies as parameters for this function
        // TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams) {


        }])

    .controller('EmailController', function($scope) {
    $scope.sendFeedback= function() {
        if(window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                console.log("Response -> " + result);
            }, 
            "Feedback for your App", // Subject
            "krai porra",                      // Body
            ["dsbcesario@gmail.com"],    // To
            null,                    // CC
            null,                    // BCC
            false,                   // isHTML
            null,                    // Attachments
            null);                   // Attachment Data
        }
    }
})

    .controller('emailCtrl', function($cordovaEmailComposer){
        
        $cordovaEmailComposer.isAvailable().then(function(){
            // is available
        }, function(){
            //not available
        });

        var email = {
            to : 'dsbcesario@gmail.com',
            subject: 'Poda de Árvore',
            body: 'FOI NAO ?',
            isHtml: true
        };

        $cordovaEmailComposer.open(email).then(null, function(){
            // user cancelled email
        });

    })
    
    .controller('homeCtrl', function ($scope, $state) {
        
        $scope.solicitar = function (response) {
            $state.go('tabsController.solicitação')
        }

        $scope.denunciar = function (response) {
            $state.go('tabsController.denuncia')
        }

        $scope.sobrenos = function (response) {
            $state.go('tabsController.sobrenos')
        }
    })

    .controller('DenunciaCtrl', function ($scope, $cordovaCamera, $rootScope, $state, $ionicModal, solicitacaoPoda, ionicSuperPopup, $ionicLoading) {
        $scope.voltarLocalizacao = function () {
            $state.go('tabsController.localizacao');
        };
        $scope.camera = { cidade: $rootScope.formatted_address };
        $scope.pictureUrl = '../img/add_photo.png';
        $scope.fotografar = function () {
            $cordovaCamera.getPicture({
                destinationType: Camera.DestinationType.DATA_URL,
                encodingType: Camera.EncodingType.JPEG,
                saveToPhotoAlbum: true
            })
                .then(function (data) {
                    $scope.pictureUrl = 'data:image/jpeg;base64,' + data;
                });
        }
        // ModalImage
        $scope.showImages = function (index) {
            $scope.activeSlide = index;
            $scope.showModal('templates/imagemmodal.html');
        }

        $scope.showModal = function (templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }

        // Close the modal
        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.modal.remove()
        };
        $scope.obj = {
            detalhes: ""
        }
        $scope.salvar = function (cidade) {
            $ionicLoading.show({

                template: 'Carregando...',
                duration: 300
            })
            var user = firebase.auth().currentUser;
            var obj = {
                endereco: cidade,
                img: $scope.pictureUrl,
                uid: user.uid,
                detalhes: $scope.obj.detalhes
            }
            var promise = solicitacaoPoda.createSolicitacao(obj);
            promise.then(function () {
                $ionicLoading.hide();
                ionicSuperPopup.show('Feito!', 'Denúncia enviada com sucesso!', 'success');
                console.log('cadastrou foda')
                $state.go('home');

            })
        }
    })

    .controller('MapCtrl', function ($scope, $ionicLoading, $cordovaGeolocation, $window, $rootScope, $state) {

        $ionicLoading.show({

            template: 'Carregando...',
            duration: 300
        })


        $scope.mapCreated = function (map) {

            $scope.map = map;
        };

        $scope.centerOnMe = function () {

            console.log("Centering");

            if (!$scope.map) {
                return;
            }

            $scope.loading = $ionicLoading.show({
                content: 'Capturando localização atual...',
                showBackdrop: false,
                duration: 3000
            });

            navigator.geolocation.getCurrentPosition(function (pos) {

                console.log('Got pos', pos);
                $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                $scope.loading.hide();
            }, function (error) {
                alert('Impossivel carregar localização: ' + error.message);



            });
        };

        var marker;
        var watchOptions = {
            timeout: 3000,
            enableHighAccuracy: false
        };

        var watch = $cordovaGeolocation.watchPosition(watchOptions, $scope);


        watch.then(null,
            function (err) { },
            function (position) {
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                $scope.map.setCenter(new google.maps.LatLng(lat, lng));

                google.maps.event.addListenerOnce($scope.map, 'idle', function () {

                    if (marker)
                        marker.setMap(null);

                    marker = new google.maps.Marker({
                        map: $scope.map,
                        animation: google.maps.Animation.DROP,
                        position: new google.maps.LatLng(lat, lng)
                    });


                });

                var geocoder = new google.maps.Geocoder();
                var infowindow = new google.maps.InfoWindow;
                var latlng = new google.maps.LatLng(lat, lng);
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {

                            $scope.cidade = Object;
                            $rootScope.formatted_address = results[0].address_components[1].long_name + ", " + results[1].formatted_address;


                            console.log($rootScope.formatted_address);

                            if (results[0].types[0] == 'street_address' && results[0].address_components[1]) {
                                streetname = results[0].address_components[1].long_name;
                            }
                            else if (results[0].types[0] == 'route') {
                                streetname = results[0].address_components[0].long_name;
                            }

                            var markerAddress = results[0].address_components[1].long_name;
                            console.log(markerAddress);
                        }
                    }
                    $scope.pegarLocalizacao = function () {
                        $state.go('tabsController.denuncia');
                    };

                });
            })
    })




