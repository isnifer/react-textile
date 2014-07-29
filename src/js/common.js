/** @jsx React.DOM */
;(function (window, React, $, undefined) {

  var mountPoint = document.querySelector('.main'),
      url = 'data.json';

  /* MAIN COMPONENT START */

  var Main = React.createClass({
    getInitialState: function () {
      return {data: []};
    },
    loadData: function () {
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        success: function (data) {
          this.setState({data: data});
        }.bind(this),
        error: function (jqxhr, param2, param3) {
          console.error(jqxhr, param2, param3);
        }
      });
    },
    componentDidMount: function () {
        this.loadData();
    },
    render: function () {
        return (
            <div className="main__wrapper">
                <Sidebar data={this.state.data} />
                <Content data={this.state.data} />
            </div>
        );
    }
  });

  /* MAIN COMPONENT END */
  
  /* SIDEBAR COMPONENTS START */

  var Sidebar = React.createClass({
    render: function () {
        var items = this.props.data.map(function (item, i) {
            return <SidebarItem url={'#/product/' + i} title={item.title} />
        });
        return (
            <div className="sidebar">
                <ul className="sidebar__list">
                    {items}
                </ul>
                <div className="sidebar__all">Всего на ${this.props.all}</div>
                <button type="button" className="sidebar__btn btn btn-success">Отправить заказ менеджеру</button>
            </div>
        );
    }
  });

  var SidebarItem = React.createClass({
      render: function () {
          return (
              <li className="sidebar__item">
                  <a className="sidebar__link" href={this.props.url}>
                      {this.props.title}
                  </a>
              </li>
          );
      }
  });

  /* SIDEBAR COMPONENTS END */

  /* CONTENT COMPONENTS START */

  var Content = React.createClass({
    render: function () {
      var _this = this;
      var products = this.props.data.map(function (product) {
        return <Product sizeCallback={_this.props.sizeCallback} title={product.title} variants={product.variants} />
      });
      return (
        <div className="content">
          {products}
        </div>
      );
    }
  });

  var Product = React.createClass({
    render: function () {
      var _this = this;
      var variants = this.props.variants.map(function (variant) {
        return <Variant title={variant.title} sizes={variant.sizes} sizeCallback={_this.props.sizeCallback} />
      });
      return (
        <div className="product">
          <div className="product__stat">
            <div className="product__title">{this.props.title}</div>
          </div>
          <div className="product__variants">
            {variants}
          </div>
        </div>
      );
    }
  });

  var Variant = React.createClass({
    render: function () {
      var _this = this;
      var sizes = this.props.sizes.map(function (size) {
        return <VariantSize title={size.title} value={size.value} active={size.active} callback={_this.props.sizeCallback} />
      });
      return (
        <div className="variant">
          <div className="variant__title">{this.props.title}</div>
          <div className="variant__sizes g-clf">
            {sizes}
          </div>
        </div>
      );
    }
  });

  var VariantSize = React.createClass({
    getInitialState: function () {
      return {count: 0};
    },
    changeValue: function (e) {
      this.setState({count: e.target.value});
    },
    plusValue: function () {
      this.setState({count: this.state.count += 1});
    },
    minusValue: function () {
      this.setState({count: (this.state.count === 0) ? 0 : this.state.count -= 1});
    },
    render: function () {
      return (
        <div className={(this.props.active) ? 'size' : 'size size_state_inactive'}>
          <p className="size__title">{this.props.title}</p>
          <p className="size__price">{this.props.value}.-</p>
          <p className="size__counter g-clf">
            <i className="size__changer glyphicon glyphicon-minus" onClick={this.minusValue} />
            <input type="text" className="size__input" maxlength="4" value={this.state.count} disabled={!this.props.active} onChange={this.changeValue} /> 
            <i className="size__changer glyphicon glyphicon-plus" onClick={this.plusValue} />
          </p>
          <p className="size__value">{this.state.count * this.props.value}.-</p>
        </div>
      );
    }
  });

  /* CONTENT COMPONENTS END */

  React.renderComponent(<Main url={url} />, mountPoint);

}(window, window.React, window.jQuery));