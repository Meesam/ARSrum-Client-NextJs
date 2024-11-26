import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <p className="text-4xl font-extrabold">AR Scrum</p>
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">Get started by register yourself</li>
          <li>Or Login In</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Button variant="outline">
            <Link href="/register">Register</Link>
          </Button>
          <Button variant="outline">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
