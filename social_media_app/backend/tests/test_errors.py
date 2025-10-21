from __future__ import annotations

from fastapi.testclient import TestClient

from app.data import store
from app.main import app


class TestErrorBranches:
    """Test error paths and edge cases."""

    def test_interactions_404s(self):
        """Like/Comment/Share return 404 for missing post."""
        client = TestClient(app)
        for path in ["like", "comment", "share"]:
            resp = client.post(
                f"/posts/does-not-exist/{path}", json={"user_id": "test_user", "text": "x"}
            )
            assert resp.status_code == 404

    def test_post_detail_404(self):
        """Post detail returns 404 for missing post."""
        client = TestClient(app)
        resp = client.get("/posts/does-not-exist")
        assert resp.status_code == 404


class TestDataBranches:
    """Test data initialization and edge cases."""

    def test_store_has_data(self):
        """Verify store has seed data."""
        assert len(store.profiles) == 12
        assert len(store.posts) == 100
        assert len(store.post_ids_ordered) == 100

    def test_all_posts_have_authors(self):
        """Verify all posts have valid authors."""
        for post in store.posts.values():
            assert post.author_id in store.profiles

    def test_hash_ids_are_unique(self):
        """Verify all IDs are unique."""
        profile_ids = list(store.profiles.keys())
        post_ids = list(store.posts.keys())
        assert len(profile_ids) == len(set(profile_ids))
        assert len(post_ids) == len(set(post_ids))

    def test_post_categories_distribution(self):
        """Verify posts are distributed across categories."""
        # We should have various types of content
        texts = [p.text for p in store.posts.values()]
        assert len(texts) == 100
        # Check for some diversity in content
        unique_texts = set(texts)
        assert len(unique_texts) > 50  # Should have diverse content

    def test_profiles_have_realistic_data(self):
        """Verify profiles have Faker-generated names."""
        for profile in store.profiles.values():
            # Handles should start with @
            assert profile.handle.startswith("@")
            # Display names should exist
            assert len(profile.display_name) > 0
            # Avatar URLs should exist
            assert profile.avatar_url is not None
            assert "dicebear.com" in profile.avatar_url
