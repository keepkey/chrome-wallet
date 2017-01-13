#KeepKey Launcher
The KeepKey Wallet extension adds bitcoin wallet functionality to Chrome using the KeepKey device for private key
generation, private key storage, and transaction signing.

##Running the extension unpacked (Dev mode)
This is useful for developing the app because a build is not required. 

1. ```npm install bower -g```
2. ```npm install gulp -g```
3. ```npm install```
4. ```bower install```
5. In chrome, browse to ```chrome:extensions```
6. Turn on developer mode.
7. Click the "Load unpacked extensions..." button.
8. Browse to the root of this project and click "Select".

##Running the extension unpacked (Integration mode)
This will run the compiled version of the app from you local harddrive. This mode is useful for a sanity check before
uploading to the Google Chrome Store and integration testing. This executes with the same files that are packaged and
uploaded.

1. ```npm install bower -g```
2. ```npm install gulp -g```
3. ```npm install```
4. ```bower install```
5. __```gulp build```__
6. In chrome, browse to ```chrome:extensions```
7. Turn on developer mode.
8. Click the "Load unpacked extensions..." button.
9. __Browse to the ```dist``` directory of this project and click "Select".__

__Bold__ indicates steps that are different from the Dev mode procedure

##Uploading the test application to the Chrome Webstore
1. Bump the version number of the package (```gulp bumpPatch```).
2. ```gulp build --environment test```.
3. Goto the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard).
4. Click _edit_ for the _KeepKey Wallet (Test)_ application.
5. Click _upload updated package_.
6. Select ```keepkey-wallet-test.zip``` from the root of the project for upload.

##Install the test version from the Chrome Store
You need to be on the list approved testers for the KeepKey Google Developer account. If you are, you can install the
test version of the extension from
[here](https://chrome.google.com/webstore/detail/keepkey-wallet-test/lbeldmkoigoeiikhejjmgndblmdhfnik/related). If you
are not an approved tester, contact [ken@keepkey.com](mailto:ken@keepkey.com).

