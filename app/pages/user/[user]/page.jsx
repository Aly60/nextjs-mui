"use client";
import UserDetail from "../../../components/UserDetail";
import Header from "../../../components/Header";

export default function SingleUser({ params: { user } }) {
  return (
    <div>
      <Header />
      {user && <UserDetail userId={user} />}
    </div>
  );
}
