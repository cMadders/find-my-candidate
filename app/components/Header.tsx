"use client";

import Link from "next/link";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold">
          Find My Candidate
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/candidates">Candidates</Link>
          <Link href="/survey">Survey</Link>

          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="rounded-md border px-4 py-2">
                Login
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="rounded-md bg-blue-600 px-4 py-2 text-white">
                Sign Up
              </button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </nav>
      </div>
    </header>
  );
}