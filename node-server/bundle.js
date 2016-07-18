/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../public";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	// var React = require('react')
	var Nav = React.createClass({
	  displayName: 'Nav',
	  render: function render() {
	    if (this.props.signedIn.isAuth) {
	      var log = React.createElement(
	        'a',
	        { href: '/auth/logout' },
	        'Logout'
	      );
	    } else if (!this.props.signedIn.isAuth) {
	      var log = React.createElement(
	        'a',
	        { href: '/auth/reddit' },
	        'Sign In'
	      );
	    }
	    return React.createElement(
	      'div',
	      { id: 'favorite' },
	      React.createElement(
	        'div',
	        { className: 'leftBlock' },
	        'FRONT'
	      ),
	      React.createElement(
	        'div',
	        { className: 'leftBlock' },
	        'ASKREDDIT'
	      ),
	      React.createElement(
	        'div',
	        { className: 'leftBlock' },
	        'FUNNY'
	      ),
	      React.createElement(
	        'div',
	        { className: 'leftBlock' },
	        'IAMA'
	      ),
	      React.createElement(
	        'div',
	        { className: 'leftBlock' },
	        'WORLDNEWS'
	      ),
	      React.createElement(
	        'div',
	        { className: 'leftBlock' },
	        'PICS'
	      ),
	      React.createElement(
	        'div',
	        { className: 'leftBlock' },
	        'TODAYILEARNED'
	      ),
	      React.createElement(
	        'div',
	        { className: 'leftBlock' },
	        'NEWS'
	      ),
	      React.createElement(
	        'div',
	        { className: 'leftBlock' },
	        'GAMING'
	      ),
	      React.createElement(
	        'div',
	        { className: 'rightBlock' },
	        log
	      )
	    );
	  }
	});

	var Dash = React.createClass({
	  displayName: 'Dash',
	  toggleBubble: function toggleBubble() {
	    this.props.toggleBubble();
	  },
	  toggleSplit: function toggleSplit() {
	    this.props.toggleSplit();
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      { id: 'dash', className: 'container-fluid' },
	      React.createElement(
	        'h2',
	        { id: 'subreddit', className: 'lead' },
	        this.props.subreddit
	      ),
	      React.createElement(
	        'div',
	        { id: 'switches' },
	        React.createElement(
	          'div',
	          { className: 'switch' },
	          React.createElement('img', { className: 'icon', src: '../images/bubble.png' }),
	          React.createElement(
	            'label',
	            { className: 'switch' },
	            React.createElement('input', {
	              type: 'checkbox',
	              value: 'bubble',
	              onChange: this.toggleBubble
	            }),
	            React.createElement('div', { className: 'slider round' })
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'switch' },
	          React.createElement('img', { className: 'icon', src: '../images/split.png' }),
	          React.createElement(
	            'label',
	            { className: 'switch' },
	            React.createElement('input', {
	              type: 'checkbox',
	              value: 'split',
	              onChange: this.toggleSplit
	            }),
	            React.createElement('div', { className: 'slider round' })
	          )
	        )
	      )
	    );
	  }
	});

	var PostsBox = React.createClass({
	  displayName: 'PostsBox',
	  loadPost: function loadPost(id) {
	    this.props.updatePost(id);
	  },
	  render: function render() {
	    var posts = [];
	    this.props.posts.forEach(function (post, index) {
	      posts.push(React.createElement(Post, {
	        title: post.data.title,
	        score: post.data.score,
	        id: post.data.id,
	        thumbnail: post.data.thumbnail,
	        subreddit: post.data.subreddit,
	        num_comments: post.data.num_comments,
	        handleClick: this.loadPost,
	        loadSub: this.props.loadSub,
	        key: index
	      }));
	    }.bind(this));
	    if (this.props.split) {
	      var divStyle = {
	        width: '49%'
	      };
	    }
	    return React.createElement(
	      'div',
	      { id: 'postBox', style: divStyle },
	      React.createElement(Category, null),
	      React.createElement(
	        'div',
	        null,
	        posts
	      )
	    );
	  }
	});

	var Post = React.createClass({
	  displayName: 'Post',
	  getInitialState: function getInitialState() {
	    return {
	      upvoted: false,
	      downvoted: false,
	      score: this.props.score
	    };
	  },


	  // click post to load the post comment thread
	  loadPost: function loadPost() {
	    this.props.handleClick(this.props.id);
	  },
	  loadSub: function loadSub() {
	    this.props.loadSub(this.props.subreddit);
	  },


	  // handle upvote
	  upvote: function upvote() {
	    if (!this.state.downvoted && !this.state.upvoted) {
	      this.setState({
	        upvoted: true,
	        downvoted: false,
	        score: this.state.score + 1
	      });
	    } else if (this.state.downvoted && !this.state.upvoted) {
	      this.setState({
	        upvoted: true,
	        downvoted: false,
	        score: this.state.score + 2
	      });
	    }
	  },


	  // handle downvote
	  downvote: function downvote() {
	    if (!this.state.upvoted && !this.state.downvoted) {
	      this.setState({
	        upvoted: false,
	        downvoted: true,
	        score: this.state.score - 1
	      });
	    } else if (this.state.upvoted && !this.state.downvoted) {
	      this.setState({
	        upvoted: false,
	        downvoted: true,
	        score: this.state.score - 2
	      });
	    }
	  },
	  render: function render() {
	    // determines thumbnail to be used for each post
	    var thumbnail;
	    if (this.props.thumbnail) {
	      if (this.props.thumbnail === 'self') {
	        thumbnail = React.createElement(
	          'div',
	          { className: 'thumbnails self' },
	          'Self'
	        );
	      } else if (this.props.thumbnail === 'default') {
	        thumbnail = React.createElement(
	          'div',
	          { className: 'thumbnails default' },
	          'Link'
	        );
	      } else if (this.props.thumbnail === 'nsfw') {
	        thumbnail = React.createElement(
	          'div',
	          { className: 'thumbnails nsfw' },
	          'NSFW'
	        );
	      } else {
	        thumbnail = React.createElement('img', { className: 'thumbnails', src: this.props.thumbnail });
	      }
	    } else thumbnail = React.createElement(
	      'div',
	      { className: 'thumbnails text' },
	      'Text'
	    );

	    if (this.state.upvoted) {
	      var scoreStyle = {
	        color: 'green'
	      };
	      var upvoteStyle = {
	        color: 'green'
	      };
	    } else if (this.state.downvoted) {
	      var scoreStyle = {
	        color: 'red'
	      };
	      var downvoteStyle = {
	        color: 'red'
	      };
	    }

	    return React.createElement(
	      'div',
	      { className: 'posts clearfix' },
	      React.createElement(
	        'div',
	        { className: 'post-col-left' },
	        thumbnail
	      ),
	      React.createElement(
	        'div',
	        { className: 'post-col-right' },
	        React.createElement(
	          'div',
	          { className: 'row' },
	          React.createElement(
	            'p',
	            { onClick: this.loadPost, className: 'title' },
	            this.props.title
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'row' },
	          React.createElement(
	            'p',
	            { onClick: this.loadSub, className: 'subreddit' },
	            this.props.subreddit
	          )
	        ),
	        React.createElement(
	          'div',
	          { className: 'row' },
	          React.createElement(
	            'div',
	            { className: 'list' },
	            React.createElement(
	              'p',
	              null,
	              React.createElement(
	                'span',
	                { className: 'score', style: scoreStyle },
	                this.state.score + ' '
	              ),
	              React.createElement('span', { className: 'glyphicon glyphicon-triangle-top', 'aria-hidden': 'true',
	                onClick: this.upvote,
	                style: upvoteStyle
	              }),
	              React.createElement('span', { className: 'glyphicon glyphicon-triangle-bottom', 'aria-hidden': 'true',
	                onClick: this.downvote,
	                style: downvoteStyle
	              })
	            )
	          ),
	          React.createElement(
	            'div',
	            { className: 'list' },
	            React.createElement(
	              'p',
	              null,
	              React.createElement('span', { className: 'glyphicon glyphicon-comment', 'aria-hidden': 'true' }),
	              ' ' + this.props.num_comments
	            )
	          )
	        )
	      )
	    );
	  }
	});

	var Category = React.createClass({
	  displayName: 'Category',
	  render: function render() {
	    return React.createElement(
	      'p',
	      { className: 'lead' },
	      'All Posts'
	    );
	  }
	});

	var ThreadBox = React.createClass({
	  displayName: 'ThreadBox',
	  render: function render() {
	    if (this.props.thread) {
	      if (this.props.thread[0]) {
	        if (this.props.split) {
	          var divStyle = {
	            width: '49%'
	          };
	        }
	        return React.createElement(
	          'div',
	          { id: 'threadBox', style: divStyle },
	          React.createElement(Content, { content: this.props.thread[0].data.children[0].data,
	            split: this.props.split,
	            returnToPosts: this.props.returnToPosts,
	            comments: this.props.thread
	          }),
	          React.createElement(Comments, { comments: this.props.thread[1].data.children, tier: 1 })
	        );
	      }
	    }
	    return React.createElement(
	      'div',
	      { id: 'threadBox' },
	      React.createElement('img', { className: 'loading', src: '../images/loading.gif' })
	    );
	  }
	});

	var Content = React.createClass({
	  displayName: 'Content',
	  getInitialState: function getInitialState() {
	    return {
	      commentWeb: false
	    };
	  },
	  backButton: function backButton() {
	    this.props.returnToPosts();
	  },
	  commentWeb: function commentWeb() {
	    this.setState({
	      commentWeb: true
	    });
	  },
	  remove: function remove() {
	    this.setState({
	      commentWeb: false
	    });
	  },
	  render: function render() {
	    console.log(this.props.content.url);
	    // if split is not on, add a back button to navigate back
	    if (!this.props.split) {
	      var backButton = React.createElement(
	        'button',
	        { className: 'btn btn-default', onClick: this.backButton },
	        'Back'
	      );
	    }
	    if (this.state.commentWeb) {
	      var dialogueDiv = React.createElement(Force, { comments: this.props.comments, remove: this.remove });
	    }
	    return React.createElement(
	      'div',
	      { id: 'content' },
	      dialogueDiv,
	      React.createElement(
	        'div',
	        { className: 'contentHead' },
	        backButton,
	        React.createElement(
	          'h3',
	          null,
	          this.props.content.title,
	          React.createElement(
	            'a',
	            { onClick: this.commentWeb },
	            'O'
	          )
	        )
	      ),
	      React.createElement(
	        'div',
	        { className: 'author' },
	        this.props.content.author
	      ),
	      React.createElement(
	        'div',
	        { className: 'score' },
	        this.props.content.score
	      ),
	      React.createElement(
	        'div',
	        { id: 'display' },
	        React.createElement('img', { src: this.props.content.url })
	      )
	    );
	  }
	});

	var Comments = React.createClass({
	  displayName: 'Comments',
	  render: function render() {
	    var comments = '';
	    comments = this.props.comments.map(function (comment, index) {
	      var divStyle = {
	        backgroundColor: this.props.tier % 2 === 0 ? '#f0f0f0' : 'white'
	      };
	      if (comment.kind !== 'more') {
	        if (comment.data.replies /* && this.props.tier < 3*/) {
	            var tier = this.props.tier;
	            tier++;
	            return React.createElement(
	              'div',
	              { className: 'comment', style: divStyle, key: index },
	              React.createElement(
	                'div',
	                { className: 'commentHead' },
	                React.createElement(
	                  'div',
	                  { className: 'author' },
	                  comment.data.author
	                ),
	                React.createElement(
	                  'div',
	                  { className: 'score' },
	                  comment.data.score
	                )
	              ),
	              React.createElement(
	                'div',
	                { className: 'commentBody' },
	                React.createElement(
	                  'p',
	                  null,
	                  comment.data.body
	                )
	              ),
	              React.createElement(Comments, {
	                comments: comment.data.replies.data.children,
	                tier: tier
	              })
	            );
	          } else {
	          return React.createElement(
	            'div',
	            { className: 'comment', style: divStyle, key: index },
	            React.createElement(
	              'div',
	              { className: 'commentHead' },
	              React.createElement(
	                'div',
	                { className: 'author' },
	                comment.data.author
	              ),
	              React.createElement(
	                'div',
	                { className: 'score' },
	                comment.data.score
	              )
	            ),
	            React.createElement(
	              'div',
	              { className: 'commentBody' },
	              React.createElement(
	                'p',
	                null,
	                comment.data.body
	              )
	            )
	          );
	        }
	      }
	    }.bind(this));
	    return React.createElement(
	      'div',
	      null,
	      comments
	    );
	  }
	});

	var Force = React.createClass({
	  displayName: 'Force',
	  componentDidMount: function componentDidMount() {
	    force.create(this.props.comments);
	  },
	  render: function render() {
	    return React.createElement(
	      'div',
	      { id: 'force' },
	      React.createElement(
	        'a',
	        { onClick: this.props.remove },
	        'Back'
	      )
	    );
	  }
	});

	var Nodes = React.createClass({
	  displayName: 'Nodes',
	  componentDidMount: function componentDidMount() {
	    d3Chart.create('#nodes', {
	      width: 1000,
	      height: 1000
	    }, this.props.posts);
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    console.log('componentDidUpdate');
	    d3Chart.create('#nodes', {
	      width: 1000,
	      height: 1000
	    }, this.props.posts);
	  },
	  render: function render() {
	    console.log('render');

	    if (this.props.split) {
	      var divStyle = {
	        width: '49%',
	        height: '100vh',
	        float: 'left'
	      };
	    }
	    return React.createElement('div', { id: 'nodes', style: divStyle });
	  }
	});

	// ROOT Component
	var Root = React.createClass({
	  displayName: 'Root',
	  getInitialState: function getInitialState() {
	    return {
	      isAuth: false,
	      posts: null,
	      thread: null,
	      bubble: false,
	      split: false,
	      sub: 'front'
	    };
	  },
	  componentWillMount: function componentWillMount() {
	    console.log('Root will Mount');
	    $.getJSON('https://www.reddit.com/.json?limit=50').done(function (data) {
	      console.log('API call for posts');
	      var firstData = data.data.children;
	      // this.setState({
	      // })
	      $.getJSON('/api/isAuth').done(function (res) {
	        this.setState({
	          isAuth: res,
	          posts: firstData
	        });
	      }.bind(this));
	    }.bind(this), "json");
	  },
	  componentDidMount: function componentDidMount() {
	    // setInterval(function(){
	    //   $.getJSON('https://www.reddit.com/.json?limit=75').done(function(data) {
	    //     console.log('updating API')
	    //     this.setState({
	    //       posts: data.data.children
	    //     })
	    //   }.bind(this),"json");  
	    // }.bind(this),10000)
	  },
	  updateToggleBubble: function updateToggleBubble() {
	    // update state
	    this.setState({
	      bubble: !this.state.bubble
	    });
	  },
	  updateToggleSplit: function updateToggleSplit() {
	    // update state
	    if (!this.state.thread) {
	      var id = this.state.posts[0].data.id;
	      console.log('API call for thread ', id);
	      $.getJSON('http://www.reddit.com/' + id + '.json').done(function (data) {
	        this.setState({
	          thread: data
	        });
	      }.bind(this), "json");
	    }
	    this.setState({
	      split: !this.state.split
	    });
	  },
	  loadSub: function loadSub(sub) {
	    $.getJSON('http://www.reddit.com/r/' + sub + '.json').done(function (data) {
	      this.setState({
	        sub: sub,
	        posts: data.data.children
	      });
	    }.bind(this), "json");
	  },
	  threadState: function threadState(id) {
	    this.setState({
	      thread: null
	    });
	    $.getJSON('http://www.reddit.com/' + id + '.json').done(function (data) {
	      this.setState({
	        thread: data
	      });
	    }.bind(this), "json");
	  },
	  clearThread: function clearThread() {
	    this.setState({
	      thread: null
	    });
	  },
	  render: function render() {
	    // $.getJSON('/auth/token').done(function(token){
	    //   console.log(token)
	    //   $.ajax({
	    //     url: 'https://oauth.reddit.com/api/v1/me/',
	    //     type: 'GET',
	    //     dataType: 'json',
	    //     success: function(response) { alert('hello!'); },
	    //     error: function() { alert('boo!'); },
	    //     headers: {
	    //       "Authorization":"bearer " + token.access_token,
	    //     }
	    //   });
	    // })
	    var view;

	    // view posts using bubbles, no split screen
	    if (this.state.bubble && !this.state.split) {
	      view = React.createElement(Nodes, { key: '2', posts: this.state.posts, split: false });
	    }

	    // view posts using bubbles and split screen
	    else if (this.state.bubble && this.state.split) {
	        view = [React.createElement(Nodes, { key: '2', posts: this.state.posts, split: true }), React.createElement(ThreadBox, { key: '1', thread: this.state.thread, split: true })];
	      }

	      // Standard view with split posts and comment thread
	      else if (!this.state.bubble && this.state.split) {
	          view = [React.createElement(PostsBox, { key: '0', posts: this.state.posts, updatePost: this.threadState, split: true }), React.createElement(ThreadBox, { key: '1', thread: this.state.thread, split: true })];
	        }
	        // Standard view on load, just displays list of posts
	        // Clicking on a post brings up the content and comments thread
	        else if (!this.state.bubble && !this.state.split) {
	            if (!this.state.thread) {
	              view = React.createElement(PostsBox, { posts: this.state.posts,
	                updatePost: this.threadState,
	                loadSub: this.loadSub
	              });
	            } else if (this.state.thread) {
	              view = React.createElement(ThreadBox, { thread: this.state.thread,
	                split: false,
	                returnToPosts: this.clearThread
	              });
	            }
	          }
	    if (this.state.posts) {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(Nav, { signedIn: this.state.isAuth }),
	        React.createElement(Dash, {
	          toggleBubble: this.updateToggleBubble,
	          toggleSplit: this.updateToggleSplit,
	          subreddit: this.state.sub
	        }),
	        React.createElement(
	          'div',
	          { className: 'container-fluid' },
	          view
	        )
	      );
	    }
	    return React.createElement(
	      'div',
	      null,
	      React.createElement('img', { className: 'loading', src: '../images/loading.gif' })
	    );
	  }
	});

	ReactDOM.render(React.createElement(Root, null), document.getElementById("root"));

/***/ }
/******/ ]);