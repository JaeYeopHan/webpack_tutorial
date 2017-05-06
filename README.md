# [Tool] Webpack2, 입문 가이드 2편
[> Webpack2, 입문 가이드 1편 >](https://jaeyeophan.github.io/2017/05/05/webpack-tutorial-1/)

## Plugins
플러그인을 통해 코드를 난독화(Uglify)하여 압축할 수 있고, 공통된 코드(Common chunk)를 분리할 수 있고, 코드의 변경사항을 파악하게 하여 자동으로 재실행시킬 수 있습니다. 이외에도 여러 가지 훌륭한 기능들이 존재하는데요, Webpack이 제공하는 플러그인과 외부 플러그인들 중에서 일부에 대해 알아봅니다.

Webpack에 내장된 플러그인에는 `webpack.[plugin-name]`을 통해 접근할 수 있습니다.

```js webpack.config.js
const webpack = require('webpack');
const config = {
  entry: [...],
  output: [...],
  module: [...],
  plugins: [...]
}
module.exports = config;
```
`plugins`에는 배열을 통하여 여러 플러그인을 설정할 수 있습니다. 1편에서와는 다르게 기본 구조에서 코드 한 줄이 추가되었는데요, webpack이 제공하는 플러그인을 사용하기 위해서 `webpack`이란 모듈을 불러와야 합니다.

</br>

### UglifyJsPlugin
webpack을 통해 작업을 수행할 때, 코드를 압축하여 난독화시켜주는 플러그인입니다.
```js
const config = {
  [...]
  plugins: [
    //new webpack.optimize.UglifyJsPlugin()
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    })
  ]
}
```
`UglifyJsPlugin`은 `optimize`로 접근할 수 있습니다. config파일 설정을 마쳤으면 `$ webpack` 명령어를 수행해줍니다. 그리고 나서 `dist/bundle.js` 파일을 확인해봅니다. 코드가 한 줄로 알아볼 수 없게 압축되어 있는 것을 확인하실 수 있습니다 :) 해당 플러그인을 생성할 때, 파라미터로 옵션을 전달할 수 있습니다. 이 예제에서는 압축 시 발생할 수 있는 경고를 무시하는 옵션을 추가했습니다.

</br>

### CommonChunkPlugin
entry point가 여러 개 설정되어있는 경우, 공통된 모듈 또는 라이브러리를 별도의 chunk로 분리하여 bundle 작업을 수행할 때 사용할 수 있는 plugin입니다.
```js
const config = {
  [...]
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      filename: "commons.js",
      minChunks: Infinity
    })
  ]
}
```
`name`, `filename`, `minChunks` 세 가지 옵션만 설정해봤습니다. `name`은 생성될 chunk의 이름을 지정합니다. 생성될 파일의 이름인 `filename`을 설정하고 `minChunks`라는 옵션을 통해서 `commons`로 묶일 최소한의 module 개수를 설정할 수 있습니다. `Infinity`라는 설정값을 주면 공통으로 묶을 수 있는 모듈들을 모두 commons로 묶습니다. `number` or `function`을 지정하여 customize할 수 있습니다.

위 설정을 마치고 `$webpack` 명령어를 실행하게 되면 `commons.js`파일과 `bundle.js`파일 두 파일이 생성됩니다. 이를 `index.html`에서 로드를 할 때, 다음과 같이 `commons.js`파일을 먼저 로드해야 한다는 점 주의하시면 되겠습니다.
```html
<script src="./dist/commons.js"></script>
<script src="./dist/bundle.js"></script>
```
추가적인 다른 옵션은 다음 [링크](https://webpack.js.org/plugins/commons-chunk-plugin/)를 참고하시면 됩니다 :)

</br>

### ExtractTextPlugin
이 플러그인은 따로 설치가 필요합니다.
```bash
$ npm install --save-dev extract-text-webpack-plugin
# or
$ yarn add -D extract-text-webpack-plugin
```
webpack을 통해서 css를 로드하는 경우 발생하는 문제점은 js와 함께 로드된다는 것입니다. 기존에는 js와 따로 css만 로드되었습니다. 이 플러그인이 bundle되는 과정에서 js파일과 css파일을 분리해줍니다. 분리된 css bundle 파일은 병렬로 로드가 되어 사용자 입장에서는 더 빠르게 완성된 웹 페이지 화면을 볼 수 있게 됩니다.
```js
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = {
  [...]
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles.css"),
  ]
}
```
`module` 옵션에서 `style-loader`를 사용하는 설정 코드가 변경되었습니다. `plugins` 옵션에 해당 플러그인을 추가해주고 파라미터로 bundle된 output의 filename을 설정해줍니다. `$ webpack` 명령어를 실행해주면 dist 폴더에 `styles.css`파일이 생성된 것을 확인할 수 있습니다.

추가적인 다른 옵션은 다음 [링크](https://webpack.js.org/plugins/extract-text-webpack-plugin/)를 참고하시면 됩니다 :)

</br>

### HtmlWebpackPlugin
따로 분리하여 bundle한 css파일과 js파일을 각각 html 파일에 link 태그와 script태그로 추가해줘야 합니다. 이 플러그인은 이것을 자동화해줍니다. 이 플러그인도 마찬가지로 따로 설치가 필요합니다.
```bash
$ npm install --save-dev html-webpack-plugin
# or
$ yarn add -D html-webpack-plugin
```
그리고 plugin에 추가해줍니다.
```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}
```
template 옵션에는 해당하는 html파일의 패스를 입력해주시면 됩니다. `$ webpack` 명령어를 실행해주면 dist 폴더에 `index.html`파일이 생성되고 자동으로 bundle된 css파일과 js파일이 link태그와 script태그로 추가된 것을 확인하실 수 있습니다. !webpack에 의해서 자동으로 추가되므로 **우리가 작성하는 ** html 파일에는 script태그와 link태그를 작성할 필요가 없습니다. 오히려 작성하면 두 번 load를 하게 되므로 성능상 좋지 않습니다.

추가적인 다른 옵션은 다음 [링크](https://webpack.js.org/plugins/html-webpack-plugin/)를 참고하시면 됩니다 :)

</br>

### HotModuleReplacementPlugin
`HMR`이라는 약자로도 많이 불리는 플러그인 입니다. 개발 생산성을 극대화(?)시켜주는 플러그인이라고 할 수 있습니다. 이 플러그인 없이 `$ webpack-dev-server --watch` 명령어를 실행하여 작업을 하고 저장을 해도 자동 reload가 안됩니다. 다음과 같이 추가해줍니다.
```js
const config = {
  [...]
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
}
```
사실 이 플러그인을 추가해도 reload는 되지 않고 webpack 작업만 자동으로 실행됩니다. 웹 브라우저에 자동으로 reload를 시켜주려면 한 가지 설정이 추가적으로 필요합니다.
```js
const config = {
  [...]
  devServer: {
    contentBase: './dist',
    hot: true
  }
}
```
`$ webpack-dev-server --watch`를 실행하고 js파일을 수정하고 저장을 해주면 자동으로 웹브라우저에 reload가 되는 것을 확인하실 수 있습니다! (`devServer`는 config에서 설정할 수 있는 또다른 옵션입니다.)

</br>

### NoEmitOnErrorsPlugin
컴파일 도중 오류가 발생한 리소스들은 제외하고 작업을 진행하여 bundling하도록 합니다. 참고로 `NoErrosPlugin`은 deprecated되었습니다.
```js
new webpack.NoEmitOnErrorsPlugin()
```

<br/>

#### 마무리
이외에도 많은 플러그인들이 존재합니다. [awsome-webpack](https://github.com/webpack-contrib/awesome-webpack)에서 확인하실 수 있습니다 :)
다음 포스팅에서는 config파일의 기본적인 옵션을 제외한 다른 옵션들에 대해 알아보겠습니다. :)

_2편 end_

#### Reference
[Webpack Plugins](https://webpack.js.org/plugins/)
[Webpck official DOCS](https://webpack.js.org/configuration/plugins/)
[Webpck official CONCEPT](https://webpack.js.org/concepts/hot-module-replacement/)
