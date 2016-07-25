/* TODO
  1. Use webpack and have components in seperate files to be bundled
  2. Pull all sub components (PostsBox, Post, Content) states to root component 
  3. Refactor repeated code for Comment component
*/

// react router initialization
var Router = ReactRouter.Router
var browserHistory = ReactRouter.browserHistory
var Route = ReactRouter.Route
var Link = ReactRouter.Link

// Navigation Bar component
var Nav = React.createClass({
  // load the subreddit clicked through API call on root component and change state
  loadSub(event){
    this.props.loadSub(event.target.innerHTML)
  },
  render(){
    // if signed in with Reddit, shows user name, otherwise show sign in link
    if (this.props.signedIn.isAuth) {
      var log = <a href='/auth/logout'>Hi, {this.props.signedIn.profile.name}!</a>
    } 
    else if (!this.props.signedIn.isAuth) {
      var log = <a href='/auth/reddit'>Sign In</a>
    }
    // render Navigation Bar component
    return (
      <div id="favorite">
        <Link to={`/front`}><div className='leftBlock' onClick={this.loadSub}>FRONT</div></Link>        
        <Link to={`/askreddit`}><div className='leftBlock' onClick={this.loadSub}>ASKREDDIT</div></Link>
        <Link to={`/funny`}><div className='leftBlock' onClick={this.loadSub}>FUNNY</div></Link>
        <Link to={`/iama`}><div className='leftBlock' onClick={this.loadSub}>IAMA</div></Link>
        <Link to={`/worldnews`}><div className='leftBlock' onClick={this.loadSub}>WORLDNEWS</div></Link>
        <Link to={`/pics`}><div className='leftBlock' onClick={this.loadSub}>PICS</div></Link>
        <Link to={`/todayilearned`}><div className='leftBlock' onClick={this.loadSub}>TODAYILEARNED</div></Link>
        <Link to={`/news`}><div className='leftBlock' onClick={this.loadSub}>NEWS</div></Link>
        <Link to={`/gaming`}><div className='leftBlock' onClick={this.loadSub}>GAMING</div></Link>
        <Link to={`/about`}><div className='rightBlock'>about</div></Link>
        <div className="rightBlock">
          {log}
        </div>
      </div>
    )
  }
});

// Dashboard component
var Dash = React.createClass({
  // clicking bubble view toggles bubble view state on root component
  toggleBubble(){
    this.props.toggleBubble()
  },
  // clicking split view toggles split view state on root component
  toggleSplit(){
    this.props.toggleSplit()
  },
  render(){
    // if front page of reddit, don't show subreddit name in dashboard div
    if (this.props.subreddit === 'front') {
      var style = {
        display: 'none'
      }
    }
    // render Dashboard component
    return (
      <div id="dash" className='container-fluid'>
        <div id='logo'><a href='/'><h2 className='lead'>Ikena</h2></a></div>
        <div id="switches">
          <div className='switch'>
            <img className='icon' src={'../images/bubble.png'} />
            <label className="switch">
              <input 
                type="checkbox" 
                value="bubble" 
                onChange={this.toggleBubble}
              />
              <div className="slider round"></div>
            </label>
          </div>
          <div className='switch'>
            <img className='icon' src={'../images/split.png'} />
            <label className="switch">
              <input 
                type="checkbox" 
                value="split" 
                onChange={this.toggleSplit}
              />
              <div className="slider round"></div>
            </label>
          </div>
        </div>
      </div>
    )
  }
});

// List of Posts component
var PostsBox = React.createClass({
  // voting history of user
  getInitialState(){
    return {
      votes: null
    }
  },
  // clicking on a post in list of posts updates the current post being viewed
  loadPost(id){
    this.props.updatePost(id)
  },
  // checks for voting history of user and setState
  componentWillMount(){
    $.getJSON('/api/history').done(function(data) {
      var hash ={};
      data.forEach(function(post){
        hash[post.post] = post.upvoted;
      })
      this.setState({
        votes: hash
      })
    }.bind(this))
  },
  render(){
    var posts = [];
    /* for each post, checks to see if that post (by post id) is voted in user history 
       and sets the voting status accordingly 
    */
    this.props.posts.forEach(function(post, index) {
      var upvoted;
      var downvoted;
      if (this.state.votes && this.state.votes[post.data.id]) {
        upvoted = true;
        downvoted = false;
      } else if (this.state.votes && this.state.votes[post.data.id]===false) {
        upvoted = false;
        downvoted = true;
      } else {
        upvoted = null;
        downvoted = null;
      };
      // push Post components
      posts.push(
        <Post 
          title={post.data.title} 
          score={post.data.score}
          id={post.data.id}
          thumbnail={post.data.thumbnail} 
          subreddit={post.data.subreddit}
          num_comments={post.data.num_comments}
          handleClick={this.loadPost}
          loadSub={this.props.loadSub}
          upvoted={upvoted}
          downvoted={downvoted}
          key={index}
        />
      );
    }.bind(this));
    // if split view is true, format div width to be half screen
    if (this.props.split) {
      var divStyle = {
        width: '49%',
      }      
    }
    // render List of Posts component
    return (
      <div id="postBox" style={divStyle}>
        <div>{posts}</div>
      </div>
    )
  }
});

// Single Post component
var Post = React.createClass({
  getInitialState(){
    return {
      upvoted: null,
      downvoted: null,
      score: this.props.score
    }
  },
  componentWillReceiveProps(nextProps){
    this.setState({
      upvoted: nextProps.upvoted,
      downvoted: nextProps.downvoted
    })
  },
  // clicking on a post brings the current post to view
  loadPost(){
    this.props.handleClick(this.props.id)
  },
  // clicking on a subreddit takes user to that subreddit
  loadSub(){
    this.props.loadSub(this.props.subreddit)
  },

  // handle upvoing
  upvote(){
    if (this.state.downvoted === null && this.state.upvoted === null) {
      $.getJSON('/api/upvote/' + this.props.id).done(function(data) {
      }.bind(this))
      this.setState({
        upvoted: true,
        downvoted: false,
        score: this.state.score + 1
      })
    } 
    else if (this.state.downvoted && !this.state.upvoted) {
      $.getJSON('/api/upvoteupdate/' + this.props.id).done(function(data) {
      }.bind(this))
      this.setState({
        upvoted: true,
        downvoted: false,
        score: this.state.score + 2
      })
    }
  },
  // handle downvoting
  downvote(){
    if (this.state.upvoted === null && this.state.downvoted === null) {
      $.getJSON('/api/downvote/' + this.props.id).done(function(data) {
      }.bind(this))
      this.setState({
        upvoted: false,
        downvoted: true,
        score: this.state.score - 1
      })    
    }
    else if (this.state.upvoted && !this.state.downvoted) {
      $.getJSON('/api/downvoteupdate/' + this.props.id).done(function(data) {
      }.bind(this))
      this.setState({
        upvoted: false,
        downvoted: true,
        score: this.state.score - 2
      })
    }
  },
  render(){
    // determines thumbnail to be used for each type of posts
    var thumbnail;
    if (this.props.thumbnail) {
      // for self posts
      if (this.props.thumbnail === 'self') {
        thumbnail = <div onClick={this.loadPost} className='thumbnails self'><p>Self</p></div> 
      } 
      // for link posts
      else if (this.props.thumbnail === 'default') {
        thumbnail = <div onClick={this.loadPost} className='thumbnails default'><p>Link</p></div> 
      }
      // for nsfw posts
      else if (this.props.thumbnail === 'nsfw') {
        thumbnail = <div onClick={this.loadPost} className='thumbnails nsfw'><p>NSFW</p></div> 
      }
      // otherwise use thumbnail from reddit API
      else {
        thumbnail = this.props.thumbnail.replace(/http/,'https')
        thumbnail = <img onClick={this.loadPost} className='thumbnails' src={thumbnail} />
      }
    } 
    // for posts with just text
    else thumbnail = <div onClick={this.loadPost} className='thumbnails text'><p>Text</p></div> 
    // set style for different vote conditions
    if (this.state.upvoted) {
      var scoreStyle = {
        color: 'green',
      }
      var upvoteStyle = {
        color: 'green'
      }
    }
    else if (this.state.downvoted) {
      var scoreStyle = {
        color: 'red'
      } 
      var downvoteStyle = {
        color: 'red'
      }
    }
    // render Post component
    return (
      <div className='posts clearfix'>
        <div className='post-col-left'>
          {thumbnail}
        </div>
        <div className='post-col-right'>
          <div className='row'>
            <p onClick={this.loadPost} className='title'>{this.props.title}</p>
          </div>
          <div className='row'>
            <p onClick={this.loadSub} className='subreddit'>{this.props.subreddit}</p>
          </div>
          <div className='row'>
            <div className='list'> 
              <p>
                <span className='score' style={scoreStyle}>
                  {this.state.score + ' '}
                </span>
                <span className="glyphicon glyphicon-triangle-top" aria-hidden="true"
                      onClick={this.upvote}
                      style={upvoteStyle}
                />
                <span className="glyphicon glyphicon-triangle-bottom" aria-hidden="true" 
                      onClick={this.downvote}
                      style={downvoteStyle}
                />
              </p>
            </div>
            <div className='list'>
              <p className='comments'>
                <span className="glyphicon glyphicon-comment" aria-hidden="true" />
                {' ' + this.props.num_comments} 
              </p>
            </div>
          </div>
        </div>
      </div>
  )}
});

// Single Post Content and Comments component
var ThreadBox = React.createClass({
  render(){
    // render only when API call to single post is resolved
    if (this.props.thread) {
      if (this.props.thread[0]) {
        // if split view is true, format div width to be half screen
        if (this.props.split) {
          var divStyle = {
            width: '49%'
          }
        }
        // render Single Post Content component
        return (
          <div id='threadBox' style={divStyle}>
            <Content content={this.props.thread[0].data.children[0].data} 
                     split={this.props.split} 
                     returnToPosts={this.props.returnToPosts}
                     comments={this.props.thread}
            />
            <Comments comments={this.props.thread[1].data.children} tier={1} />
          </div>
        )  
      }      
    }
    // otherwise show loading gif
    return <div id='threadBox' className='AlignerA'><img className='loading' src='../images/loading.gif'/></div>
  }
})

// Post Content component
var Content = React.createClass({
  getInitialState(){
    return {
      commentWeb: false
    }
  },
  // returns to list of posts
  backButton(){
    this.props.returnToPosts()
  },
  // opens comment web view
  commentWeb(){
    this.setState({
      commentWeb: true
    })
  },
  remove(){
  // closes comment web view
    this.setState({
      commentWeb: false
    })
  },
  render(){
    console.log(this.props.content.url)
    // if split view is false, add a back button to navigate back to list of posts
    if (!this.props.split) {
      var backButton = <input onClick={this.backButton} className='imageButton' type="image" src="../images/back.png" />
    }
    // if comment web view is set to true, creates a dialogue div that shows the comments
    // in D3 force layout
    if (this.state.commentWeb) {
      var dialogueDiv = <Force comments={this.props.comments} remove={this.remove} />
    }
    // handle various types of content provided by reddit API
    if (this.props.content.selftext) {
      var display = <p>{this.props.content.selftext}</p>
    } else if (/.gifv/.test(this.props.content.url)) {
      var display = <p><a href={this.props.content.url} target="_blank">Link to article</a></p>
    } else if (/.gif/.test(this.props.content.url)) {
      var display = <img src={this.props.content.url} />
    } else if (/.jpg/.test(this.props.content.url)) {
      var display = <img src={this.props.content.url} />
    } else if (!this.props.content.preview) {
      var display = <p><a href={this.props.content.url} target="_blank">Link to article</a></p>
    } else if (this.props.content.preview && !/imgur.com/.test(this.props.content.url)) {
      var display = <p><a href={this.props.content.url} target="_blank">Link to article</a></p>
    } else {
      var display = <p><a href={this.props.content.url} target="_blank">Link to article</a></p>
    }
    // render Post Content component
    return (
      <div id='content'>
        {dialogueDiv}
        <div>
          <div className='left'>
            <div className='contentHead'>
              <h3>{backButton} {this.props.content.title}</h3>
            </div>
            <div className='author'><p>by {this.props.content.author}</p></div>
          </div>
          <div className='right'>
            <a onClick={this.commentWeb}>
              <img className='forceButton' src='../images/force.png' />
            </a>
          </div>
        </div>
        <div id='display'>
          {display}
        </div>
      </div>
    )
  }
})

// Comments component
var Comments = React.createClass({
  render(){
    var comments = '';
      comments = this.props.comments.map(function(comment, index) {
        var divStyle = {
          borderColor: this.props.tier === 1 ? '#7EB57D' : 
                       this.props.tier === 2 ? '#FF9900' :
                       this.props.tier === 3 ? '#569EC9' :
                       this.props.tier === 4 ? '#FF0000' :
                       this.props.tier === 5 ? '#a500ff' : '#a500ff'
        } 
        var headStyle = {
          backgroundColor: this.props.tier === 1 ? '#F9FCF9' : 
                           this.props.tier === 2 ? '#FFFAF3' :
                           this.props.tier === 3 ? '#F7FBFD' :
                           this.props.tier === 4 ? '#fff7f7' :
                           this.props.tier === 5 ? '#fbf7ff' : '#fbf7ff'
        }
        if (comment.kind !== 'more') {
          if (comment.data.replies && this.props.tier < 5) {
            var tier = this.props.tier;
            tier++;
            return (
              <div className= 'comment' style={divStyle} key={index}>
                <div className= 'commentHead' style={headStyle}>
                  <div className='author'><p>{comment.data.author}</p></div>
                  <div className='score'>{comment.data.score}</div>
                </div>
                <div className= 'commentBody'>
                  <p>{comment.data.body}</p>
                </div>
                <Comments 
                  comments={comment.data.replies.data.children}
                  tier={tier}
                />
              </div>
            );     
          }
          else {
            return (
              <div className= 'comment' style={divStyle} key={index}>
                <div className= 'commentHead' style={headStyle}>
                  <div className='author'>{comment.data.author}</div>
                  <div className='score'>{comment.data.score}</div>
                </div>
                <div className= 'commentBody'>
                  <p>{comment.data.body}</p>
                </div>
              </div>
            );
          }
        }
      }.bind(this));
    // render Comments component
    return (
      <div>
        {comments}
      </div>
    )
  }
})

// Comment Web D3 Force Layout component
var Force = React.createClass({
  componentDidMount(){
    force.create(this.props.comments)
  },
  render(){
    return (
      <div>
        <div id='cover'></div>
        <div id="force"><button onClick={this.props.remove}>Back</button></div>
      </div>
    )
  }
})

// Bubble View D3 Pack Layout component
var Nodes = React.createClass({
  componentDidMount(){
    d3Chart.create('#nodes', {
      width: 1000,
      height: 1000
    }, this.props.posts);
  },
  componentDidUpdate(){
    d3Chart.create('#nodes', {
      width: 1000,
      height: 1000
    }, this.props.posts);
  },
  render(){
    // if split view is true, format div width to be half screen
    if (this.props.split) {
      var divStyle = {
        width: '49%',
        height: '100vh',
        float: 'left'
      }
    }
    return (
      <div id='nodes' style={divStyle}></div> 
    )
  }
})

// ROOT Component
var Root = React.createClass({
  getInitialState(){
    return {
      isAuth: false,
      posts: null,
      thread: null,
      bubble: false,
      split: false,
      sub: 'front',
      profile: null
    }
  },
  // set this authorization state and the post list state after API call resolves
  componentWillMount(){
    $.getJSON('https://www.reddit.com/.json?limit=50').done(function(data) {
      var firstData = data.data.children
      $.getJSON('/api/isAuth').done(function(res){
        this.setState({
          isAuth: res,
          posts: firstData
        })
      }.bind(this))
    }.bind(this),"json")  
  },
  // toggles between bubble or standard view of list of posts
  updateToggleBubble(){
    this.setState({
      bubble: !this.state.bubble
    });
  },
  // toggles between split view and non-split view
  updateToggleSplit(){
    if (!this.state.thread) {
      var id = this.state.posts[0].data.id
      console.log('API call for thread ', id)
      $.getJSON('https://www.reddit.com/' + id +'.json').done(function(data){
        this.setState({
          thread: data,
        })
      }.bind(this),"json")
    }
    this.setState({
      split: !this.state.split
    });
  },
  // load the list of posts associated with subreddit
  loadSub(sub){
    if (sub === 'FRONT') {
     $.getJSON('https://www.reddit.com/.json?limit=50').done(function(data){
       this.setState({
         sub: 'front',
         posts: data.data.children,
       })
     }.bind(this),"json") 
    }
    else {
      $.getJSON('https://www.reddit.com/r/' + sub +'.json?limit=50').done(function(data){
        this.setState({
          sub: sub.toLowerCase(),
          posts: data.data.children,
        })
      }.bind(this),"json")   
    }
  },
  // set the state for an individual post
  threadState(id){
    this.setState({
      thread: null
    })
    $.getJSON('https://www.reddit.com/' + id + '.json').done(function(data){
      this.setState({
        thread: data,
      })
    }.bind(this),"json")
  },
  clearThread(){
    this.setState({
      thread: null
    })
  },
  render(){
    var view;
    // view list of posts using bubble representation, no split screen
    if (this.state.bubble && !this.state.split) {
      view = <Nodes key='2' posts={this.state.posts} split={false}/>
    } 
    // view list of posts using bubbles representation and split screen
    else if (this.state.bubble && this.state.split) {
      view = [
        <Nodes key='2' posts={this.state.posts} split={true}/>,
        <ThreadBox key='1' thread={this.state.thread} split={true}/>
      ]
    }
    // standard view with split screen for list of posts and single post
    else if (!this.state.bubble && this.state.split) {
      view = [
        <PostsBox key='0' posts={this.state.posts} signedIn={this.state.isAuth} updatePost={this.threadState} split={true}/>, 
        <ThreadBox key='1' thread={this.state.thread} split={true}/>
      ]
    }
    // standard view on load, just displays list of posts
    // clicking on a post brings up the single post view
    else if (!this.state.bubble && !this.state.split) {
      if (!this.state.thread) {
        view = <PostsBox posts={this.state.posts} 
                         updatePost={this.threadState}
                         loadSub={this.loadSub}
                         signedIn={this.state.isAuth}
               />     
      }
      else if (this.state.thread) {
        view = <ThreadBox thread={this.state.thread} 
                          split={false} 
                          returnToPosts={this.clearThread}
               />
      }
    }
    // render only after API call for list of posts is resolved
    if (this.state.posts) {
      return (
        <div>
          <Nav signedIn={this.state.isAuth} loadSub={this.loadSub}/>
          <Dash 
            toggleBubble={this.updateToggleBubble}
            toggleSplit={this.updateToggleSplit}
            subreddit={this.state.sub}
          />
          <div className='container-fluid'>{view}</div>

        </div>
      )     
    }
    // otherwise display loading gif
    return <div className='Aligner'><img className='loading' src='../images/loading.gif'/></div>
  }
});

// About component
var About = React.createClass({
  getInitialState(){
    return {
      comments: null,
      commentWeb: false
    }
  },
  commentWeb(){
    this.setState({
      commentWeb: true
    })
  },
  remove(){
    this.setState({
      commentWeb: false
    })
  },
  componentWillMount(){
    $.getJSON('https://www.reddit.com/4uf9al.json').done(function(data){
      console.log(data);
      this.setState({
        comments: data,
      })
    }.bind(this),"json")
  },
  render(){
    if (this.state.commentWeb) {
      var dialogueDiv = <Force comments={this.state.comments} remove={this.remove} />
    }
    return (
      <div>
        <div className='container-fluid'>
          {dialogueDiv}
          <a href='/'>Return</a>
          <div className="panel panel panel-default">
            <div className="panel-heading"> 
              <div className="panel-default">About Ikena - a different way to view Reddit</div>
            </div>
            <div className="desc">Ikena means 'view' in Hawaiian. The goal was to create a cleaner Reddit experiece and to challenge myself with a project that's single page app and uses React. There are also some D3 visuals for Reddit comments. <a href='#' onClick={this.commentWeb}>Sample</a></div>         
          </div>
          <div className="panel panel panel-default">
            <div className="panel-heading">
              <div className="panel-default">Technologies used</div>
            </div>
            <div className="desc">React, React-Router, D3, Node.JS, Express, PostgreSQL</div>
          </div>
        </div>
      </div>
    )
  }
})

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={Root}>
    </Route>  
    <Route path="/about" component={About}>
    </Route>
  </Router>
), document.getElementById("root"));