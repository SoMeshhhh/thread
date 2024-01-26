// "use client";

import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";

async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const { threads, isNext } = await fetchThreads(1, 30);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {threads?.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {threads?.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>

      {/* <Pagination
    path='/'
    pageNumber={searchParams?.page ? +searchParams.page : 1}
    isNext={result.isNext}
  /> */}
    </>
  );
}

export default Home;
