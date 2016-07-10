var Post = React.createClass({
  loadPost(){
    this.props.handleClick(this.props.id)
  },
  render(){
    return (
      <div className='posts'>
          <img className='thumbnails' 
               src={this.props.thumbnail}
          />
          <div className='block'>
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

  render(){
    if (this.props.thread[0]) {
      return (
        <div id='threadBox'>
        <Content content={this.props.thread[0].data.children[0].data} />
        </div>
      )  
    }
    return <div>Loading</div>
  }
})

var Content = React.createClass({

  render(){
      console.log(this.props.content.url)
    return (
      <div>
        <h2>{this.props.content.title}</h2>
        <img src={this.props.content.url} />
      </div>
    )
  }
})

var Comments = React.createClass({
  render(){
    return (
      <div>
      Comments
      </div>
    )
  }
})

var Nodes = React.createClass({
  getDefaultProps(){
  },
  componentDidMount(){
    d3Chart.create('#nodes', {
      width: '1000px',
      height: '900px'
    }, this.props.posts);
  },
  render(){
    return (
      <div id='nodes'></div> 
    )
  }
})

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

    return (
      <div id="postBox">
        <Category />
        <div>{posts}</div>
      </div>
    )
  }
});

var Nav = React.createClass({
  render(){
    return (
      <div id="nav"></div>
    )
  }
});

var Dash = React.createClass({
  toggleBubble(){
    this.props.toggleBubble()
  },
  render(){
    return (
      <div id="dash">
        <h1>FRONT</h1>
        <label className="switch">
          <input 
            type="checkbox" 
            value="bubble" 
            onChange={this.toggleBubble}
          />
          <div className="slider round"></div>
        </label>
      </div>
    )
  }
});

var Root = React.createClass({
  getInitialState(){
    return {
      posts: null,
      bubble: false,
      thread: null
    }
  },
  componentWillMount(){
    console.log('Root will Mount')
    $.getJSON('https://www.reddit.com/.json?limit=75').done(function(data) {
      console.log('API call done')
      var firstData = data.data.children
      $.getJSON('http://www.reddit.com/' + data.data.children[0].data.id +'.json').done(function(data){
        this.setState({
          thread: data,
          posts: firstData
        })
      }.bind(this),"json")
    }.bind(this),"json")  
  },
  updateState(){
    // update state
    this.setState({
      bubble: !this.state.bubble
    });
  },
  threadState(id){
    this.setState({
      thread: $.getJSON('http://www.reddit.com/' + id + '.json').done(function(data){
        this.setState({
          thread: data,
        })
      }.bind(this),"json")
    });
  },
  render(){
    var view;
    if (this.state.bubble) {
      view = <Nodes posts={this.state.posts}/>
    } 
    else if (!this.state.bubble) {
      view = [
        <PostsBox key='0' posts={this.state.posts} updatePost={this.threadState}/>, 
        <ThreadBox key='1' thread={this.state.thread}/>]
    }
    if (this.state.posts) {
      return (
        <div>
          <Nav />
          <Dash toggleBubble={this.updateState}/>
          <hr />
          <div>
            {view}
          </div>
        </div>
      )     
    }
    return <div>Loading</div>
  }
});   

ReactDOM.render(<Root />, document.getElementById("root"))