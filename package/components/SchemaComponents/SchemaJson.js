import React, { Component, PureComponent } from 'react';
import {
  Dropdown,
  Menu,
  Row,
  Col,
  Form,
  Select,
  Checkbox,
  Button,
  Icon,
  Input,
  InputNumber,
  Modal,
  message,
  Tooltip
} from 'antd';
import FieldInput from './FieldInput'

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
import './schemaJson.css';
import _ from 'underscore';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { JSONPATH_JOIN_CHAR, SCHEMA_TYPE } from '../../utils.js';
const InputGroup = Input.Group;
import LocaleProvider from '../LocalProvider/index.js';
import utils from '../../utils';
import MockSelect from '../MockSelect/index.js';

const mapping = (name, data, showEdit, showAdv) => {
  switch (data.type) {
    case 'array':
      return <SchemaArray prefix={name} data={data} showEdit={showEdit} showAdv={showAdv} />;
      break;
    case 'object':
      let nameArray = [].concat(name, 'properties');
      return <SchemaObject prefix={nameArray} data={data} showEdit={showEdit} showAdv={showAdv} />;
      break;
    default:
      return null;
  }
};

class SchemaArray extends PureComponent {
  constructor(props, context) {
    super(props);
    this._tagPaddingLeftStyle = {};
    this.Model = context.Model.schema;

    this.descSpan = 2;
    this.minLengthSpan = 2;
    this.maxLengthSpan = 2;
    this.minimumSpan = 0;
    this.maximumSpan = 0;
    this.defaultSpan = 2;
    this.defaultBooleanSpan = 0;
    this.patternSpan = 2;
  }

  componentWillMount() {
    const { prefix } = this.props;
    let length = prefix.filter(name => name != 'properties').length;
    this.__tagPaddingLeftStyle = {
      paddingLeft: `${20 * (length + 1)}px`
    };
  }

  getPrefix() {
    return [].concat(this.props.prefix, 'items');
  }

  // 修改数据类型
  handleChangeType = value => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'type');
    this.Model.changeTypeAction({ key, value });

    if(value === "string") {
      this.descSpan = 2;
      this.minLengthSpan = 2;
      this.maxLengthSpan = 2;
      this.minimumSpan = 0;
      this.maximumSpan = 0;
      this.defaultSpan = 2;
      this.defaultBooleanSpan = 0;
      this.patternSpan = 2;
    } else if(value === "number" || value === "integer") {
      this.descSpan = 2;
      this.minLengthSpan = 0;
      this.maxLengthSpan = 0;
      this.minimumSpan = 2;
      this.maximumSpan = 2;
      this.defaultSpan = 2;
      this.defaultBooleanSpan = 0;
      this.patternSpan = 2;
    } else if(value === "array" || value === "object") {
      this.descSpan = 10;
      this.minLengthSpan = 0;
      this.maxLengthSpan = 0;
      this.minimumSpan = 0;
      this.maximumSpan = 0;
      this.defaultSpan = 0;
      this.defaultBooleanSpan = 0;
      this.patternSpan = 0;
    } else if(value === "boolean") {
      this.descSpan = 8;
      this.minLengthSpan = 0;
      this.maxLengthSpan = 0;
      this.minimumSpan = 0;
      this.maximumSpan = 0;
      this.defaultSpan = 0;
      this.defaultBooleanSpan = 2;
      this.patternSpan = 0;
    }
  };

  // 修改备注信息
  handleChangeDesc = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `description`);
    let value = e.target.value;
    this.Model.changeValueAction({ key, value });
  };

  // 修改minLength信息
  handleChangeMinLength = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'minLength');
    let value = e;
    this.Model.changeValueAction({ key, value });
  };

  // 修改maxLength信息
  handleChangeMaxLength = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'maxLength');
    let value = e;
    this.Model.changeValueAction({ key, value });
  };

  // 修改default信息
  handleChangeDefault = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'default');
    let value = e.target.value;
    this.Model.changeValueAction({ key, value });
  };

  // 修改default信息
  handleChangeDefaultBoolean = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'default');
    let value = e;
    if(value === 'true') {
      value = true;
    } else {
      value = false;
    }
    this.Model.changeValueAction({ key, value });
  };

  // 修改pattern信息
  handleChangePattern = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'pattern');
    let value = e.target.value;
    this.Model.changeValueAction({ key, value });
  };

  // 修改minimum信息
  handleChangeMinimum = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'minimum');
    let value = e;
    this.Model.changeValueAction({ key, value });

    if(value !== null && value !== '') {
      key = [].concat(prefix, 'exclusiveMinimum');
      value = true;
      this.Model.changeValueAction({ key, value });
    } else {
      key = [].concat(prefix, 'exclusiveMinimum');
      value = "";
      this.Model.changeValueAction({ key, value });
    }
  };

  // 修改maximum信息
  handleChangeMaximum = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'maximum');
    let value = e;
    this.Model.changeValueAction({ key, value });

    if(value !== null && value !== '') {
      key = [].concat(prefix, 'exclusiveMaximum');
      value = true;
      this.Model.changeValueAction({ key, value });
    } else {
      key = [].concat(prefix, 'exclusiveMaximum');
      value = "";
      this.Model.changeValueAction({ key, value });
    }
  };

  // 修改mock信息
  handleChangeMock = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `mock`);
    let value = e ? { mock: e } : '';
    this.Model.changeValueAction({ key, value });
  };

  // 增加子节点
  handleAddChildField = () => {
    let prefix = this.getPrefix();
    let keyArr = [].concat(prefix, 'properties');
    this.Model.addChildFieldAction({ key: keyArr });
    this.Model.setOpenValueAction({ key: keyArr, value: true });
  };

  handleClickIcon = () => {
    let prefix = this.getPrefix();
    // 数据存储在 properties.name.properties下
    let keyArr = [].concat(prefix, 'properties');
    this.Model.setOpenValueAction({ key: keyArr });
  };

  handleShowEdit = (name, type) => {
    let prefix = this.getPrefix();
    this.props.showEdit(prefix, name, this.props.data.items[name], type);
  };

  handleShowAdv = () => {
    this.props.showAdv(this.getPrefix(), this.props.data.items);
  };

  render() {
    const { data, prefix, showEdit, showAdv } = this.props;
    const items = data.items;
    let prefixArray = [].concat(prefix, 'items');

    let prefixArrayStr = [].concat(prefixArray, 'properties').join(JSONPATH_JOIN_CHAR);
    let showIcon = this.context.getOpenValue([prefixArrayStr]);

    if(items.type === "string") {
      this.descSpan = 2;
      this.minLengthSpan = 2;
      this.maxLengthSpan = 2;
      this.minimumSpan = 0;
      this.maximumSpan = 0;
      this.defaultSpan = 2;
      this.defaultBooleanSpan = 0;
      this.patternSpan = 2;
    } else if(items.type === "number" || items.type === "integer") {
      this.descSpan = 2;
      this.minLengthSpan = 0;
      this.maxLengthSpan = 0;
      this.minimumSpan = 2;
      this.maximumSpan = 2;
      this.defaultSpan = 2;
      this.defaultBooleanSpan = 0;
      this.patternSpan = 2;
    } else if(items.type === "array" || items.type === "object") {
      this.descSpan = 10;
      this.minLengthSpan = 0;
      this.maxLengthSpan = 0;
      this.minimumSpan = 0;
      this.maximumSpan = 0;
      this.defaultSpan = 0;
      this.defaultBooleanSpan = 0;
      this.patternSpan = 0;
    } else if(items.type === "boolean") {
      this.descSpan = 8;
      this.minLengthSpan = 0;
      this.maxLengthSpan = 0;
      this.minimumSpan = 0;
      this.maximumSpan = 0;
      this.defaultSpan = 0;
      this.defaultBooleanSpan = 2;
      this.patternSpan = 0;
    }

    return (
      !_.isUndefined(data.items) && (
        <div className="array-type">
          <Row className="array-item-type" type="flex" justify="space-around" align="middle">
            <Col
              span={this.context.isMock ? 6 : 8}
              className="col-item name-item col-item-name"
              style={this.__tagPaddingLeftStyle}
            >
              <Row type="flex" justify="space-around" align="middle">
                <Col span={2} className="down-style-col">
                  {items.type === 'object' ? (
                    <span className="down-style" onClick={this.handleClickIcon}>
                      {showIcon ? (
                        <Icon className="icon-object" type="caret-down" />
                      ) : (
                        <Icon className="icon-object" type="caret-right" />
                      )}
                    </span>
                  ) : null}
                </Col>
                <Col span={22}>
                  <Input addonAfter={<Checkbox disabled />} disabled value="Items" />
                </Col>
              </Row>
            </Col>
            <Col span={2} className="col-item col-item-type">
              <Select
                name="itemtype"
                className="type-select-style"
                onChange={this.handleChangeType}
                value={items.type}
              >
                {SCHEMA_TYPE.map((item, index) => {
                  return (
                    <Option value={item} key={index}>
                      {item}
                    </Option>
                  );
                })}
              </Select>
            </Col>
            {this.context.isMock && (
              <Col span={3} className="col-item col-item-mock">
                
                <MockSelect
                  schema={items}
                  showEdit={() => this.handleShowEdit('mock', items.type)}
                  onChange={this.handleChangeMock}
                />
              </Col>
            )}
            <Col span={this.context.isMock ? this.descSpan : this.descSpan+1} className="col-item col-item-desc">
              <Input
                placeholder={LocaleProvider('description')}
                value={items.description}
                onChange={this.handleChangeDesc}
                title={LocaleProvider('description')}
              />
            </Col>
            <Col span={this.minLengthSpan} className="col-item col-item-minLength">
              <InputNumber
                  placeholder={LocaleProvider('minLength')}
                  value={items.minLength}
                  onChange={this.handleChangeMinLength}
                  title={LocaleProvider('minLength')}
                  style={{ width: '100%' }}
              />
            </Col>
            <Col span={this.maxLengthSpan} className="col-item col-item-maxLength">
              <InputNumber
                  placeholder={LocaleProvider('maxLength')}
                  value={items.maxLength}
                  onChange={this.handleChangeMaxLength}
                  title={LocaleProvider('maxLength')}
                  style={{ width: '100%' }}
              />
            </Col>
            <Col span={this.minimumSpan} className="col-item col-item-minimum">
              <InputNumber
                placeholder={LocaleProvider('minimum')}
                value={items.minimum}
                onChange={this.handleChangeMinimum}
                title={LocaleProvider('minimum')}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={this.maximumSpan} className="col-item col-item-maximum">
              <InputNumber
                placeholder={LocaleProvider('maximum')}
                value={items.maximum}
                onChange={this.handleChangeMaximum}
                title={LocaleProvider('maximum')}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={this.defaultSpan} className="col-item col-item-default">
              <Input
                placeholder={LocaleProvider('default')}
                value={items.default}
                onChange={this.handleChangeDefault}
                title={LocaleProvider('default')}
              />
            </Col>
            <Col span={this.defaultBooleanSpan} className="col-item col-item-defaultBoolean">
              <Select
                value={_.isUndefined(items.default) ? '' : items.default ? 'true' : 'false'}
                onChange={this.handleChangeDefaultBoolean}
                placeholder={LocaleProvider('default')}
                style={{ width: '100%' }}
              >
                <Option value="true">true</Option>
                <Option value="false">false</Option>
              </Select>
            </Col>
            <Col span={this.patternSpan} className="col-item col-item-pattern">
              <Input
                placeholder={LocaleProvider('pattern')}
                value={items.pattern}
                onChange={this.handleChangePattern}
                title={LocaleProvider('pattern')}
              />
            </Col>
            <Col span={3} className="col-item col-item-setting">
              <span className="adv-set" onClick={this.handleShowAdv}>
                <Tooltip placement="top" title={LocaleProvider('adv_setting')}>
                  <Icon type="setting" />
                </Tooltip>
              </span>

              {items.type === 'object' ? (
                <span onClick={this.handleAddChildField}>
                  <Tooltip placement="top" title={LocaleProvider('add_child_node')}>
                    <Icon type="plus" className="plus" />
                  </Tooltip>
                </span>
              ) : null}
            </Col>
          </Row>
          <div className="option-formStyle">{mapping(prefixArray, items, showEdit, showAdv)}</div>
        </div>
      )
    );
  }
}

SchemaArray.contextTypes = {
  getOpenValue: PropTypes.func,
  Model: PropTypes.object,
  isMock: PropTypes.bool
};

class SchemaItem extends PureComponent {
  constructor(props, context) {
    super(props);
    this._tagPaddingLeftStyle = {};
    // this.num = 0
    this.Model = context.Model.schema;

    this.descSpan = 2;
    this.minLengthSpan = 2;
    this.maxLengthSpan = 2;
    this.minimumSpan = 0;
    this.maximumSpan = 0;
    this.defaultSpan = 2;
    this.defaultBooleanSpan = 0;
    this.patternSpan = 2;
  }

  componentWillMount() {
    const { prefix } = this.props;
    let length = prefix.filter(name => name != 'properties').length;
    this.__tagPaddingLeftStyle = {
      paddingLeft: `${20 * (length + 1)}px`
    };
  }

  getPrefix() {
    return [].concat(this.props.prefix, this.props.name);
  }

  // 修改节点字段名
  handleChangeName = e => {
    const { data, prefix, name } = this.props;
    let value = e.target.value;

    if (data.properties[value] && typeof data.properties[value] === 'object') {
      return message.error(`The field "${value}" already exists.`);
    }

    this.Model.changeNameAction({ value, prefix, name });
  };

  // 修改备注信息
  handleChangeDesc = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'description');
    let value = e.target.value;
    this.Model.changeValueAction({ key, value });
  };
  
  // 修改minLength信息
  handleChangeMinLength = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'minLength');
    let value = e;
    this.Model.changeValueAction({ key, value });
  };

  // 修改maxLength信息
  handleChangeMaxLength = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'maxLength');
    let value = e;
    this.Model.changeValueAction({ key, value });
  };

  // 修改minimum信息
  handleChangeMinimum = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'minimum');
    let value = e;
    this.Model.changeValueAction({ key, value });

    if(value !== null && value !== '') {
      key = [].concat(prefix, 'exclusiveMinimum');
      value = true;
      this.Model.changeValueAction({ key, value });
    } else {
      key = [].concat(prefix, 'exclusiveMinimum');
      value = "";
      this.Model.changeValueAction({ key, value });
    }
  };

  // 修改maximum信息
  handleChangeMaximum = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'maximum');
    let value = e;
    this.Model.changeValueAction({ key, value });

    if(value !== null && value !== '') {
      key = [].concat(prefix, 'exclusiveMaximum');
      value = true;
      this.Model.changeValueAction({ key, value });
    } else {
      key = [].concat(prefix, 'exclusiveMaximum');
      value = "";
      this.Model.changeValueAction({ key, value });
    }
  };

  // 修改default信息
  handleChangeDefault = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'default');
    let value = e.target.value;
    this.Model.changeValueAction({ key, value });
  };

  // 修改default信息
  handleChangeDefaultBoolean = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'default');
    let value = e;
    if(value === 'true') {
      value = true;
    } else {
      value = false;
    }
    this.Model.changeValueAction({ key, value });
  };

  // 修改pattern信息
  handleChangePattern = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'pattern');
    let value = e.target.value;
    this.Model.changeValueAction({ key, value });
  };

  // 修改mock 信息
  handleChangeMock = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, `mock`);
    let value = e ? { mock: e } : '';
    this.Model.changeValueAction({ key, value });
  };

  // 修改数据类型
  handleChangeType = e => {
    let prefix = this.getPrefix();
    let key = [].concat(prefix, 'type');
    this.Model.changeTypeAction({ key, value: e });

    if(e === "string") {
      this.descSpan = 2;
      this.minLengthSpan = 2;
      this.maxLengthSpan = 2;
      this.minimumSpan = 0;
      this.maximumSpan = 0;
      this.defaultSpan = 2;
      this.defaultBooleanSpan = 0;
      this.patternSpan = 2;
    } else if(e === "number" || e === "integer") {
      this.descSpan = 2;
      this.minLengthSpan = 0;
      this.maxLengthSpan = 0;
      this.minimumSpan = 2;
      this.maximumSpan = 2;
      this.defaultSpan = 2;
      this.defaultBooleanSpan = 0;
      this.patternSpan = 2;
    } else if(e === "array" || e === "object") {
      this.descSpan = 10;
      this.minLengthSpan = 0;
      this.maxLengthSpan = 0;
      this.minimumSpan = 0;
      this.maximumSpan = 0;
      this.defaultSpan = 0;
      this.defaultBooleanSpan = 0;
      this.patternSpan = 0;
    } else if(e === "boolean") {
      this.descSpan = 8;
      this.minLengthSpan = 0;
      this.maxLengthSpan = 0;
      this.minimumSpan = 0;
      this.maximumSpan = 0;
      this.defaultSpan = 0;
      this.defaultBooleanSpan = 2;
      this.patternSpan = 0;
    }
  };

  // 删除节点
  handleDeleteItem = () => {
    const { prefix, name } = this.props;
    let nameArray = this.getPrefix();
    this.Model.deleteItemAction({ key: nameArray });
    this.Model.enableRequireAction({ prefix, name, required: false });
  };
  /*
  展示备注编辑弹窗
  editorName: 弹窗名称 ['description', 'mock']
  type: 如果当前字段是object || array showEdit 不可用
  */
  handleShowEdit = (editorName, type) => {
    const { data, name, showEdit } = this.props;

    showEdit(this.getPrefix(), editorName, data.properties[name][editorName], type);
  };

  // 展示高级设置弹窗
  handleShowAdv = () => {
    const { data, name, showAdv } = this.props;
    showAdv(this.getPrefix(), data.properties[name]);
  };

  //  增加子节点
  handleAddField = () => {
    const { prefix, name } = this.props;
    this.Model.addFieldAction({ prefix, name });
  };

  // 控制三角形按钮
  handleClickIcon = () => {
    let prefix = this.getPrefix();
    // 数据存储在 properties.xxx.properties 下
    let keyArr = [].concat(prefix, 'properties');
    this.Model.setOpenValueAction({ key: keyArr });
  };

  // 修改是否必须
  handleEnableRequire = e => {
    const { prefix, name } = this.props;
    let required = e.target.checked;
    // this.enableRequire(this.props.prefix, this.props.name, e.target.checked);
    this.Model.enableRequireAction({ prefix, name, required });
  };

  render() {
    let { name, data, prefix, showEdit, showAdv } = this.props;
    let value = data.properties[name];
    let prefixArray = [].concat(prefix, name);

    let prefixStr = prefix.join(JSONPATH_JOIN_CHAR);
    let prefixArrayStr = [].concat(prefixArray, 'properties').join(JSONPATH_JOIN_CHAR);
    let show = this.context.getOpenValue([prefixStr]);
    let showIcon = this.context.getOpenValue([prefixArrayStr]);
    
    if(value.type === "string") {
      this.descSpan = 2;
      this.minLengthSpan = 2;
      this.maxLengthSpan = 2;
      this.minimumSpan = 0;
      this.maximumSpan = 0;
      this.defaultSpan = 2;
      this.defaultBooleanSpan = 0;
      this.patternSpan = 2;
    } else if(value.type === "number" || value.type === "integer") {
      this.descSpan = 2;
      this.minLengthSpan = 0;
      this.maxLengthSpan = 0;
      this.minimumSpan = 2;
      this.maximumSpan = 2;
      this.defaultSpan = 2;
      this.defaultBooleanSpan = 0;
      this.patternSpan = 2;
    } else if(value.type === "array" || value.type === "object") {
      this.descSpan = 10;
      this.minLengthSpan = 0;
      this.maxLengthSpan = 0;
      this.minimumSpan = 0;
      this.maximumSpan = 0;
      this.defaultSpan = 0;
      this.defaultBooleanSpan = 0;
      this.patternSpan = 0;
    } else if(value.type === "boolean") {
      this.descSpan = 8;
      this.minLengthSpan = 0;
      this.maxLengthSpan = 0;
      this.minimumSpan = 0;
      this.maximumSpan = 0;
      this.defaultSpan = 0;
      this.defaultBooleanSpan = 2;
      this.patternSpan = 0;
    }

    return show ? (
      <div>
        <Row type="flex" justify="space-around" align="middle">
          <Col
            span={this.context.isMock ? 6 : 8}
            className="col-item name-item col-item-name"
            style={this.__tagPaddingLeftStyle}
          >
            <Row type="flex" justify="space-around" align="middle">
              <Col span={2} className="down-style-col">
                {value.type === 'object' ? (
                  <span className="down-style" onClick={this.handleClickIcon}>
                    {showIcon ? (
                      <Icon className="icon-object" type="caret-down" />
                    ) : (
                      <Icon className="icon-object" type="caret-right" />
                    )}
                  </span>
                ) : null}
              </Col>
              <Col span={22}>
                <FieldInput
                  addonAfter={
                    <Tooltip placement="top" title={LocaleProvider('required')}>
                      <Checkbox
                        onChange={this.handleEnableRequire}
                        checked={
                          _.isUndefined(data.required) ? false : data.required.indexOf(name) != -1
                        }
                      />
                    </Tooltip>
                  }
                  onChange={this.handleChangeName}
                  value={name}
                />
              </Col>
            </Row>
          </Col>

          <Col span={2} className="col-item col-item-type">
            <Select
              className="type-select-style"
              onChange={this.handleChangeType}
              value={value.type}
            >
              {SCHEMA_TYPE.map((item, index) => {
                return (
                  <Option value={item} key={index}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </Col>

          {this.context.isMock && (
            <Col span={3} className="col-item col-item-mock">
              {/* <Input
                addonAfter={
                  <Icon type="edit" onClick={() => this.handleShowEdit('mock', value.type)} />
                }
                placeholder={LocaleProvider('mock')}
                value={value.mock ? value.mock.mock : ''}
                onChange={this.handleChangeMock}
                disabled={value.type === 'object' || value.type === 'array'}
              /> */}
              <MockSelect
                schema={value}
                showEdit={() => this.handleShowEdit('mock', value.type)}
                onChange={this.handleChangeMock}
              />
            </Col>
          )}


          <Col span={this.context.isMock ? this.descSpan : this.descSpan+1} className="col-item col-item-desc">
            <Input
              placeholder={LocaleProvider('description')}
              value={value.description}
              onChange={this.handleChangeDesc}
              title={LocaleProvider('description')}
            />
          </Col>
          
          <Col span={this.minLengthSpan} className="col-item col-item-minLength">
            <InputNumber
                placeholder={LocaleProvider('minLength')}
                value={value.minLength}
                onChange={this.handleChangeMinLength}
                title={LocaleProvider('minLength')}
                style={{ width: '100%' }}
            />
          </Col>
          <Col span={this.maxLengthSpan} className="col-item col-item-maxLength">
            <InputNumber
                placeholder={LocaleProvider('maxLength')}
                value={value.maxLength}
                onChange={this.handleChangeMaxLength}
                title={LocaleProvider('maxLength')}
                style={{ width: '100%' }}
            />
          </Col>
          <Col span={this.minimumSpan} className="col-item col-item-minimum">
            <InputNumber
              placeholder={LocaleProvider('minimum')}
              value={value.minimum}
              onChange={this.handleChangeMinimum}
              title={LocaleProvider('minimum')}
              style={{ width: '100%' }}
              />
          </Col>
          <Col span={this.maximumSpan} className="col-item col-item-maximum">
            <InputNumber
              placeholder={LocaleProvider('maximum')}
              value={value.maximum}
              onChange={this.handleChangeMaximum}
              title={LocaleProvider('maximum')}
              style={{ width: '100%' }}
              />
          </Col>
          <Col span={this.defaultSpan} className="col-item col-item-default">
            <Input
              placeholder={LocaleProvider('default')}
              value={value.default}
              onChange={this.handleChangeDefault}
              title={LocaleProvider('default')}
            />
          </Col>
          <Col span={this.defaultBooleanSpan} className="col-item col-item-defaultBoolean">
            <Select
              value={_.isUndefined(value.default) ? '' : value.default ? 'true' : 'false'}
              onChange={this.handleChangeDefaultBoolean}
              placeholder={LocaleProvider('default')}
              style={{ width: '100%' }}
            >
              <Option value="true">true</Option>
              <Option value="false">false</Option>
            </Select>
          </Col>
          <Col span={this.patternSpan} className="col-item col-item-pattern">
            <Input
              placeholder={LocaleProvider('pattern')}
              value={value.pattern}
              onChange={this.handleChangePattern}
              title={LocaleProvider('pattern')}
            />
          </Col>

          <Col span={3} className="col-item col-item-setting">
            <span className="adv-set" onClick={this.handleShowAdv}>
              <Tooltip placement="top" title={LocaleProvider('adv_setting')}>
                <Icon type="setting" />
              </Tooltip>
            </span>
            <span className="delete-item" onClick={this.handleDeleteItem}>
              <Icon type="close" className="close" />
            </span>
            {value.type === 'object' ? (
              <DropPlus prefix={prefix} name={name} />
            ) : (
              <span onClick={this.handleAddField}>
                <Tooltip placement="top" title={LocaleProvider('add_sibling_node')}>
                  <Icon type="plus" className="plus" />
                </Tooltip>
              </span>
            )}
          </Col>
        </Row>
        <div className="option-formStyle">{mapping(prefixArray, value, showEdit, showAdv)}</div>
      </div>
    ) : null;
  }
}

SchemaItem.contextTypes = {
  getOpenValue: PropTypes.func,
  Model: PropTypes.object,
  isMock: PropTypes.bool
};

class SchemaObjectComponent extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      _.isEqual(nextProps.data, this.props.data) &&
      _.isEqual(nextProps.prefix, this.props.prefix) &&
      _.isEqual(nextProps.open, this.props.open)
    ) {
      return false;
    }
    return true;
  }

  render() {
    const { data, prefix, showEdit, showAdv } = this.props;
    return (
      <div className="object-style">
        {Object.keys(data.properties).map((name, index) => (
          <SchemaItem
            key={index}
            data={this.props.data}
            name={name}
            prefix={prefix}
            showEdit={showEdit}
            showAdv={showAdv}
          />
        ))}
      </div>
    );
  }
}

const SchemaObject = connect(state => ({
  open: state.schema.open
}))(SchemaObjectComponent);

const DropPlus = (props, context) => {
  const { prefix, name, add } = props;
  const Model = context.Model.schema;
  const menu = (
    <Menu>
      <Menu.Item>
        <span onClick={() => Model.addFieldAction({ prefix, name })}>
          {LocaleProvider('sibling_node')}
        </span>
      </Menu.Item>
      <Menu.Item>
        <span
          onClick={() => {
            Model.setOpenValueAction({ key: [].concat(prefix, name, 'properties'), value: true });
            Model.addChildFieldAction({ key: [].concat(prefix, name, 'properties') });
          }}
        >
          {LocaleProvider('child_node')}
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Tooltip placement="top" title={LocaleProvider('add_node')}>
      <Dropdown overlay={menu}>
        <Icon type="plus" className="plus" />
      </Dropdown>
    </Tooltip>
  );
};

DropPlus.contextTypes = {
  Model: PropTypes.object
};

const SchemaJson = props => {
  const item = mapping([], props.data, props.showEdit, props.showAdv);
  return <div className="schema-content">{item}</div>;
};

export default SchemaJson;
