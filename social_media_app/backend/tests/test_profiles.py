from __future__ import annotations

from fastapi.testclient import TestClient

from app.data import store
from app.main import app


class TestGetProfile:
    """Tests for profile endpoints."""

    def test_get_profile(self):
        """Gets a profile by ID and lists their posts."""
        client = TestClient(app)
        # Get a real profile ID from the store
        profile_id = list(store.profiles.keys())[0]
        resp = client.get(f"/profiles/{profile_id}")
        assert resp.status_code == 200
        data = resp.json()
        assert "profile" in data
        assert "posts" in data
        assert data["profile"]["id"] == profile_id

    def test_profile_404(self):
        """Returns 404 for a missing profile."""
        client = TestClient(app)
        resp = client.get("/profiles/does-not-exist")
        assert resp.status_code == 404
