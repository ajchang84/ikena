var Post = React.createClass({
  render(){
    return (
      <div className='posts'>
          <img className='thumbnails' 
               src={this.props.thumbnail}
               href='www.google.com' 
          />
          <div className='block'>
            <p className='title'>{this.props.title}</p>
            <p className='subreddit'>{this.props.subreddit}</p> 
            <p className='score'>{this.props.score} comments: {this.props.num_comments}</p>
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

var PostsBox = React.createClass({
  render(){
    var posts = [];
    this.props.posts.forEach(function(post, index) {
      posts.push(
        <Post 
          title={post.data.title} 
          score={post.data.score}
          thumbnail={post.data.thumbnail} 
          subreddit={post.data.subreddit}
          num_comments={post.data.num_comments}
          key={index}
        />
      );
    });

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
  render(){
    return (
      <div id="dash">
        <h1>FRONT</h1>
      </div>
    )
  }
});

var Root = React.createClass({
  getInitialState(){
    return {
      posts: [],
      readingPosts: false
    }
  },
  componentWillMount(){
    $.getJSON('https://www.reddit.com/.json').done(function(data) {
      this.setState({posts: data.data.children})
    }.bind(this),"json")  
  },
  updateState(){
    // update state
  },
  render(){
    return (
      <div>
        <Nav />
        <Dash />
        <hr />
        <PostsBox posts={this.state.posts}/>
      </div>
    )
  }
});   

ReactDOM.render(<Root />, document.getElementById("root"))