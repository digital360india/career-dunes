"use client";
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    return onSnapshot(collection(db, "users"), (s) =>
      setUsers(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Users ({users.length})</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Joined</th><th className="p-3" /></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-3">{u.name || "-"}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.createdAt?.toDate().toLocaleDateString("en-GB")}</td>
                <td className="p-3">
                  {u.id !== me.uid && (
                    <button className="text-blue-600"
                      onClick={() => updateDoc(doc(db, "users", u.id), { role: u.role === "admin" ? "user" : "admin" })}>
                      Make {u.role === "admin" ? "user" : "admin"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}