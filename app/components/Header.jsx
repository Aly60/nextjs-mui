import Link from "next/link";
import "../globals.css";

export default function Header() {
  return (
    <header className="header">
      <nav className="navigation">
        <ul className="nav-list">
          <li className="nav-item">
            <Link href="/">
              <h3>Home</h3>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/add-user">
              <h3>Add User</h3>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
