"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserDetail({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3001/users/${userId}`)
        .then((response) => setUser(response.data))
        .catch((error) => console.error(error));
    }
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="user-details-container">
      <div className="user-info">
        <h1>{user.name}</h1>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
        <p>
          <strong>Address:</strong> {user.address}
        </p>
        <p>
          <strong>Status:</strong> {user.status}
        </p>
        <p>
          <strong>Date:</strong>
          {user.date}
        </p>
      </div>
      <div className="user-picture">
        <img src={user.picture} alt={user.name} />
      </div>
    </div>
  );
}
