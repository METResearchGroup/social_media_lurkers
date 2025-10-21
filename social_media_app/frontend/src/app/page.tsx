"use client";
import useSWRInfinite from "swr/infinite";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, Button, Card } from "@/components/ui";
import { fetchFeed, likePost, sharePost, PostWithAuthor } from "@/lib/api";
import { useEffect, useRef } from "react";

type PageData = { next_cursor?: string | null } | null;

const getKey = (pageIndex: number, previousPageData: PageData) => {
  if (previousPageData && !previousPageData?.next_cursor) return null;
  if (pageIndex === 0) return { cursor: null };
  return { cursor: previousPageData?.next_cursor ?? null };
};

export default function Home() {
  const router = useRouter();
  const { data, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    async (key: { cursor: string | null }) => fetchFeed(key.cursor)
  );

  const items = (data?.flatMap((p) => p.items) || []) as PostWithAuthor[];
  const nextCursor = data?.[data.length - 1]?.next_cursor ?? null;
  const currentUser = "current-user";
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!nextCursor) return;
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setSize((s) => s + 1);
      }
    }, { rootMargin: "200px" });
    obs.observe(el);
    return () => {
      obs.disconnect();
    };
  }, [nextCursor, setSize]);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <Card key={item.id}>
          <div className="flex gap-3 p-3">
            <Link href={`/profile/${item.author_id}`} className="shrink-0">
              <Avatar src={item.author.avatar_url} alt={item.author.display_name} />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Link href={`/profile/${item.author_id}`} className="font-semibold hover:underline">
                  {item.author.display_name}
                </Link>
                <span className="text-sm text-neutral-500">{item.author.handle}</span>
                <span className="text-sm text-neutral-500">· {new Date(item.created_at).toLocaleString()}</span>
              </div>
              <div 
                className="cursor-pointer whitespace-pre-wrap break-words py-2 hover:bg-gray-50 rounded"
                onClick={() => router.push(`/post/${item.id}`)}
              >
                <p>{item.text}</p>
              </div>
              <div className="flex items-center gap-4 pt-1 text-sm text-neutral-600">
                <Button onClick={async (e) => { e?.stopPropagation(); await likePost(item.id, currentUser); await mutate(); }}>
                  ♥ {item.like_count}
                </Button>
                <Button onClick={(e) => { e?.stopPropagation(); router.push(`/post/${item.id}`); }}>
                  💬 {item.comment_count}
                </Button>
                <Button onClick={async (e) => { e?.stopPropagation(); await sharePost(item.id, currentUser); await mutate(); }}>
                  ↻ {item.share_count}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
      <div className="py-4 text-center" ref={loadMoreRef}>
        {nextCursor ? (
          <Button onClick={() => setSize(size + 1)} disabled={isValidating}>Load more</Button>
        ) : (
          <span className="text-sm text-neutral-500">You are all caught up</span>
        )}
      </div>
    </div>
  );
}

