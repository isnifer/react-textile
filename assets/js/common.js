/** @jsx React.DOM */
;(function (window, React, $, undefined) {

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
    sizeCallback: function (size, count, value) {
      var sizeTitle = size.props.title;
      var parentTitle = size.props.parentTitle;

      var tempData = this.state.data;

      var currentParrentIndex = tempData.findIndex(function (el, i) {
        return (el.title == parentTitle);
      });

      tempData[currentParrentIndex].count += count; 
      tempData[currentParrentIndex].value += value;
      
      this.setState({data: tempData});

      console.log(this.state.data);

    },
    componentDidMount: function () {
      this.loadData();
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
        return SidebarItem({url: '#/product/' + i, title: item.title, value: item.value, count: item.count})
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
        return Variant({title: variant.title, sizes: variant.sizes, parentTitle: _this.props.title, sizeCallback: _this.props.sizeCallback})
      });
      var overallItems = this.props.variants[0].sizes.map(function (size) {
        return ProductOverallItem({title: size.title})
      });
      return (
        React.DOM.div({className: "product"}, 
          React.DOM.div({className: "product__stat g-clf"}, 
            React.DOM.div({className: "product__title"}, this.props.title), 
            React.DOM.div({className: "product__overall"}, 
              React.DOM.div({className: "product__overall-title"}, "Общее количество:"), 
              overallItems
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
    render: function () {
      return (
        React.DOM.div({className: "product__overall-item"}, 
          React.DOM.div({className: "product__overall-item-title"}, this.props.title), 
          React.DOM.div({className: "product__overall-item-count"}, "шт")
        )
      );
    }
  });

  var Variant = React.createClass({displayName: 'Variant',
    render: function () {
      var _this = this;
      var sizes = this.props.sizes.map(function (size) {
        return VariantSize({title: size.title, price: size.price, active: size.active, parentTitle: _this.props.parentTitle, sizeCallback: _this.props.sizeCallback})
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
      return {
        count: 0,
        value: 0
      };
    },
    changeValue: function (e) {
      this.setState({
        count: e.target.value,
        value: e.target.value * this.props.price
      });
      this.props.sizeCallback(this, e.target.value, e.target.value * this.props.price);
    },
    plusValue: function () {
      var count = this.state.count + 1;
      var value = count * this.props.price;
      this.setState({
        count: count,
        value: value
      });
      this.props.sizeCallback(this, 1, this.props.price);
    },
    minusValue: function () {
      var count = (this.state.count === 0) ? 0 : this.state.count - 1;
      var value = count * this.props.price; 
      this.setState({
        count: count,
        value: value
      });
      this.props.sizeCallback(this, (this.state.count === 0) ? 0: -1, (this.state.count === 0) ? 0 : -this.props.price);
    },
    render: function () {
      return (
        React.DOM.div({className: (this.props.active) ? 'size' : 'size size_state_inactive'}, 
          React.DOM.p({className: "size__title"}, this.props.title), 
          React.DOM.p({className: "size__price"}, this.props.price, ".-"), 
          React.DOM.p({className: "size__counter g-clf"}, 
            React.DOM.i({className: "size__changer glyphicon glyphicon-minus", onClick: this.minusValue}), 
            React.DOM.input({type: "text", className: "size__input", maxLength: "4", value: this.state.count, disabled: !this.props.active, onChange: this.changeValue}), 
            React.DOM.i({className: "size__changer glyphicon glyphicon-plus", onClick: this.plusValue})
          ), 
          React.DOM.p({className: "size__value"}, this.state.value, ".-")
        )
      );
    }
  });

  /* CONTENT COMPONENTS END */

  React.renderComponent(Main({url: url}), mountPoint);

}(window, window.React, window.jQuery));