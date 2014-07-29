/** @jsx React.DOM */
;(function (window, React, $, undefined) {

  var mountPoint = document.querySelector('.main'),
      url = 'data.json';

  /* MAIN COMPONENT START */

  var Main = React.createClass({displayName: 'Main',
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
            React.DOM.div({className: "main__wrapper"}, 
                Sidebar({data: this.state.data}), 
                Content({data: this.state.data})
            )
        );
    }
  });

  /* MAIN COMPONENT END */
  
  /* SIDEBAR COMPONENTS START */

  var Sidebar = React.createClass({displayName: 'Sidebar',
    render: function () {
        var items = this.props.data.map(function (item, i) {
            return SidebarItem({url: '#/product/' + i, title: item.title})
        });
        return (
            React.DOM.div({className: "sidebar"}, 
                React.DOM.ul({className: "sidebar__list"}, 
                    items
                ), 
                React.DOM.div({className: "sidebar__all"}, "Всего на $", this.props.all), 
                React.DOM.button({type: "button", className: "sidebar__btn btn btn-success"}, "Отправить заказ менеджеру")
            )
        );
    }
  });

  var SidebarItem = React.createClass({displayName: 'SidebarItem',
      render: function () {
          return (
              React.DOM.li({className: "sidebar__item"}, 
                  React.DOM.a({className: "sidebar__link", href: this.props.url}, 
                      this.props.title
                  )
              )
          );
      }
  });

  /* SIDEBAR COMPONENTS END */

  /* CONTENT COMPONENTS START */

  var Content = React.createClass({displayName: 'Content',
    render: function () {
      var _this = this;
      var products = this.props.data.map(function (product) {
        return Product({sizeCallback: _this.props.sizeCallback, title: product.title, variants: product.variants})
      });
      return (
        React.DOM.div({className: "content"}, 
          products
        )
      );
    }
  });

  var Product = React.createClass({displayName: 'Product',
    render: function () {
      var _this = this;
      var variants = this.props.variants.map(function (variant) {
        return Variant({title: variant.title, sizes: variant.sizes, sizeCallback: _this.props.sizeCallback})
      });
      return (
        React.DOM.div({className: "product"}, 
          React.DOM.div({className: "product__stat"}, 
            React.DOM.div({className: "product__title"}, this.props.title)
          ), 
          React.DOM.div({className: "product__variants"}, 
            variants
          )
        )
      );
    }
  });

  var Variant = React.createClass({displayName: 'Variant',
    render: function () {
      var _this = this;
      var sizes = this.props.sizes.map(function (size) {
        return VariantSize({title: size.title, value: size.value, active: size.active, callback: _this.props.sizeCallback})
      });
      return (
        React.DOM.div({className: "variant"}, 
          React.DOM.div({className: "variant__title"}, this.props.title), 
          React.DOM.div({className: "variant__sizes g-clf"}, 
            sizes
          )
        )
      );
    }
  });

  var VariantSize = React.createClass({displayName: 'VariantSize',
    getInitialState: function () {
      return {count: 0};
    },
    changeValue: function (e) {
      this.setState({count: e.target.value});
    },
    render: function () {
      return (
        React.DOM.div({className: (this.props.active) ? 'size' : 'size size_state_inactive'}, 
          React.DOM.p(null, this.props.title), 
          React.DOM.p(null, this.props.value, ".-"), 
          React.DOM.div({className: "size__counter"}, 
            React.DOM.i({className: "size__changer size__changer-minus"}), 
            React.DOM.input({type: "text", className: "size__input", value: this.state.count, disabled: !this.props.active, onChange: this.changeValue}), 
            React.DOM.i({className: "size__changer size__changer-plus"})
          ), 
          React.DOM.div({className: "size__value"}, 
            this.state.count * this.props.value, ".-"
          )
        )
      );
    }
  });

  /* CONTENT COMPONENTS END */

  React.renderComponent(Main({url: url}), mountPoint);

}(window, window.React, window.jQuery));