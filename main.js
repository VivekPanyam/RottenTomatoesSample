/** @jsx React.DOM */

var React = require('react');
var ReactCanvas = require('react-canvas');
var ImageCache = require('react-canvas/lib/ImageCache');

var Surface = ReactCanvas.Surface;
var Group = ReactCanvas.Group;
var Image = ReactCanvas.Image;
var Text = ReactCanvas.Text;
var FontFace = ReactCanvas.FontFace;
var ListView = ReactCanvas.ListView;

var TEXT_SCROLL_SPEED_MULTIPLIER = 0.6;
var TEXT_ALPHA_SPEED_OUT_MULTIPLIER = 1.25;
var TEXT_ALPHA_SPEED_IN_MULTIPLIER = 2.6;
var IMAGE_LAYER_INDEX = 2;
var TEXT_LAYER_INDEX = 1;


var Item = React.createClass({

  componentDidMount: function () {
    window.addEventListener('resize', this.handleResize, true);
  },

  render: function () {
    var size = this.getSize();
    return (
      <Group style={this.getPageStyle()}>
        <Image src={this.props.movie.img} style={this.getImageStyle()} fadeIn={true} />
        <Image src="gradient1.png" style={this.getGradientStyle()} fadeIn={true} useBackingStore={true} />
        <Group style={this.getDescriptionStyle()} useBackingStore={true}>
          <Text style={this.getTitleStyle()}>{this.props.movie.title}</Text>
          <Text style={this.getTextStyle()}>({this.props.movie.year})</Text>

          <Text style={this.getTextStyle()}>{this.props.movie.duration} min</Text>
          <Text style={this.getTextStyle()}>Tomatometer: {this.props.movie.score}%</Text>
        </Group>
      </Group>
    );
  },

  // Styles
  // ======

  getSize: function () {
    return document.getElementById('main').getBoundingClientRect();
  },

  getPageStyle: function () {
    var size = this.getSize();
    return {
      position: 'relative',
      width: size.width,
      height: size.height,
      backgroundColor: '#f7f7f7',
      flexDirection: 'column'
    };
  },

  getDescriptionStyle: function () {
    var size = this.getSize();

    var translateY = 0;
    var alphaMultiplier = (this.props.scrollTop <= 0) ? -TEXT_ALPHA_SPEED_OUT_MULTIPLIER : TEXT_ALPHA_SPEED_IN_MULTIPLIER;
    var alpha = 1 - (this.props.scrollTop / this.props.height) * alphaMultiplier;
    alpha = Math.min(Math.max(alpha, 0), 1);
    translateY = -this.props.scrollTop * TEXT_SCROLL_SPEED_MULTIPLIER;


    return {
      position: 'absolute',
      bottom: 0,
      alpha: alpha,
      translateY: translateY,
      left: 0,
      width: size.width,
      padding: 20,
      flexDirection: 'column'
    };
  },

  getGradientStyle: function () {
    var size = this.getSize();
    return {
      position: 'absolute',
      bottom: 0,
      height: size.width,
      width: size.width,
      left: 0
    };
  },

  getImageStyle: function () {
    var size = this.getSize();
    return {
      position: 'absolute',
      bottom: 0,
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: '#eee'
    };
  },

  getTitleStyle: function () {
    return {
      fontFace: FontFace('Open Sans', null, {weight: 700}),
      fontSize: 18,
      lineHeight: 28,
      height: 28,
      color: 'white'
    };
  },

  getTextStyle: function () {
    return {
      fontFace: FontFace('Open Sans', null, {weight: 400}),
      fontSize: 12,
      lineHeight: 28,
      height: 28,
      color: 'white'
    };
  },

  // Events
  // ======

  handleResize: function () {
    this.forceUpdate();
  }

});

var App = React.createClass({

  render: function () {
    var size = this.getSize();
    return (
      <Surface top={0} left={0} width={size.width} height={size.height} enableCSSLayout={true}>
        <ListView
          style={this.getListViewStyle()}
          snapping={true}
          scrollingDeceleration={0.92}
          scrollingPenetrationAcceleration={0.13}
          numberOfItemsGetter={this.getNumberOfPages}
          itemHeightGetter={this.getPageHeight}
          itemGetter={this.renderPage} />
        <Group style={this.getListViewStyle()} useBackingStore={true}>
          <Image src="gradient2.png" style={this.getGradientStyle()} fadeIn={true} />
          <Image src="http://d3biamo577v4eu.cloudfront.net/static/images/trademark/rottentomatoes_logo_40.png" style={this.getLogoStyle()} fadeIn={true} />
        </Group>
      </Surface>
    );
  },

  renderPage: function (pageIndex, scrollTop) {
    var size = this.getSize();
    var movie = this.props.movies[pageIndex % this.props.movies.length];
    var pageScrollTop = pageIndex * this.getPageHeight() - scrollTop;
    return (
      <Item movie={movie} scrollTop={pageScrollTop} height={size.height} />
    );
  },

  getSize: function () {
    return document.getElementById('main').getBoundingClientRect();
  },

  // ListView
  // ========

  getLogoStyle: function () {
    var size = this.getSize();
    return {
      position: 'absolute',
      top: 5,
      right: 5,
      width: 123,
      height: 40
    };
  },

  getGradientStyle: function () {
    var size = this.getSize();
    return {
      position: 'absolute',
      top: 0,
      right: 0,
      width: size.width/2,
      height: size.width/2
    };
  },

  getListViewStyle: function () {
    var size = this.getSize();
    return {
      top: 0,
      left: 0,
      width: size.width,
      height: size.height
    };
  },

  getNumberOfPages: function () {
    return this.props.movies.length;
  },

  getPageHeight: function () {
    return this.getSize().height;
  }

});


$.getJSON( "http://api.rottentomatoes.com/api/public/v1.0/lists/dvds/top_rentals.json?apikey=r26waht7tp9dj8vw3m724f2f&limit=50&callback=?", function( data ) {
    data = data.movies;
    var movies = [];
    for (var i =0; i < data.length; i++) {
      var m = data[i];
      movies.push({
        title: m.title,
        duration: m.runtime,
        score: m.ratings.critics_score,
        img: m.posters.original.replace("_tmb", "_800"), // get a larger picture than the thumbnail
        year: m.year
      });

      // Naive preloading
      if (i < 10) {
        ImageCache.get(m.posters.original.replace("_tmb", "_800"));
      }
    }

  React.render(<App movies={movies} />, document.getElementById('main'));

});