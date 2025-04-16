import Link from "next/link";
import styles from "../styles/DashboardLinks.module.scss";

export default function DashboardLinks() {
  return (
    <div className={styles.container}>
      {[
        { href: "/courses/create", label: "Create a Course" },
        { href: "/courses/invite", label: "Invite to Course" },
        { href: "/assignments/create", label: "Create an Assignment" },
        { href: "/profile", label: "My Profile" },
      ].map((link) => (
        <Link key={link.href} href={link.href} className={styles.link}>
          {link.label}
        </Link>
      ))}
    </div>
  );
}
