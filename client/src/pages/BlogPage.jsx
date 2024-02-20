import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const BlogPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState(null);
  const { blogId } = useParams();

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/blogs/getblogs`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          return;
        }
        if (res.ok) {
          const currentblog = data.blogs.filter((blog) => blog._id === blogId);
          setFormData(currentblog[0]);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [blogId]);

  return (
    <div className=" bg-blue-100">
      {formData && (
        <div className="container mx-auto p-8 w-11/12 md:9/12">
          <h1 className="text-4xl  p-3 text-center font-bold font-serif max-w-2xl mx-auto lg:text-4xl">
            {formData.title}
          </h1>
          <img
            src={formData.uploadLink}
            alt={formData.title}
            className="rounded-lg my-6 m-auto max-w-full object-cover'"
          />
          <div
            dangerouslySetInnerHTML={{ __html: formData.content }}
            className="mx-auto w-full post-content"
          ></div>
          <p className="text-sm text-gray-500 mt-8">
            Updated At: {new Date(formData.updatedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
