// components/MembersTable.js
"use client";
import Sidebar from "@/components/Sidebar";
import React, { useState } from "react";
import { superadminMenuItems } from "@/sidebarMenuItems/superadminMenuItems";
import Header from "@/components/Header";
import Dropdown from "@/components/Dropdown";
const MembersTable = () => {
  const [selectedCategory, setSelectedCategory] = useState("Teachers");
  const [selectedRole, setSelectedRole] = useState("All");

  // Define members with role property
  const members = {
    Teachers: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "Lead Teacher",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        role: "Assistant Teacher",
      },
    ],
    Students: [
      {
        id: 1,
        name: "Michael Jordan",
        email: "michael@example.com",
        role: "Basketball Player",
      },
      {
        id: 2,
        name: "Kobe Bryant",
        email: "kobe@example.com",
        role: "Basketball Player",
      },
      {
        id: 3,
        name: "Sarah Johnson",
        email: "sarah@example.com",
        role: "Science Major",
      },
    ],
    Admins: [
      {
        id: 1,
        name: "Steve Rogers",
        email: "steve@example.com",
        role: "System Admin",
      },
      {
        id: 2,
        name: "Natasha Romanoff",
        email: "natasha@example.com",
        role: "Content Admin",
      },
    ],
  };

  // Filter users by selected role
  const filteredMembers = members[selectedCategory].filter(
    (member) => selectedRole === "All" || member.role === selectedRole
  );

  // Get all unique roles from the members list
  const roles = [
    ...new Set(members[selectedCategory].map((member) => member.role)),
    "All", // Include 'All' as an option
  ];

  return (
    <div>
      <Sidebar
        role="Superadmin"
        menuItems={superadminMenuItems}
        activeMenu="Users"
      />
      <div className="  ml-[3rem]">
        <Header />
        <div className="py-6 px-14">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              Members List
            </h2>

            <Dropdown
              label="Select role"
              options={["Teachers", "Students", "Admins"]}
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />

            {/* Role Dropdown */}
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    Name
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    Email
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-700">{member.name}</td>
                    <td className="p-4 text-sm text-gray-700">
                      {member.email}
                    </td>
                    <td className="p-4 text-sm text-gray-500">{member.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersTable;
