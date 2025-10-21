"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import {
  commentPost,
  fetchPostDetail,
  likePost,
  sharePost,
} from "@/lib/api";
import type { PostDetailResponse } from "@/lib/api";
import { Button, Card } from "@/components/ui";

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, error, isLoading } = useSWR<PostDetailResponse>(
    `/posts/${postId}`,
    () => fetchPostDetail(postId, "current-user")
  );

  const handleLike = async () => {
    if (!data) return;
    try {
      await likePost(postId, "current-user");
      mutate(`/posts/${postId}`);
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  const handleShare = async () => {
    if (!data) return;
    try {
      await sharePost(postId, "current-user");
      mutate(`/posts/${postId}`);
      alert("Post shared!");
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await commentPost(postId, "current-user", commentText);
      setCommentText("");
      mutate(`/posts/${postId}`);
    } catch (err) {
      console.error("Comment failed:", err);
      alert("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-2xl">
          <Button onClick={() => router.back()} className="mb-4">
            ← Back
          </Button>
          <Card className="p-8 text-center">Loading post...</Card>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-2xl">
          <Button onClick={() => router.back()} className="mb-4">
            ← Back
          </Button>
          <Card className="p-8 text-center text-red-600">
            Failed to load post. Please try again.
          </Card>
        </div>
      </div>
    );
  }

  const { post, comments, liked_by_current_user } = data;
  const timeAgo = new Date(post.created_at).toLocaleString();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-2xl">
        {/* Back button */}
        <Button onClick={() => router.back()} className="mb-4">
          ← Back
        </Button>

        {/* Main Post */}
        <Card className="mb-4 p-6">
          <div className="mb-4 flex items-start gap-3">
            {post.author.avatar_url && (
              <img
                src={post.author.avatar_url}
                alt={post.author.display_name}
                className="h-12 w-12 rounded-full"
              />
            )}
            <div className="flex-1">
              <div className="font-semibold">{post.author.display_name}</div>
              <div className="text-sm text-gray-600">{post.author.handle}</div>
            </div>
          </div>

          <p className="mb-4 text-lg">{post.text}</p>

          <div className="mb-4 text-sm text-gray-500">{timeAgo}</div>

          {/* Stats */}
          <div className="mb-4 flex gap-6 border-y border-gray-200 py-3 text-sm">
            <span>
              <strong>{post.like_count}</strong> Likes
            </span>
            <span>
              <strong>{post.comment_count}</strong> Comments
            </span>
            <span>
              <strong>{post.share_count}</strong> Shares
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              onClick={handleLike}
              className={liked_by_current_user ? "bg-red-500" : ""}
            >
              {liked_by_current_user ? "♥" : "♡"} Like
            </Button>
            <Button onClick={handleShare}>↻ Share</Button>
          </div>
        </Card>

        {/* Comment Input */}
        <Card className="mb-4 p-4">
          <form onSubmit={handleSubmitComment}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="mb-2 w-full resize-none rounded border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
              rows={3}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              disabled={!commentText.trim() || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        </Card>

        {/* Comments List */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold">
            Comments ({comments.length})
          </h2>
          {comments.length === 0 ? (
            <Card className="p-6 text-center text-gray-500">
              No comments yet. Be the first to comment!
            </Card>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} className="p-4">
                <div className="mb-2 flex items-start gap-3">
                  {comment.author.avatar_url && (
                    <img
                      src={comment.author.avatar_url}
                      alt={comment.author.display_name}
                      className="h-10 w-10 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        {comment.author.display_name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {comment.author.handle}
                      </span>
                      <span className="text-sm text-gray-400">·</span>
                      <span className="text-sm text-gray-400">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1">{comment.text}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

