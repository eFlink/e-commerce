import SideBar from "./sidebar";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className='h-full'>
      <SideBar>
        {children}
      </SideBar>
    </section>
  );
}