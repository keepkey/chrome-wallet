angular.module('kkWallet')
    .directive('obscure', function focus() {
        return {
            restrict: 'A',
            scope: {
                obscuringCharacter: '@obscure',
                content: '=ngBind'
            },
            link: function (scope, element) {
                scope.$watch('content', function () {
                    var obscuringMarkup = '<span class="obscured-text fa ' +
                        scope.obscuringCharacter +
                        '"></span>';
                    var replacementHtml = new Array(('' + scope.content).length + 1)
                        .join(obscuringMarkup);
                    element
                        .html(replacementHtml);
                });
            }
        };
    });