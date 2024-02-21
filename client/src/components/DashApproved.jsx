import { Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const DashApproved = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userAssignments, setUserAssignments] = useState([]);
  const approvedAssignments = userAssignments.filter(
    (assignment) =>
      assignment.isApproved && !assignment.isDenied && !assignment.isCompleted
  );

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch(
          `/api/upload/getassignments?userId=${currentUser._id}`
        );
        const data = await res.json();

        if (res.ok) {
          const filteredAssignments = data.assignments.filter(
            (assignment) =>
              assignment.isApproved && assignment.userId._id === currentUser._id
          );
          setUserAssignments(filteredAssignments);
        } else {
          toast.error(`Error fetching assignments: ${data.message}`);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (currentUser) {
      fetchAssignments();
    }
  }, [currentUser]);

  return (
    <div className="overflow-x-auto p-2 w-full ">
      {!currentUser.isAdmin && approvedAssignments.length > 0 ? (
        <>
          <Table striped className="border">
            <Table.Head className="border-b-2">
              <Table.HeadCell className="text-center border-x-2">
                Date Uploaded
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Title
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                Category
              </Table.HeadCell>
              <Table.HeadCell className="text-center border-x-2">
                View
              </Table.HeadCell>
            </Table.Head>

            {approvedAssignments.map((assignment) => (
              <Table.Body key={assignment._id} className="divide-y border-b-2">
                <Table.Row
                  key={assignment._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell className="text-center border-x-2">
                    {new Date(assignment.updatedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white text-center border-x-2">
                    {assignment.title}
                  </Table.Cell>
                  <Table.Cell className="text-center border-x-2">
                    {assignment.category}
                  </Table.Cell>
                  <Table.Cell className="text-center border-x-2">
                    <Button
                      outline
                      className="bg-blue-500 hover:bg-blue-700 text-white m-auto"
                      onClick={() =>
                        window.open(assignment.uploadLink, "_blank")
                      }
                    >
                      View
                    </Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
        </>
      ) : (
        <div>
          <h1 className="text-6xl sm:text-4xl text-center mt-20">
            No assignments approved yet
          </h1>
        </div>
      )}
    </div>
  );
};

export default DashApproved;
