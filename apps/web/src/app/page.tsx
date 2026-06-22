import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-3xl font-semibold">Welcome to Kayabé</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Collaborative task management platform
        </p>
      </main>
    </div>
  );
}
