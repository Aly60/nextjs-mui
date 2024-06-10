import React from "react";
import UserForm from "../components/UserForm";
import Header from "../components/Header";
export default function EditUserPage({ userId }) {
  return (
    <div>
      <Header />
      <UserForm userId={userId} />
    </div>
  );
}
