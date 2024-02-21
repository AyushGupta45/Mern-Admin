import { Table, Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import toast from "react-hot-toast";

const DashReviews = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch("/api/review/getreviews");
        const data = await res.json();

        if (res.ok) {
          setReviews(data.reviews);
        } else {
          toast.error("error fetching");
        }
      } catch (e) {
        toast.error("Error fetching reviews:", e.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchReview();
    }
  }, [currentUser.isAdmin]);

  const handleDeleteReview = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/review/deleteReview/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
      } else {
        setReviews((prev) =>
          prev.filter((review) => review._id !== postIdToDelete)
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="overflow-x-auto p-2 w-full ">
      {currentUser.isAdmin && reviews.length > 0 ? (
        <>
          <Table striped className="border">
            <Table.Head className="border-b-2">
              <Table.HeadCell className="text-center border-x-2">
                Date Created
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Username
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Review
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Delete
              </Table.HeadCell>
            </Table.Head>

            {reviews.map((review) => (
              <Table.Body key={review._id} className="divide-y border-b-2">
                <Table.Row
                  key={review._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="text-center border-x-2">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </Table.Cell>

                  <Table.Cell className="text-center border-x-2">
                    {review.userId.username}
                  </Table.Cell>

                  <Table.Cell className="text-center border-x-2">
                    {review.description}
                  </Table.Cell>

                  <Table.Cell className="text-center border-x-2">
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(review._id);
                      }}
                      className="text-red-500 font-medium hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <div>
          <h1 className="text-6xl sm:text-4xl text-center mt-20">
            No users yet
          </h1>
        </div>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteReview}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashReviews;
