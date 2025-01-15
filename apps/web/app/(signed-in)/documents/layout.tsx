export default function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      Sidebar
      {children}
    </section>
  );
}
