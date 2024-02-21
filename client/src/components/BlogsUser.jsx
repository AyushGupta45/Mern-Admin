import { Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BlogsUser = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/blogs/getblogs");
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.blogs);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="bg-blue-100">
      <div className="overflow-x-auto p-4 w-full m-auto sm:w-9/12 flex gap-10">
        {!currentUser ||
        (currentUser && !currentUser.isAdmin && userPosts.length > 0) ? (
          <>
            <div className="w-full ">
              <div className="grid grid-cols-1 gap-6 py-8">
                {userPosts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/blog/${post._id}`}
                    className="block"
                  >
                    <div className="bg-white p-4 mb-8 shadow-md rounded-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-black">
                      <img
                        src={post.uploadLink}
                        alt={post.title}
                        className="w-full object-cover mb-8 "
                      />
                      <div className="py-8 p-8">
                        <h2 className="text-xl font-bold text-blue-900 text-start mb-8 line-clamp-2">
                          {post.title}
                        </h2>
                        <p
                          className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-14 text-start"
                          dangerouslySetInnerHTML={{ __html: post.content }}
                        ></p>
                        <Button
                          outline
                          className=""
                          gradientDuoTone="purpleToPink"
                          type="submit"
                        >
                          <Link
                            to={`/blog/${post._id}`}
                            className="text-xl font-bold"
                          >
                            READ MORE
                          </Link>
                        </Button>
                        <p className="text-gray-600 dark:text-gray-300 text-end">
                          Uploaded:{" "}
                          <b>
                            {new Date(post.updatedAt)
                              .toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                              .toUpperCase()}
                          </b>
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            {/* <div className="flex-1 hidden md:block">
            <div className="grid grid-cols-1 gap-6 py-8">
              <div className="bg-white shadow-md rounded-md overflow-hidden"></div>
              <div className="bg-white px-4 shadow-md rounded-md overflow-hidden">
                <h2 className="text-2xl font-bold text-blue-900 text-center py-4">
                  Recently Posted
                </h2>
                {userPosts.map((post) => (
                  <Link
                    key={post._id}
                    to={`/blog/${post._id}`}
                    className="block"
                  >
                    <div className="bg-white mb-4 flex items-center transition-shadow duration-300">
                      <img
                        src={post.uploadLink}
                        alt={post.title}
                        className="w-12 h-12 object-cover rounded-md mr-4"
                      />
                      <div className="flex-1">
                        <h2 className="text-md font-bold text-blue-900 mb-1 line-clamp-2 text-start">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mt-4">
                          Uploaded:{" "}
                          <span className="font-semibold">
                            {new Date(post.updatedAt)
                              .toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric",
                              })
                              .toUpperCase()}
                          </span>
                        </p>
                      </div>
                    </div>
                    <hr className="mb-4"></hr>
                  </Link>
                ))}
              </div>
            </div>
          </div> */}
          </>
        ) : (
          <div className="text-center mt-20">
            <h1 className="text-6xl sm:text-4xl">No Blogs Yet</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsUser;
