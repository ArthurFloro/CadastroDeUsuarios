import { DarkMode } from "./darkmode";

interface HeaderProps {
  title: string
}

export default function Header({title}: HeaderProps) {
  return (
    <nav className="flex  items-center p-8 justify-between">
      <div className="flex items-center gap-4">
      <DarkMode/>
      <h1 className="text-2xl">{title}</h1>
      </div>
    </nav>
  );
}
