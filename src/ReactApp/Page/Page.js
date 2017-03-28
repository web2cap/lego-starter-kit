import React from 'react';
import _ from 'lodash';

const defaultState = {
  favicon: '/favicon.ico',
};

export default class Page {
  constructor(props = {}, context = {}) {
    this._page = true;
    this.state = Object.assign({}, defaultState);
    Object.assign(this.state, props);
    this.context = {};
    Object.assign(this.context, context);
    this.init();
  }

  async init() {
    if (this.state.titles) this.state.titles = [];
  }

  checkAuth() {
    // console.log('checkAuth',!!(this.context.uapp && this.context.uapp.rootState.user),this.context.uapp);
    return !!(this.context.uapp && this.context.uapp.rootState.user);
  }

  checkUserRole(role) {
    // if ()
    return !!(this.context.uapp && this.context.uapp.rootState.user &&
      (
        this.context.uapp.rootState.user.role === role ||
        this.context.uapp.rootState.user.username === 'me@coder24.ru'
      )
    );
  }

  setState(state = {}) {
    this.state = {
      ...this.state,
      ...state,
    };
  }

  getState() {
    return {
      ...this.state,
      component: this.render(),
    };
  }

  isAuth() {
    if (!this.checkAuth()) {
      return this
        .redirect('/auth/login?r=/return/back/url') // @TODO return back url
        .disable();
    }
    return this;
  }

  isUserRole(role) {
    if (!this.checkUserRole(role)) {
      return this
        .error('Доступ запрещен')
        .disable();
    }
    return this;
  }


  enable() {
    this.disabled = false;
    return true;
  }
  disable() {
    this.disabled = true;
    return true;
  }

  error(err) {
    if (this.disabled) return this;
    return this
      .layout(this.state.errorLayout)
      .title('ERROR!!!')
      .component(`Error: ${err}`);
  }

  next(next) {
    if (this.disabled) return this;
    return next()
    .catch((err) => {
      return this.error(err);
    });
  }

  title(...args) {
    return this.pushTitle(...args);
  }


  pushTitle(...args) {
    return this.meta({ title: args[0] });
  }

  composeMeta(metas = []) {
    return _.merge({}, ...metas);
  }

  getMeta(name, def = null) {
    if (name) return (this.state.meta || {})[name] || def;
    return this.state.meta || {};
  }

  meta(meta) {
    if (this.disabled) return this;
    if (!this.state.metas) this.state.metas = [];
    this.state.metas.push(meta);
    this.state.meta = this.composeMeta(this.state.metas);
    return this;
  }

  errorLayout(errorLayout) {
    if (this.disabled) return this;
    this.state.errorLayout = errorLayout;
    return this;
  }

  layout(layout) {
    if (this.disabled) return this;
    this.state.layout = layout;
    return this;
  }

  description(description) {
    console.log('Page.description() deprecated');
    return this;
  }

  component(...args) {
    if (this.disabled) return this;
    if (args.length > 1) {
      this.state.component = args;
    } else {
      this.state.component = args[0];
    }
    return this;
  }

  content(content) {
    if (this.disabled) return this;
    this.state.content = content;
    return this;
  }

  redirect(redirect) {
    if (this.disabled) return this;
    this.state.redirect = redirect;
    return this;
  }

  renderTitle() {
    return (this.state.metas || []).reverse().map(t => t.title).join(' - ');
  }

  renderOGMeta() {
    return `
<meta property="og:title" content="${this.getMeta('title')}" />
<meta property="og:description" content="${this.getMeta('description')}" />
<meta property="og:url" content="${this.getMeta('url')}" />
<meta property="og:image" content="https://richpreview.com/richpreview.png" />
`;
  }

  renderHead() {
    return `
<title>${this.renderTitle()}</title>
<meta charset="utf-8">
<meta http-equiv="x-ua-compatible" content="ie=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="description" content="${this.getMeta('description')}"/>
<meta property="og:description" content="Also want these pretty website previews?" />
${!this.state.favicon ? '' : `<link rel="shortcut icon" href="${this.state.favicon}" type="image/x-icon" />`}
${this.renderOGMeta()}
`;
  }

  renderFooter() {
    return '<!-- Page.renderFooter -->';
  }


  renderLayout(props = {}, layout = null) {
    if (!this.state.layout) {
      return props.children;
    }
    if (!layout) layout = this.state.layout;
    const Layout = layout;

    return <Layout {...props} />;
  }

  renderComponent() {
    if (!Array.isArray(this.state.component)) {
      return this.state.component;
    }
    return React.createElement(this.state.component[0], this.state.component[1]);
  }

  render() {
    return this.renderLayout({
      children: this.renderComponent(),
    });
  }

}
