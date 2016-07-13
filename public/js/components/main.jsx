var Nav = React.createClass({
  render(){
    return (
      <div id="favorite">
        <a href='/auth/reddit'>Login</a>
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
        <h2 id="subreddit" className='lead'>FRONT</h2>
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
        <Category />
        <div>{posts}</div>
      </div>
    )
  }
});

var Post = React.createClass({
  loadPost(){
    this.props.handleClick(this.props.id)
  },
  render(){
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
    return (
      <div className='posts'>
        {thumbnail}
        <div>
          <p onClick={this.loadPost} className='title'>{this.props.title}</p>
          <p className='subreddit'>{this.props.subreddit}</p> 
          <p className='score'>{this.props.score} points | {this.props.num_comments} comments</p>
        </div>
      </div>
  )}
});

var Category = React.createClass({
  render(){
    return (
      <p className="lead">All Posts</p>
  )}
});

var ThreadBox = React.createClass({
  backButton(){
    this.props.returnToPosts()
  },
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
            <Content content={this.props.thread[0].data.children[0].data} split={this.props.split} />
            <Comments comments={this.props.thread[1].data.children} tier={1} />
            <Force comments={this.props.thread} />
          </div>
        )  
      }      
    }
    return <div id='threadBox'><img className='loading' src='../images/loading.gif'/></div>
  }
})

var Content = React.createClass({

  render(){
    console.log(this.props.content.url)
    // if split is not on, add a back button to navigate back
    if (!this.props.split) {
      var backButton = <button className='btn btn-default' onClick={this.backButton}>Back</button>
    }
    return (
      <div id='content'>
        <div className='contentHead'>
          <h3>{this.props.content.title}</h3>
        </div>
        <div className='author'>{this.props.content.author}</div>
        <div className='score'>{this.props.content.score}</div>
        <div id='display'>
          <img src={this.props.content.url} />
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
      <div id="force"></div>
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
    d3Chart.update(d3.select('svg'), this.props.posts);
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
      posts: null,
      thread: null,
      bubble: false,
      split: false,
    }
  },
  componentWillMount(){
    console.log('Root will Mount')
    $.getJSON('https://www.reddit.com/.json?limit=50').done(function(data) {
      console.log('API call for posts')
      var firstData = data.data.children
        this.setState({
          posts: firstData
        })
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
  threadState(id){
    thread: $.getJSON('http://www.reddit.com/' + id + '.json').done(function(data){
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
        view = <PostsBox posts={this.state.posts} updatePost={this.threadState} />     
      }
      else if (this.state.thread) {
        view = <ThreadBox thread={this.state.thread} split={false} returnToPosts={this.clearThread}/>
      }
    }
    if (this.state.posts) {
      return (
        <div>
          <Nav />
          <Dash 
            toggleBubble={this.updateToggleBubble}
            toggleSplit={this.updateToggleSplit}
          />
          <div className='container-fluid'>{view}</div>
        </div>
      )     
    }
    return <div><img className='loading' src='../images/loading.gif'/></div>
  }
});   

ReactDOM.render(
  <Root />, 
  document.getElementById("root")
);