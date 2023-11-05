import './App.css';
import BlogContainer from './components/blogContainer';
import Blogs from './components/blogs';
import CreateBlog from './components/createBlog';

function App() {
  return (
    <div className="App container py-5">
      {/* <BlogContainer/> */}
      {/* <CreateBlog/> */}
   <Blogs></Blogs>
    </div>
  );
}

export default App;
