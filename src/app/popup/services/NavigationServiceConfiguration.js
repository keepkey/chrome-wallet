angular.module('kkWallet')
  .config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider.caseInsensitiveMatch = true;
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
        .when('/lifeboat', {
          templateUrl: 'app/popup/device/lifeboat.tpl.html',
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
        .when('/buttonRequest/button_request_sign_exchange', {
          templateUrl: 'app/popup/buttonRequest/sign-exchange.tpl.html',
          goable: false
        })
        .when('/buttonRequest/button_request_fee_over_threshold', {
          templateUrl: 'app/popup/buttonRequest/feeOverThreshhold.tpl.html',
          goable: false
        })
        .when('/buttonRequest/button_request_protect_call', {
          templateUrl: 'app/popup/buttonRequest/generic.tpl.html',
          goable: false
        })
        .when('/buttonRequest/button_request_change_pin', {
          templateUrl: 'app/popup/buttonRequest/changePin.tpl.html',
          goable: false
        })
        .when('/buttonRequest/button_request_change_label', {
          templateUrl: 'app/popup/buttonRequest/changeLabel.tpl.html',
          goable: false
        })
        .when('/buttonRequest/button_request_enable_passphrase', {
          templateUrl: 'app/popup/buttonRequest/enablePassphrase.tpl.html',
          goable: false
        })
        .when('/buttonRequest/button_request_disable_passphrase', {
          templateUrl: 'app/popup/buttonRequest/disablePassphrase.tpl.html',
          goable: false
        })
        .when('/buttonRequest/button_request_confirm_transfer_to_account', {
          templateUrl: 'app/popup/buttonRequest/confirmTransferToAccount.tpl.html',
          goable: false
        })
        .when('/buttonRequest/button_request_apply_policies/:policy/:state', {
          templateUrl: 'app/popup/buttonRequest/apply-policy.tpl.html',
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
        .when('/failure/invalid_pin', {
          templateUrl: 'app/popup/failure/pinInvalid.tpl.html',
          goable: false
        })
        .when('/failure/bip44_account_gap_violation/:previousAccountName', {
          templateUrl: 'app/popup/failure/Bip44AccountGapViolation.tpl.html',
          goable: true
        })
        .when('/failure/transaction_must_have_at_least_one_input', {
          templateUrl: 'app/popup/failure/MustHaveAtLeastOneInput.tpl.html',
          goable: false
        })
        .when('/failure/unable_to_initialize', {
          templateUrl: 'app/popup/failure/UnableToInitialize.tpl.html',
          goable: true
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
        .when('/success/passphrase_accepted', {
          templateUrl: 'app/popup/walletlist/walletlist.tpl.html',
          goable: false
        })
        .when('/success/:message', {
          templateUrl: 'app/popup/success/success.tpl.html',
          goable: false
        })
        .when('/receive/:walletId/:addressDepth', {
          templateUrl: 'app/popup/receive/receive.tpl.html',
          goable: true
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
        .when('/accountConfig/:accountId', {
          templateUrl: 'app/popup/accountConfig/updateAccount.tpl.html',
          goable: true
        })
        .when('/accountConfig', {
          templateUrl: 'app/popup/accountConfig/addAccount.tpl.html',
          goable: true
        })
        .when('/update-firmware', {
          templateUrl: 'app/popup/update-firmware/update-firmware.tpl.html',
          goable: true
        })
        .when('/preparing', {
          templateUrl: 'app/popup/preparing/preparing.tpl.html',
          goable: false
        })
        .when('/disableConflicting/:id', {
          templateUrl: 'app/popup/disable_conflicting/disable_conflicting.tpl.html',
          goable: false
        })
        .when('/prerelease-device', {
          templateUrl: 'app/popup/prerelease-device/prerelease-device.tpl.html',
          goable: false
        })
        .when('/confirm-exchange', {
          templateUrl: 'app/popup/confirm-exchange/confirm-exchange.tpl.html',
          goable: false
        })
        .otherwise({
          redirectTo: '/',
          goable: false
        });
    }]);
