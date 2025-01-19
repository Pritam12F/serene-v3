import { UserSection } from "./user-section";

export const Sidebar = () => {
  return (
    <section className="flex flex-col bg-gray-900 min-w-60 text-white h-screen">
      <UserSection />
      <section>
        <div>Search</div>
        <div>Home</div>
        <div>Inbox</div>
      </section>
      <section className="private">
        <p>Private</p>
        <div>Getting Started</div>
        <div>Quick Note</div>
        <div>Personal Home</div>
        <div>Reading List</div>
      </section>
    </section>
  );
};
