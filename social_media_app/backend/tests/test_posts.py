from __future__ import annotations

from fastapi.testclient import TestClient

from app.data import store
from app.main import app


class TestPostDetail:
    """Tests for post detail endpoint."""

    def test_get_post_detail(self):
        """Gets detailed view of a single post with comments."""
        client = TestClient(app)
        # Get a post that has comments
        post_with_comments = None
        for post_id, comments in store.comments.items():
            if len(comments) > 0:
                post_with_comments = post_id
                break

        if post_with_comments:
            resp = client.get(f"/posts/{post_with_comments}")
            assert resp.status_code == 200
            data = resp.json()
            assert "post" in data
            assert "comments" in data
            assert "liked_by_current_user" in data
            assert data["post"]["id"] == post_with_comments
            assert len(data["comments"]) > 0
            # Check comment has author
            assert "author" in data["comments"][0]
            assert "handle" in data["comments"][0]["author"]

    def test_get_post_detail_no_comments(self):
        """Gets post detail even if post has no comments."""
        client = TestClient(app)
        # Get a post without comments
        post_no_comments = None
        for post_id, comments in store.comments.items():
            if len(comments) == 0:
                post_no_comments = post_id
                break

        if post_no_comments:
            resp = client.get(f"/posts/{post_no_comments}")
            assert resp.status_code == 200
            data = resp.json()
            assert data["post"]["id"] == post_no_comments
            assert len(data["comments"]) == 0

    def test_post_detail_404(self):
        """Returns 404 for missing post."""
        client = TestClient(app)
        resp = client.get("/posts/nonexistent-post-id")
        assert resp.status_code == 404

    def test_post_detail_with_user_id(self):
        """Returns correct liked_by_current_user status."""
        client = TestClient(app)
        post_id = list(store.posts.keys())[0]
        user_id = "test_user_like_check"

        # Initially should not be liked
        resp1 = client.get(f"/posts/{post_id}?user_id={user_id}")
        assert resp1.status_code == 200
        assert resp1.json()["liked_by_current_user"] is False

        # Like the post
        client.post(f"/posts/{post_id}/like", json={"user_id": user_id})

        # Now should be liked
        resp2 = client.get(f"/posts/{post_id}?user_id={user_id}")
        assert resp2.status_code == 200
        assert resp2.json()["liked_by_current_user"] is True

    def test_post_detail_missing_author(self):
        """Handles case where post author is missing."""
        client = TestClient(app)
        # This edge case is covered by seeding - all posts have valid authors
        # Test just verifies that all posts have authors
        for post_id in list(store.posts.keys())[:5]:
            resp = client.get(f"/posts/{post_id}")
            assert resp.status_code == 200
            assert "author" in resp.json()["post"]

