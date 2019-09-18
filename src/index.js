import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import 'antd/dist/antd.css';

if (process.env.NODE_ENV !== 'production') {
  window.Perf = require('react-addons-perf');
}
//import '../dist/main.css'
const jeditor = require('../package/index.js');
const mock = [
  { name: '字符串', mock: '@string' },
  { name: '自然数', mock: '@natural' },
  { name: '浮点数', mock: '@float' },
  { name: '字符', mock: '@character' },
  { name: '布尔', mock: '@boolean' },
  { name: 'url', mock: '@url' },
  { name: '域名', mock: '@domain' },
  { name: 'ip地址', mock: '@ip' },
  { name: 'id', mock: '@id' },
  { name: 'guid', mock: '@guid' },
  { name: '当前时间', mock: '@now' },
  { name: '时间戳', mock: '@timestamp' }
];

const JEditor1 = jeditor({mock: mock});

render(
  <div>
    <a target="_blank" href="https://github.com/YMFE/json-schema-editor-visual">
      <h1>JSON-Schema-Editor</h1>
    </a>
    <p style={{ fontSize: '16px' }}>
      A json-schema editor of high efficient and easy-to-use, base on React.{' '}
      <a target="_blank" href="https://github.com/YMFE/json-schema-editor-visual">
        Github
      </a>
    </p>
    <br />
    <h3>
      该工具已被用于开源接口管理平台：{' '}
      <a target="_blank" href="https://github.com/ymfe/yapi">
        YApi
      </a>
    </h3>

    <br />
    <h2>Example:</h2>
    <hr />

    <JEditor1
      showEditor={true}
      isMock={true}
      data={'{"type":"object","title":"emptyobject","properties":{"f1":{"type":"string","description":"desc1","minLength":1,"maxLength":100,"default":"default1","pattern":"^\\\\w+$"},"f2":{"type":"number","description":"desc2","minimum":1,"exclusiveMinimum":true,"maximum":500,"exclusiveMaximum":true,"default":"5","pattern":"^\\\\d+$"},"f3":{"type":"integer","description":"desc3","minimum":1,"exclusiveMinimum":true,"maximum":200,"exclusiveMaximum":true,"default":"10","pattern":"^\\\\d+$"},"f4":{"type":"boolean","description":"desc4","default":false},"f5":{"type":"object","properties":{"f6":{"type":"string","description":"desc6","minLength":1,"maxLength":100,"default":"default6","pattern":"^\\\\w+$"}},"description":"desc5","required":["f6"]},"f7":{"type":"array","items":{"type":"object","properties":{"f8":{"type":"string","description":"desc8","minLength":1,"maxLength":100,"default":"default8","pattern":"^\\\\w+$"}},"required":["f8"],"description":"itemDesc"},"description":"desc7"}},"description":"rootDesc","required":["f1","f2","f3","f4","f5","f7"]}'}
      onChange={e => {
        console.log('changeValue', e);
      }}
    />

    {/* <JEditor2
      showEditor={true}
      data={null}
      onChange={e => {
        // console.log("changeValue", e);
      }}
    /> */}
  </div>,
  document.getElementById('root')
);
