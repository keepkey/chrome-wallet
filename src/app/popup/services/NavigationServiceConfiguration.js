angular.module('kkWallet')
  .config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'app/popup/connect/connect.tpl.html'
        })
        .when('/connect', {
          templateUrl: 'app/popup/connect/connect.tpl.html'
        })
        .when('/device', {
          templateUrl: 'app/popup/device/device.tpl.html',
          goable: true
        })
        .when('/initialize', {
          templateUrl: 'app/popup/initialize/initialize.tpl.html',
          goable: true
        })
        .when('/bootloader', {
          templateUrl: 'app/popup/bootloader/bootloader.tpl.html'
        })
        .when('/buttonRequest/button_request_confirm_word', {
          templateUrl: 'app/popup/buttonRequest/confirmWord.tpl.html',
          goable: false
        })
        .when('/buttonRequest/button_request_wipe_device', {
          templateUrl: 'app/popup/buttonRequest/wipeDevice.tpl.html',
          goable: false
        })
        .when('/buttonRequest/button_request_firmware_erase', {
          templateUrl: 'app/popup/buttonRequest/firmwareErase.tpl.html',
          goable: false
        })
        .when('/buttonRequest/button_request_confirm_output', {
          templateUrl: 'app/popup/buttonRequest/confirmOutput.tpl.html',
          goable: false
        })
        .when('/buttonRequest/button_request_sign_tx', {
          templateUrl: 'app/popup/buttonRequest/signTx.tpl.html',
          goable: false
        })
        .when('/buttonRequest/button_request_fee_over_threshold', {
          templateUrl: 'app/popup/buttonRequest/feeOverThreshhold.tpl.html',
          goable: false
        })
        .when('/buttonRequest/button_request_protect_call_change_pin', {
          templateUrl: 'app/popup/buttonRequest/protectCallChangePin.tpl.html',
          goable: false
        })
        .when('/buttonRequest/button_request_protect_call_change_label', {
          templateUrl: 'app/popup/buttonRequest/protectCallChangeLabel.tpl.html',
          goable: false
        })
        .when('/buttonRequest/:code', {
          templateUrl: 'app/popup/buttonRequest/buttonRequest.tpl.html',
          goable: false
        })
        .when('/characterRequest/:word_pos/:character_pos', {
          templateUrl: 'app/popup/characterRequest/characterRequest.tpl.html',
          goable: false
        })
        .when('/creating', {
          templateUrl: 'app/popup/creating/creating.tpl.html'
        })
        .when('/failure/firmware_erase_cancelled', {
          templateUrl: 'app/popup/failure/firmwareEraseCancelled.tpl.html',
          goable: false
        })
        .when('/failure/pin_change_failed', {
          templateUrl: 'app/popup/failure/pinConfirmationFailed.tpl.html',
          goable: false
        })
        .when('/failure/:message', {
          templateUrl: 'app/popup/failure/failure.tpl.html',
          goable: false
        })
        .when('/walletlist', {
          templateUrl: 'app/popup/walletlist/walletlist.tpl.html',
          goable: true
        })
        .when('/wallet/:wallet', {
          templateUrl: 'app/popup/wallet/wallet.tpl.html',
          goable: true
        })
        .when('/wallet', {
          templateUrl: 'app/popup/wallet/wallet.tpl.html',
          goable: true
        })
        .when('/send/:wallet', {
          templateUrl: 'app/popup/send/send.tpl.html',
          goable: true
        })
        .when('/wordRequest', {
          templateUrl: 'app/popup/wordRequest/wordRequest.tpl.html'
        })
        .when('/sending', {
          templateUrl: 'app/popup/sending/sending.tpl.html'
        })
        .when('/success/bouncies', {
          templateUrl: 'app/popup/success/buildingTransaction.tpl.html',
          goable: false
        })
        .when('/success/firmware_erased', {
          templateUrl: 'app/popup/success/updatingFirmware.tpl.html',
          goable: false
        })
        .when('/success/upload_complete', {
          templateUrl: 'app/popup/success/uploadComplete.tpl.html',
          goable: false
        })
        .when('/success/:message', {
          templateUrl: 'app/popup/success/success.tpl.html',
          goable: false
        })
        .when('/receive/:walletId', {
          templateUrl: 'app/popup/receive/receive.tpl.html',
          goable: true
        })
        .when('/pin/pin_matrix_request_type_new_first', {
          templateUrl: 'app/popup/pin/newPin.tpl.html',
          goable: false
        })
        .when('/pin/pin_matrix_request_type_new_second', {
          templateUrl: 'app/popup/pin/confirmPin.tpl.html',
          goable: false
        })
        .when('/pin/:type', {
          templateUrl: 'app/popup/pin/pin.tpl.html',
          goable: false
        })
        .when('/passphrase', {
          templateUrl: 'app/popup/passphrase/passphrase.tpl.html',
          goable: false
        })
        .when('/label/:nextAction', {
          templateUrl: 'app/popup/label/label.tpl.html',
          goable: true
        })
        .when('/syncing', {
          templateUrl: 'app/popup/syncing/syncing.tpl.html'
        })
        .when('/passphrase', {
          templateUrl: 'app/popup/passphrase/passphrase.tpl.html',
          goable: false
        })
        .when('/support', {
          templateUrl: 'app/popup/support/support.tpl.html',
          goable: true
        })
        .otherwise({
          redirectTo: '/'
        });
    }]);
