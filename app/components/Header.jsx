import Link from "next/link";
import "../globals.css";

export default function Header() {
  return (
    <header className="header">
      <nav className="navigation">
        <ul className="nav-list">
          <li className="nav-item">
            <Link href="/pages/Home">
              <h3>Home</h3>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/pages/userTable">
              <h3>User Table</h3>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
