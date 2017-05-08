# [Tool] Webpack2, 입문 가이드 3편, Option
## Config's other options
기본적인 네 가지 옵션, `entry`, `output`, `module`, `plugin`에 대해 알아봤습니다. 이번 포스팅에서는 좀 더 나아가 추가적인 옵션들도 살펴봅니다.
</br>


### devServer
2편에서 `HMR(HotModuleReplacement)` 플러그인을 사용할 때 추가해줬던 `webpack-dev-server`와 관련된 옵션입니다. 여러 가지 추가 설정이 존재합니다.
```js
devServer: {
    hot: true,
    inline: true,
    port: 4000,
    compress: true,
    publicPath: '/dist/',
    contentBase: path.join(__dirname, '/dist/'),
}
```
#### pulicPath: '/[dirname]/'
`pulicPath`를 지정해주지 않았다면 default path는 '/'로 설정되어 있습니다. 그렇기 때문에 `$ webpack-dev-server` 명령어를 통해 실행하면 다음과 같은 메세지가 나타납니다.
``` bash
$ webpack output is served from /
```
이것은 bundle된 결과 파일들이 `http://localhost:[portNumber]`에 served되었다는 것을 의미합니다. `publicPath` 설정으로 이를 지정할 수 있으며 그 값은 예제처럼 `/`로 둘러쌓여 있어야 합니다. 이 값을 따로 설정해주면 live reloading 기능이 기존의 url로는 안되겠죠? `http://localhost:[portNumber]/[publicpath]/`로 접근해야 예전처럼 live reloading 기능을 사용하실 수 있습니다.

이외에도 `port`, `host`, `proxy` 등 다양한 옵션들이 존재합니다. `devServer`와 관련된 다양한 옵션은 다음 [링크](https://webpack.js.org/configuration/dev-server/)에서 볼 수 있습니다.
</br>


### context
entry point에서 사용할 절대 경로(absolute path)를 지정할 때 사용합니다.
```js
const config = {
  context: path.join(__dirname),
  [...]
}
```

</br>


### resolve
#### reslove.alias
path에 alias를 설정하여 모듈을 `import`할 때, 보다 간편히가 코드를 작성할 수 있습니다. 다음과 같은 import 구문이 있다고 가정해봅니다.
```js app.js
import { Utility } from '../../../../utilities/utility';
```
상대경로로 타고 타고 올라가서 해당 경로를 찾아야 하는 불편함이 존재합니다. 이를 해결하기 위해 alias를 사용하면 다음과 같은 코드로 재탄생합니다.
```js webpack.config.js
alias: {
  Utilities: path.join(__dirname, 'src/utilities');
  post$: path.join(__dirname, 'src/service/post.js')
}

```
path를 마치 상수처럼 선언하여 프로젝트에서 사용할 수 있도록 해줍니다.
```js app.js
import { Utility } from 'Utilities/utility';
import post from 'post';
```
디렉토리에 대해서 그리고 파일에 대해서 path를 지정했습니다. 위의 예제처럼 특정 파일에 대해서 alias를 생성할 때, 생성하고자 하는 alias 뒤에 `$`를 붙여주면 해당 path뒤로 추가적인 path를 설정할 수 없습니다.

`resolve`와 관련된 다양한 옵션은 다음 [링크](https://webpack.js.org/configuration/resolve/)에서 볼 수 있습니다.

</br>

### devtool
webpack에서 제공하는 기술 중, `SourceMaps`이라는 기술이 있습니다. `SourceMaps`은 하나의 파일로 병합되거나 압축된 자바스크립트, CSS 파일을 원형으로 분리(path 구조까지)하여, 복원해주는 기술입니다.
`devtool` 옵션은 `SourceMaps`을 생성할지 말지를 결정하는 옵션입니다. 에러가 발생할 때, 어느 부분에서 에러가 발생했는지 알아야 디버깅이 수월할텐데요, `source map`은 bundle된 코드에서 발생한 에러를 기존의 코드와 연결시켜주는 역할을 합니다. `devtool`에서 설정할 수 있는 옵션들에는 여러 가지가 존재하며 각각의 장단점이 존재합니다.

|devtool|build|rebuild|production|
|---|---|---|---|
|eval|+++|+++|no|
|cheap-eval-source-map|+|++|no|
|cheap-source-map|+|0|yes|
|cheap-module-eval-source-map|0|++|no|
|cheap-module-source-map|0|-|yes|
|eval-source-map|- -|+|no|
|source-map|- -|- -|yes|
|nosources-source-map|- -|- -|yes|

https://webpack.js.org/configuration/devtool/

Webpack2 공식 홈페이지에서 소개하고 있는 devtool 옵션들입니다. `+`는 작업 속도가 빠르다는 것을 의마하며 `-`는 그 반대로 느린 것을 의미합니다. 이 많은 옵션 중에서 개발할 때 적합한 옵션은 무엇이고, 배포할 때 적합한 옵션은 무엇일까요?

개발 시에는 얼머나 용량을 줄이느냐보다 어디에서 에러가 발생했는지 알 수 있어야 하므로 로그가 상세히 나타나는 옵션을 선택해야하며 생산성을 높이기 위해 빌드 시간이 짧아야 합니다. 배포용은 용량이 우선적으로 작아야 겠죠? 저는 다음과 같이 정리해보았습니다.
_for development)_ Use `cheap-module-eval-source-map` or `inline-source-map` or `eval-source-map`
_for production)_ Use`cheap-module-source-map`

각 옵션들에 대한 상세한 내용은 링크를 첨부합니다.
[> Webpack devtool source map>](http://cheng.logdown.com/posts/2016/03/25/679045)
[> (webpack) devtool 옵션 퍼포먼스>](https://perfectacle.github.io/2016/11/14/Webpack-devtool-option-Performance/)

</br>

### env, EnvironmentPlugin
환경에 따라 webpack이 수행해줘야 할 작업이 달라질 수 있습니다. 여기서 말하는 `환경`이란, 개발을 진행하는 과정에서 webpack 작업인지, 배포하는 과정에서의 작업인지로 구분할 수 있습니다. webpack이 작동하는 환경은 기본적으로 `development`라는 string value로 설정되어 있습니다.
```js webpack.config.js
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'development',
    DEBUG: false
  })
```
bundle된 파일 전체에서 사용할 수 있는 상수를 만들어서 환경 변수로 사용할 수 있습니다. 이 때 `DefinePlugin`을 사용할 수 있습니다.
```js
  new webpack.DefinePlugin({
    'process.env.NODE_ENV' : JSON.stringify(process.env.NODE_ENV),
    'process.env.DEBUG' : JSON.stringify(process.env.DEBUG)
  })
```

특정한 환경을 위한 코드를 작성하는 경우, process.env.NODE_ENV를 통해 NODE_ENV의 값을 확인할 수 있습니다. 환경 변수의 값을 확인하는 작업은 성능 저하를 유발하므로 이러한 작업은 낮은 빈도로 실행해야 한다는 점에 주의하세오.

</br>

#### 마무리
이외에도 많은 옵션들이 존재합니다. [Webpack 공식 홈페이지](https://webpack.js.org/configuration/)에서 확인하실 수 있습니다 :)

_3편 end_

#### Reference
[Webpack configuration](https://webpack.js.org/configuration/)
[Webpack devtool 옵션 퍼포먼스](https://perfectacle.github.io/2016/11/14/Webpack-devtool-option-Performance/)
