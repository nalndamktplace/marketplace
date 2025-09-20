import { BOOK } from "../api/book/book";
import { BlogsListComponent } from "./HomePage";

function BlogPage() {
  const { mediumBlogsData } = BOOK.getMediumBlogsQuery();
  return (
    <div className="container">
      <div className="my-10 text-6xl font-bold text-primary">The Blogs</div>

      <BlogsListComponent data={mediumBlogsData?.items} title="" />
    </div>
  );
}

export default BlogPage;
