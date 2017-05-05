# [Tool] Webpack2, 입문 가이드 1편

## Webpack이란 무엇인가
너무 유명해져서 더이상의 말은 필요없을 것 같습니다:) 이에 대해 잘 정리해놓은 문서도 정말 많구요! 이 포스팅에서는 `webpack.config.js` 파일의 구조에 집중할 예정입니다. 아래 Reference의 링크를 참고해주세요!

## Installation
```bash
$ npm install -g webpack
$ npm install --save-dev webpack webpack-dev-server
# or
$ yarn global add webpack
$ yarn add -D webpack webpack-dev-server
```
Webpack이 제공하는 기능 중 로컬에서도 사용해야 하는 플러그인이 존재하므로 로컬에도 설치해줍니다. 그리고 webpack의 결과물을 확인하기 위해 서버를 띄워야하므로 `webpack-dev-server`도 함께 설치해줍니다.
이제 config 파일을 파헤쳐봅니다...

## webpack.config.js
```js webpack.config.js
const config = {
  entry: [...],
  output: [...],
  module: [...],
  plugins: [...]
}
module.exports = config;
```
`webpack.config.js` 파일은 복잡해보이지만, `config` 객체를 정의하고 `module.exports` 구문을 통해 노출시킵니다. 모든 config 파일은 이런 구조로 `entry`, `output`, `module`, `plugins` 네 가지 설정을 **기본적인** 옵션을 제공합니다. `entry`, `output` option만 있을 때는 bundling 작업만 진행합니다.(이 두 option은 반드시 필요합니다.) 그럼, 각각에 대해서 알아봅니다.

### entry
webpack은 라이브러리 간의 의존성을 그래프(`dependency tree`)로 표현을 합니다. 이 그래프를 만들 때의 시작점을 `entry`라는 옵션을 통해 설정할 수 있습니다. 즉, webpack을 이용하여 bundle하고 build할 애플리케이션의 시작점을 설정하는 옵션이라고 할 수 있습니다.

#### Usage1: `entry: string|Array<string>`
`entry` 값으로는 `string` 또는 `배열`이 올 수 있습니다.
```js
const config = {
  entry: './path/to/my/entry/file.js'
};
```
배열을 사용하는 경우의 대표적인 경우로는 `react-hot-loader`를 사용하는 경우가 있습니다.

#### Usage2: `entry: {[entryChunkName: string]: string|Array<string>}`
`entry point`를 여러 개 설정해야 하는 경우에는 Object를 사용하여 지정할 수 있습니다.
```js
const config = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
};
```
다른 `entry point`에서 시작하므로 각각의 `entry point`에서 생성된 그래프는 **완전히 독립적인 그래프**가 됩니다. (이러는 경우 각각의 dependency tree에서 중복되는 코드들이 발생할 수 있는데 이 부분은 `commons-chunk-plugin`을 통해서 해결할 수 있습니다.)


### Output
`entry`로 지정된 파일로부터 bundling을 진행하고, 그 결과를 **어떻게 할지**를 설정합니다.
```js
const config = {
  entry: [...]
  output: {
    path: '/home/proj/dist',
    filename: 'bundle.js'
  }
};
```
bundling된 결과 파일의 이름을 `filename`으로 어디에 생성할지에 대한 정보를 `path`에 설정해줍니다. `path`에는 **절대 경로**를 통해 설정해줘야합니다. 그렇기 때문에 `__dirname`을 사용할 수 있습니다.
```js
const path = require('path');
const config = {
  entry: [...]
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  }
};
```
`path`라는 모듈을 사용해서 path를 지정해줄 수 있습니다. `.join()`, `.resolve()` 두 가지의 메소드는 약간의 차이는 있지만 `__dirname`을 사용하는 경우 두 메소드 둘 다 동일한 의도하는 값을 반환하기 때문에 둘 다 사용 가능합니다. 두 메소드에 차이는 [링크](http://stackoverflow.com/questions/35048686/difference-between-path-resolve-and-path-join-invocation)를 참고하시면 됩니다.
```js
const config = {
  entry: [...]
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
```
`path` 모듈을 통해 path를 정리한 후의 상태입니다.
<br/>
### module
`module` 옵션은 webpack을 통해 bundling을 진행할 때 처리해야 하는 task들을 실행할 때 사용합니다. ES5 문법을 사용하기 위해 먼저 `babel`을 통해 **transpile**을 해야 하는데 이 작업을 `babel-loader`를 통해 설정해줄 수 있습니다. 또 javascript 파일 뿐만 아니라 css 파일을 load해야하는 경우에는 `css-loader`를 사용할 수 있습니다.

#### module.rules
`rules`에 각종 loader들을 등록할 수 있습니다. 배열의 형태로 여러 loader들을 등록합니다.
```js
const config = {
    module: {
        rules: [{
            //...
        }]
    }
}
```
여기에서 `babel-loader`, `css-loader` 등이 설정됩니다. 하나의 `loader`당 하나의 Object로 추가할 수 있습니다.
```js
const config = {
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            include: path.join(__dirname, 'src'),
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['env', { module: false }]
                    ]
                }
            }]
        }]
    }
}
```
`babel-loader` 하나만 추가했습니다. (`babel-loader`를 사용하기 위해서는 `babel-core`, `babel-loader`, `babel-preset-env` 세 개의 모듈이 필요합니다. `babel-preset-env`의 `env`가 `es2015`, `es2016`, `es2017`, `latest`를 대체합니다.)

`test`를 통해 load할 파일을 지정하고, `exclude`와 `include`를 통해 `path`를 지정해줄 수 있습니다. 그리고 나서 사용할 module을 `use`를 통해 작성해 줍니다. `use` 안에는 `loader`와 `options`를 명시하여 loader에 대한 명세를 합니다. 이 `options`의 경우는 `babel`의 `.babelrc`파일로 따로 추출할 수 있습니다. `config.js` 파일이 과도하게 복잡해지는 것을 방지하기 위해서 loader에 대한 옵션은 따로 추출하는 것도 좋은 방법입니다.

`presets`에서 `{ module: false }`는 [tree shaking](https://webpack.js.org/guides/tree-shaking/)을 사용하는 옵션으로 bundling 결과로부터 사용되지 않은 코드를 삭제하어 파일 크기를 줄여줍니다.

```js
{
    test: /\.css$/,
    use: [
        'style-loader', 'css-loader'
    ]
}
```
`rules`에 위와 같은 객체를 추가해주면 css 파일을 load할 수 있습니다. (마찬가지로 `style-loader`, `css-loader` 두 가지를 install 해야합니다.)


다음 포스팅에서는 보다 효율적으로 개발을 도와주고 애플리케이션의 성능 향상에 도움을 주는 `Plugins`에 대해 알아보겠습니다 :)

_1편 end_

Reference>
[Webpack Tutorial](https://github.com/AriaFallah/WebpackTutorial/tree/master/ko-arahansa/part1)
[Webpack2와 모듈 번들링을 위한 초보자 가이드](https://github.com/FEDevelopers/tech.description/wiki/Webpack2%EC%99%80-%EB%AA%A8%EB%93%88%EB%B2%88%EB%93%A4%EB%A7%81%EC%9D%84-%EC%9C%84%ED%95%9C-%EC%B4%88%EB%B3%B4%EC%9E%90-%EA%B0%80%EC%9D%B4%EB%93%9C)
[Javascript 모듈화 도구, webpack](http://d2.naver.com/helloworld/0239818)
