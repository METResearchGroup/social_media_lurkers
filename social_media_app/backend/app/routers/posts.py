from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ..data import store
from ..schemas import CommentWithAuthor, PostDetailResponse, PostWithAuthor

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("/{post_id}", response_model=PostDetailResponse)
def get_post_detail(post_id: str, user_id: str = "anonymous") -> PostDetailResponse:
    """Get detailed view of a single post including all comments."""
    post = store.get_post(post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")

    author = store.get_profile(post.author_id)
    if author is None:
        raise HTTPException(status_code=404, detail="Post author not found")

    post_with_author = PostWithAuthor(**post.model_dump(), author=author)

    # Get all comments with author info
    comments = store.get_post_comments(post_id)
    comments_with_authors = []
    for comment in comments:
        comment_author = store.get_profile(comment.user_id)
        if comment_author:
            comments_with_authors.append(
                CommentWithAuthor(**comment.model_dump(), author=comment_author)
            )

    liked_by_user = store.is_liked_by(post_id, user_id)

    return PostDetailResponse(
        post=post_with_author,
        comments=comments_with_authors,
        liked_by_current_user=liked_by_user,
    )

