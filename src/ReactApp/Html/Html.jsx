import React, { Component, PropTypes } from 'react';
// import useragent from 'useragent'
import _ from 'lodash';
import util from 'util';
import ReactDOM from 'react-dom/server';

export class Root extends Component {
  static childContextTypes = {
    history: PropTypes.object.isRequired,
    insertCss: PropTypes.func.isRequired,
    rootState: PropTypes.object.isRequired,
    setRootState: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = props.ctx.rootState || {};
  }

  componentDidMount() {
    const html = document.getElementsByTagName('html')[0];
    html.className = html.className.replace('ua_js_no', 'ua_js_yes');
  }

  getChildContext() {
    return {
      history: this.props.ctx && this.props.ctx.history || (() => {}),
      insertCss: this.props.ctx && this.props.ctx.insertCss || (() => {}),
      rootState: this.state,
      setRootState: (...args) => {
        this.setState(...args);
      },
    };
  }
  renderChildren() {
    const page = this.props.route;
    const component = page && page.render ? page.render() : page.component;
    return component;
  }
  render() {
    return this.renderChildren();
  }
}

export default class Html {

  static Root = Root;
  constructor(props) {
    this.props = props || {};
  }

  getHtmlClass(req) {
    const ua = {};// useragent.is(req.headers['user-agent'])
    ua.js = false;
    return _.map(ua, (val, key) => `ua_${key}_${val ? 'yes' : 'no'}`).join(' ') || '';
  }

  getRootState() {
    return this.props.ctx.rootState;
  }

  renderStyle() {
    // console.log('this.props.ctx', this.props.ctx);
    const styles = this.props.ctx.style || [];
    return `<style id="css">${(styles).join('\n')}</style>`;
  }
  renderHead() {
    const { page } = this.props;
    return `\
${page.renderHead()}
${this.renderAssets('css')}
${this.renderStyle()}
`;
  }
  renderRoot() {
    const Root = this.constructor.Root;
    const component = (<Root {...this.props} rootState={this.getRootState()}>
      {this.props.children}
    </Root>);
    return ReactDOM.renderToStaticMarkup(component);
  }

  renderAssets(type) {
    const props = this.props;

    if (type === 'css' && props.assets && props.assets.css) {
      return `<link rel="stylesheet" href="${props.assets.css}">`;
    }
    if (type === 'js' && props.assets && props.assets.js) {
      return `<script id="js" src="${props.assets.js}"></script>`;
    }
    return '';
  }

  renderFooter() {
    const { page } = this.props;
    const debug = __DEV__ && __SERVER__ ? `<!-- ${util.inspect({ ...this.props, style: undefined, req: undefined, ctx: null })} -->` : '';
    return `\
${this.props.footerHtml || ''}
${debug}
${page.renderFooter()}
    `;
  }

  render() {
    const root = this.renderRoot(); // because async style render
    return `\
<!doctype html>
<html class="${this.getHtmlClass(this.props.req)}">
  <head>
    ${this.renderHead()}
  </head>
  <body>
    <div id="root"/>
      ${root}
    </div>
    <script>
      window.__ROOT_STATE__ = ${JSON.stringify(this.getRootState())};
    </script>
    ${this.renderAssets('js')}
    ${this.renderFooter()}
  </body>
</html>
    `;
  }
}
