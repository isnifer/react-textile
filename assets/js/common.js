/** @jsx React.DOM */
;(function (window, React, $, Router, undefined) {

  var mountPoint = document.querySelector('.main'),
      url = 'data.json';

  /* MAIN COMPONENT START */

  var Main = React.createClass({displayName: 'Main',
    getInitialState: function () {
      return {
        data: []
      };
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

    /*
      options.size - конкретный комплект расцветки
      options.count - diff количества 
      options.value - diff стоимости
      options.productId - id продукта
      options.variantId - id варианта
      options.key - id варианта
     */
    sizeCallback: function (options) {
      var currentData = this.state.data,
          product = currentData[options.productId],
          variant = product.variants[options.variantId],
          size = variant.sizes[options.key];

      product.count += options.count; 
      product.value += options.value;

      size.count += options.count;
      size.value += options.value;

      this.setState({data: currentData});
    },
    componentDidMount: function () {
      this.loadData();

      // Router
      var routes = {
        '/product/:id': function (id) {
          $('.product_state_visible').removeClass('product_state_visible');
          $('.product_' + id).addClass('product_state_visible');
        }
      };

      var router = Router(routes);
      router.init(); 
    },
    render: function () {
      return (
        React.DOM.div({className: "main__wrapper"}, 
          Sidebar({data: this.state.data}), 
          Content({data: this.state.data, sizeCallback: this.sizeCallback})
        )
      ); 
    }
  });

  /* MAIN COMPONENT END */
  
  /* SIDEBAR COMPONENTS START */

  var Sidebar = React.createClass({displayName: 'Sidebar',
    render: function () {
      var overall = this.props.data.reduce(function(prev, current) {
        return prev + current.value;
      }, 0);
      var items = this.props.data.map(function (item, i) {
        return SidebarItem({url: '#/product/' + i, title: item.title, key: i, value: item.value, count: item.count})
      });
      return (
        React.DOM.div({className: "sidebar"}, 
          React.DOM.div({className: "sidebar__list"}, 
            items
          ), 
          React.DOM.div({className: "sidebar__all"}, "Всего на ", overall, " руб."), 
          React.DOM.button({type: "button", className: "sidebar__btn btn btn-success"}, "Отправить заказ менеджеру")
        )
      );
    }
  });

  var SidebarItem = React.createClass({displayName: 'SidebarItem',
    render: function () {
      return (
        React.DOM.div({className: "sidebar__item"}, 
          React.DOM.a({className: "sidebar__link", href: this.props.url}, 
            this.props.title
          ), 
          React.DOM.div({className: "sidebar__choose"}, 
            "Выбрано ", this.props.count, " комплектов на ", this.props.value, " руб."
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
      var products = this.props.data.map(function (product, i) {
        return Product({sizeCallback: _this.props.sizeCallback, key: i, title: product.title, variants: product.variants, value: product.value})
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
      var variants = this.props.variants.map(function (variant, i) {
        return Variant({title: variant.title, sizes: variant.sizes, key: i, productId: _this.props.key, parentTitle: _this.props.title, sizeCallback: _this.props.sizeCallback})
      });
      var overallItems = this.props.variants[0].sizes.map(function (size, i) {
        return ProductOverallItem({title: size.title, key: i, variants: _this.props.variants, productId: _this.props.key})
      });
      return (
        React.DOM.div({className: this.props.key === 0 ? 'product product_' + this.props.key + ' product_state_visible' : 'product product_' + this.props.key}, 
          React.DOM.div({className: "product__stat g-clf"}, 
            React.DOM.div({className: "product__title"}, this.props.title), 
            React.DOM.div({className: "product__overall"}, 
              React.DOM.div({className: "product__overall-title"}, "Общее количество:"), 
              overallItems
            ), 
            React.DOM.div({className: "product__overall-value"}, 
              "= ", this.props.value, " руб."
            )
          ), 
          React.DOM.div({className: "product__variants"}, 
            variants
          )
        )
      );
    }
  });

  var ProductOverallItem = React.createClass({displayName: 'ProductOverallItem',
    getInitialState: function () {
      return {count: 0}
    },
    render: function () {
      var _this = this;
      return (
        React.DOM.div({className: "product__overall-item"}, 
          React.DOM.div({className: "product__overall-item-title"}, this.props.title), 
          React.DOM.div({className: "product__overall-item-count"}, 
            this.props.variants.reduce(function (prev, next) {
              return prev + next.sizes[_this.props.key].count;
            }, 0)
          )
        )
      );
    }
  });

  var Variant = React.createClass({displayName: 'Variant',
    render: function () {
      var _this = this;
      var sizes = this.props.sizes.map(function (size, i) {
        return VariantSize({title: size.title, price: size.price, key: i, variantId: _this.props.key, productId: _this.props.productId, active: size.active, parentTitle: _this.props.parentTitle, sizeCallback: _this.props.sizeCallback})
      });
      return (
        React.DOM.div({className: "variant g-clf"}, 
          React.DOM.div({className: "variant__info"}, 
            React.DOM.div({className: "variant__title"}, this.props.title), 
            React.DOM.img({src: "assets/img/150x150.gif"})
          ), 
          React.DOM.div({className: "variant__sizes g-clf"}, 
            sizes
          ), 
          React.DOM.div({className: "variant__overall"}, 
            "= ", this.props.sizes.reduce(function (prev, next) {
                return prev + next.value;
              }, 0), " руб."
          )
        )
      );
    }
  });

  var VariantSize = React.createClass({displayName: 'VariantSize',
    getInitialState: function () {
      return {
        count: 0,
        value: 0
      };
    },
    /*
      options.size - конкретный комплект расцветки
      options.count - diff количества 
      options.value - diff стоимости
      options.productId - id продукта
      options.variantId - id варианта
      options.key - id варианта
     */
    changeValue: function (e) {
      this.setState({
        count: e.target.value,
        value: e.target.value * this.props.price
      });
      this.props.sizeCallback({
        size: this, 
        count: e.target.value - this.state.count,
        value: (e.target.value - this.state.count) * this.props.price,
        productId: this.props.productId,
        variantId: this.props.variantId,
        key: this.props.key
      });
    },
    plusValue: function () {
      var count = this.state.count + 1;
      var value = count * this.props.price;
      this.setState({
        count: count,
        value: value
      });
      this.props.sizeCallback({
        size: this, 
        count: 1,
        value: this.props.price,
        productId: this.props.productId,
        variantId: this.props.variantId,
        key: this.props.key
      });
    },
    minusValue: function () {
      var count = (this.state.count === 0) ? 0 : this.state.count - 1;
      var value = count * this.props.price; 
      this.setState({
        count: count,
        value: value
      });
      this.props.sizeCallback({
        size: this, 
        count: (this.state.count === 0) ? 0: -1,
        value: (this.state.count === 0) ? 0 : -this.props.price,
        productId: this.props.productId,
        variantId: this.props.variantId,
        key: this.props.key
      });
    },
    render: function () {
      return (
        React.DOM.div({className: (this.props.active) ? 'size' : 'size size_state_inactive'}, 
          React.DOM.p({className: "size__title"}, this.props.title), 
          React.DOM.p({className: "size__price"}, this.props.price, ".-"), 
          React.DOM.p({className: "size__counter g-clf"}, 
            React.DOM.i({className: "size__changer glyphicon glyphicon-minus", onClick: (this.props.active) ? this.minusValue : false}), 
            React.DOM.input({type: "text", className: "size__input", maxLength: "4", value: this.state.count, disabled: !this.props.active, onChange: this.changeValue}), 
            React.DOM.i({className: "size__changer glyphicon glyphicon-plus", onClick: (this.props.active) ? this.plusValue : false})
          ), 
          React.DOM.p({className: "size__value"}, this.state.value, ".-")
        )
      );
    }
  });

  /* CONTENT COMPONENTS END */

  React.renderComponent(Main({url: url}), mountPoint);

}(window, window.React, window.jQuery, window.Router));