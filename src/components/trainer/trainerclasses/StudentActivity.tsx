import React from "react";

const StudentActivity = () => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto  ">
        <thead className=" bg-gray-100">
          <tr className="text-sm">
            <td className="w-16 px-4 py-2  text-left">SN</td>
            <td className="px-4 py-2  text-left">Name</td>
            <td className="px-4 py-2  text-left">Study Topic</td>
            <td className="px-4 py-2  text-left">Status</td>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr>
            <td className="w-16 px-4 py-2 ">1</td>
            <td className="px-4 py-2 ">John Doe</td>
            <td className="px-4 py-2 ">Web Development</td>
            <td className="px-4 py-2 ">Completed</td>
          </tr>
          <tr>
            <td className="w-16 px-4 py-2 ">2</td>
            <td className="px-4 py-2 ">Jane Smith</td>
            <td className="px-4 py-2 ">Data Science</td>
            <td className="px-4 py-2 ">In Progress</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StudentActivity;
