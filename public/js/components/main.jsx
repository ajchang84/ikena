var Post = React.createClass({
  render(){
    return (
      <li>Title: {this.props.title} Score: {this.props.score}</li>
  )}
});

var Category = React.createClass({
  render(){
    return (
      <p>All Posts</p>
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
          key={index}
        />
      );
    });

    return (
      <div>
        <Category />
        <ul>{posts}</ul>
      </div>
    )
  }
})

var Nav = React.createClass({
  render(){
    return (
      <div id="nav"></div>
    )
  }
});

var Container = React.createClass({
  getInitialState(){
    return {
      posts: []
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
        <PostsBox posts={this.state.posts}/>
      </div>
    )
  }
});   

ReactDOM.render(<Container />, document.getElementById("container"))