'use client'
import Header from "../components/header/header";

export default function DefaultLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header/>

      <main>{children}</main>
    </div>
  );
}