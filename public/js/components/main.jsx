
var Router = ReactRouter.Router
var browserHistory = ReactRouter.browserHistory
var Route = ReactRouter.Route
var Link = ReactRouter.Link

var Nav = React.createClass({
  loadSub(event){
    this.props.loadSub(event.target.innerHTML)
  },

  render(){
    if (this.props.signedIn.isAuth) {
      var log = <a href='/auth/logout'>Hi, {this.props.signedIn.profile.name}!</a>
    } 
    else if (!this.props.signedIn.isAuth) {
      var log = <a href='/auth/reddit'>Sign In</a>
    }
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
        <Link to={`/about`}><div className='leftBlock'>about</div></Link>
        <div className="rightBlock">
          {log}
        </div>
      </div>
    )
  }
});

var Dash = React.createClass({
  toggleBubble(){
    this.props.toggleBubble()
  },
  toggleSplit(){
    this.props.toggleSplit()
  },
  render(){
    return (
      <div id="dash" className='container-fluid'>
        <h2 id="subreddit" className='lead'>{this.props.subreddit}</h2>
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

var PostsBox = React.createClass({
  loadPost(id){
    this.props.updatePost(id)
  },
  render(){
    var posts = [];
    this.props.posts.forEach(function(post, index) {
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
          key={index}
        />
      );
    }.bind(this));
    if (this.props.split) {
      var divStyle = {
        width: '49%',
      }      
    }
    return (
      <div id="postBox" style={divStyle}>
        <div>{posts}</div>
      </div>
    )
  }
});

var Post = React.createClass({
  getInitialState(){
    return {
      upvoted: false,
      downvoted: false,
      score: this.props.score
    }
  },

  // click post to load the post comment thread
  loadPost(){
    this.props.handleClick(this.props.id)
  },

  loadSub(){
    this.props.loadSub(this.props.subreddit)
  },

  // handle upvote
  upvote(){
    if (!this.state.downvoted && !this.state.upvoted) {
      this.setState({
        upvoted: true,
        downvoted: false,
        score: this.state.score + 1
      })
    } 
    else if (this.state.downvoted && !this.state.upvoted) {
      this.setState({
        upvoted: true,
        downvoted: false,
        score: this.state.score + 2
      })
    }
  },

  // handle downvote
  downvote(){
    if (!this.state.upvoted && !this.state.downvoted) {
      this.setState({
        upvoted: false,
        downvoted: true,
        score: this.state.score - 1
      })    
    }
    else if (this.state.upvoted && !this.state.downvoted) {
      this.setState({
        upvoted: false,
        downvoted: true,
        score: this.state.score - 2
      })
    }
  },

  render(){
    // determines thumbnail to be used for each post
    var thumbnail;
    if (this.props.thumbnail) {
      if (this.props.thumbnail === 'self') {
        thumbnail = <div className='thumbnails self'>Self</div> 
      } 
      else if (this.props.thumbnail === 'default') {
        thumbnail = <div className='thumbnails default'>Link</div> 
      }
      else if (this.props.thumbnail === 'nsfw') {
        thumbnail = <div className='thumbnails nsfw'>NSFW</div> 
      }
      else {
        thumbnail = <img className='thumbnails' src={this.props.thumbnail} />
      }
    } else thumbnail = <div className='thumbnails text'>Text</div> 


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
              <p>
                <span className="glyphicon glyphicon-comment" aria-hidden="true" />
                {' ' + this.props.num_comments} 
              </p>
            </div>
          </div>
        </div>
      </div>
  )}
});

var ThreadBox = React.createClass({

  render(){
    if (this.props.thread) {
      if (this.props.thread[0]) {
        if (this.props.split) {
          var divStyle = {
            width: '49%'
          }
        }
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
    return <div id='threadBox' className='Aligner'><img className='loading' src='../images/loading.gif'/></div>
  }
})

var Content = React.createClass({
  getInitialState(){
    return {
      commentWeb: false
    }
  },
  backButton(){
    this.props.returnToPosts()
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
  render(){
    console.log(this.props.content.url)
    // if split is not on, add a back button to navigate back
    if (!this.props.split) {
      var backButton = <input onClick={this.backButton} className='imageButton' type="image" src="../images/back.png" />
    }
    if (this.state.commentWeb) {
      var dialogueDiv = <Force comments={this.props.comments} remove={this.remove} />
    }

    if (this.props.content.selftext) {
      var display = <p>{this.props.content.selftext}</p>
    }
      else if (/imgur.com/.test(this.props.content.url) && this.props.content.preview) {
      var display = <img src={this.props.content.url +".gif"} />
    } else if (/.gifv/.test(this.props.content.url)) {
      var display = <iframe class="imgur-embed" width="100%" height="100%" frameborder="0" src={this.props.content.url}></iframe>
    } else if (!this.props.content.preview) {
      var display = <p><a href={this.props.content.url} target="_blank">Link to article</a></p>
    } else if (this.props.content.preview && !/imgur.com/.test(this.props.content.url)) {
      var display = <p><a href={this.props.content.url} target="_blank">Link to article</a></p>
    }


    return (
      <div id='content'>
        {dialogueDiv}
        <div>
          <div className='left'>
            <div className='contentHead'>
              <h3>{backButton} {this.props.content.title}</h3>
            </div>
            <div className='author'>{this.props.content.author}</div>
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

var Comments = React.createClass({
  render(){
    var comments = '';
      comments = this.props.comments.map(function(comment, index) {
        var divStyle = {
          backgroundColor: this.props.tier % 2 === 0 ? '#f0f0f0' : 'white'
        }
        if (comment.kind !== 'more') {
          if (comment.data.replies/* && this.props.tier < 3*/) {
            var tier = this.props.tier;
            tier++;
            return (
              <div className= 'comment' style={divStyle} key={index}>
                  <div className= 'commentHead'>
                    <div className='author'>{comment.data.author}</div>
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
                  <div className= 'commentHead'>
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
    return (
      <div>
        {comments}
      </div>
    )
  }
})

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

var Nodes = React.createClass({
  componentDidMount(){
    d3Chart.create('#nodes', {
      width: 1000,
      height: 1000
    }, this.props.posts);
  },
  componentDidUpdate(){
    console.log('componentDidUpdate')
    d3Chart.create('#nodes', {
      width: 1000,
      height: 1000
    }, this.props.posts);
  },
  render(){
        console.log('render')

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
  componentWillMount(){
    console.log('Root will Mount')
    $.getJSON('https://www.reddit.com/.json?limit=50').done(function(data) {
      console.log('API call for posts')
      var firstData = data.data.children
      $.getJSON('/api/isAuth').done(function(res){
        this.setState({
          isAuth: res,
          posts: firstData
        })
      }.bind(this))
    }.bind(this),"json")  
  },
  componentDidMount(){
    // setInterval(function(){
    //   $.getJSON('https://www.reddit.com/.json?limit=75').done(function(data) {
    //     console.log('updating API')
    //     this.setState({
    //       posts: data.data.children
    //     })
    //   }.bind(this),"json");  
    // }.bind(this),10000)
  // },
  },
  updateToggleBubble(){
    // update state
    this.setState({
      bubble: !this.state.bubble
    });
  },
  updateToggleSplit(){
    // update state
    if (!this.state.thread) {
      var id = this.state.posts[0].data.id
      console.log('API call for thread ', id)
      $.getJSON('http://www.reddit.com/' + id +'.json').done(function(data){
        this.setState({
          thread: data,
        })
      }.bind(this),"json")
    }
    this.setState({
      split: !this.state.split
    });
  },
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
      $.getJSON('http://www.reddit.com/r/' + sub +'.json').done(function(data){
        this.setState({
          sub: sub.toLowerCase(),
          posts: data.data.children,
        })
      }.bind(this),"json")   
    }
  },
  threadState(id){
    this.setState({
      thread: null
    })
    $.getJSON('http://www.reddit.com/' + id + '.json').done(function(data){
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
      view = <Nodes key='2' posts={this.state.posts} split={false}/>
    } 

    // view posts using bubbles and split screen
    else if (this.state.bubble && this.state.split) {
      view = [
        <Nodes key='2' posts={this.state.posts} split={true}/>,
        <ThreadBox key='1' thread={this.state.thread} split={true}/>
      ]
    }

    // Standard view with split posts and comment thread
    else if (!this.state.bubble && this.state.split) {
      view = [
        <PostsBox key='0' posts={this.state.posts} updatePost={this.threadState} split={true}/>, 
        <ThreadBox key='1' thread={this.state.thread} split={true}/>
      ]
    }
    // Standard view on load, just displays list of posts
    // Clicking on a post brings up the content and comments thread
    else if (!this.state.bubble && !this.state.split) {
      if (!this.state.thread) {
        view = <PostsBox posts={this.state.posts} 
                         updatePost={this.threadState}
                         loadSub={this.loadSub}
                        />     
      }
      else if (this.state.thread) {
        view = <ThreadBox thread={this.state.thread} 
                          split={false} 
                          returnToPosts={this.clearThread}
               />
      }
    }
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
    return <div className='Aligner'><img className='loading' src='../images/loading.gif'/></div>
  }
});

var About = React.createClass({
  render(){
    return (<div>
      <div className="panel panel panel-default">
        <div className="panel-heading"> 
          <div className="panel-default">About Vision Therapy Online™</div>
        </div>
        <div className="desc">We had a dream of providing high-quality, cost-effective vision therapy that any patient could access at home. A group of web developers with a background in vision founded Vision Therapy Online like last week. More than 3 days later, we offer world-className products and services that connect patients with their eyecare professionals, as well as extend access to quality healthcare.</div>
      </div>
      <div className="panel panel panel-default">
        <div className="panel-heading">
          <div className="panel-default">Meet The Founders</div>
        </div>
        <div className="desc"> <img src="/images/meetTheDevs.jpg" alt="picture of the founders"/></div>
        <div className="desc">VTO was founded by Alex Chang, Katie Low, and Gunther Schneider</div>
      </div>
    </div>)
  }
})

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={Root}>
    </Route>
    <Route path="/askreddit" component={Root}>
    </Route>    
    <Route path="/about" component={About}>
    </Route>
  </Router>
), document.getElementById("root"));