from __future__ import annotations

import hashlib
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

from faker import Faker

from .schemas import Comment, Post, Profile

fake = Faker()
Faker.seed(42)  # For reproducible fake data


# Post content templates by category
POLITICAL_POSTS = [
    "Just voted! Remember to make your voice heard 🗳️",
    "The new infrastructure bill is a game changer for our community",
    "Town hall meeting was intense tonight. Democracy in action!",
    "Can't believe what happened in the debate last night 😳",
    "Reading up on the proposed education reforms. Thoughts?",
    "Local election results are in! Proud of our community",
    "Climate policy needs to be our top priority right now",
    "The healthcare debate continues. Here's my take...",
    "Just finished reading the new policy proposal. Mixed feelings.",
    "Civic engagement matters more than ever. Get involved!",
    "The state of our democracy concerns me deeply",
    "New bill passed! This will impact so many families",
    "Political polarization is at an all-time high. We need dialogue.",
    "Attended a community organizing event today. Feeling hopeful!",
    "The Supreme Court decision today is historic",
    "Local government transparency is so important",
    "Campaign season is exhausting but necessary",
    "Voter registration deadline is coming up! Don't miss it",
    "The mayor's new initiative sounds promising",
    "Grassroots movements are changing the game",
    "Constitutional rights matter. Protect them.",
    "Town council meeting tonight at 7pm. See you there?",
    "Policy changes take time, but we're making progress",
    "The political landscape is shifting rapidly",
    "Remember: local elections have huge impacts on daily life",
]

SPORTS_POSTS = [
    "WHAT A GAME!!! 🏀 That buzzer beater was insane",
    "My team finally won! Been waiting all season for this",
    "That referee call was absolutely terrible 😤",
    "Best playoff game I've seen in years. Unreal!",
    "Trade deadline drama is wild this year",
    "Just got tickets to the championship game! So hyped",
    "The rookie is playing like a veteran. Future GOAT?",
    "Heartbroken. So close but couldn't pull it off 💔",
    "Training for my first marathon! Week 6 of 16",
    "That halftime show though 🔥",
    "The coach's decision to go for it on 4th down paid off!",
    "Underdog story of the year. Love to see it",
    "Injury report doesn't look good for the star player 😟",
    "Season tickets were worth every penny this year",
    "The rivalry game next week is going to be epic",
    "Breaking: Massive trade just announced! Thoughts?",
    "Watching the game with friends. Nothing beats this energy",
    "Personal record at the gym today! Progress feels good 💪",
    "The draft picks this year are incredible",
    "Post-game interview was hilarious 😂",
    "Comeback of the century! Down 20 points and won",
    "Sports betting has made every game so much more intense",
    "The young talent in the league right now is amazing",
    "That was the best defensive play I've ever seen",
    "Championship parade is tomorrow! Who's going?",
]

LIFE_UPDATE_POSTS = [
    "First day at the new job! Wish me luck 🤞",
    "Just adopted the cutest puppy ever 🐶❤️",
    "Moving to a new city next month. Exciting and terrifying!",
    "Celebrated 5 years with my partner today 💕",
    "Finally finished that big project I've been working on",
    "Coffee shop down the street makes the best lattes ☕",
    "Kids started school today. House is so quiet!",
    "Trying to eat healthier. Day 3 and already want pizza",
    "Finally cleaned out the garage. Found so much stuff!",
    "Morning jog by the lake never gets old 🌅",
    "Cooking dinner from scratch tonight. Let's see how this goes",
    "Hit a new personal milestone today. Feeling grateful",
    "Rainy day = perfect reading weather 📚",
    "Family reunion this weekend. Haven't seen everyone in years!",
    "Learning to play guitar. Fingers hurt but it's worth it",
    "Garden is finally blooming! So proud of my tomatoes 🍅",
    "Date night was amazing. Tried a new restaurant",
    "Cleaning out my closet. Why do I have so many clothes?",
    "Dentist appointment survived ✅",
    "Thinking about getting a cat. Talk me into/out of it",
    "Sunday meal prep done! Feeling organized for the week",
    "Old friend reached out today. Made my day 🥰",
    "House projects never end but slowly making progress",
    "Beach day with the fam was exactly what I needed",
    "New hobby: baking bread. First loaf was... interesting",
]

FUN_POSTS = [
    "This meme is literally me every Monday morning 😂",
    "Why is it so hard to adult? Nobody warned me!",
    "Just binge-watched an entire season. No regrets",
    "Me: I should go to bed early. Also me at 2am: *scrolling*",
    "That moment when the WiFi goes out and you don't know what to do with your hands",
    "New season of my favorite show dropped! Goodbye productivity",
    "Tried a new recipe. Kitchen looks like a war zone but it tastes amazing!",
    "Why do cats just... sit on your laptop? Every single time?",
    "Coffee is basically a vegetable right? Asking for a friend ☕",
    "Found money in my old jacket pocket. Today is a good day! 💵",
    "The algorithm knows me too well. Stop showing me stuff I want to buy!",
    "That feeling when you find a parking spot right in front 🎉",
    "Autocorrect just embarrassed me in a work email again",
    "Is it just me or does time move differently on weekends?",
    "Successfully assembled IKEA furniture without crying. I am unstoppable!",
    "When your plans get cancelled and you're secretly relieved 😌",
    "Making eye contact with someone eating the same food as you 👀",
    "Stayed up too late watching YouTube. Worth it? Probably not",
    "That awkward moment when you wave back at someone who wasn't waving at you",
    "Online shopping at 3am hits different",
    "My phone battery is at 1%. This is fine. Everything is fine.",
    "Trying to look busy when the boss walks by 👀💼",
    "Weekend plans: absolutely nothing. Can't wait.",
    "When the food arrives and it looks exactly like the picture 😍",
    "Learned a new skill from a YouTube tutorial. I am basically an expert now",
]


class DataStore:
    """In-memory data store for the social media app."""

    def __init__(self):
        self.profiles: Dict[str, Profile] = {}
        self.posts: Dict[str, Post] = {}
        self.comments: Dict[str, List[Comment]] = {}
        self.likes: Dict[str, set[str]] = {}
        self.shares: Dict[str, set[str]] = {}
        self.post_ids_ordered: List[str] = []
        self._seed_data()

    def _generate_hash_id(self, prefix: str, seed: str) -> str:
        """Generate a hash-based ID."""
        hash_obj = hashlib.md5(f"{prefix}_{seed}".encode())
        return hash_obj.hexdigest()[:12]

    def _seed_data(self):
        """Seed the store with fake data."""
        # Create 12 profiles with realistic usernames
        profile_seeds = []
        for i in range(12):
            username = fake.user_name()
            # Ensure unique usernames
            while username in [p.handle for p in self.profiles.values()]:
                username = fake.user_name()

            profile_id = self._generate_hash_id("profile", username)
            profile = Profile(
                id=profile_id,
                handle=f"@{username}",
                display_name=fake.name(),
                bio=fake.sentence(nb_words=10) if random.random() > 0.3 else None,
                avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={username}",
            )
            self.profiles[profile_id] = profile
            profile_seeds.append(profile_id)

        # Create 100 posts with realistic content
        # 25% each category
        all_post_templates = (
            POLITICAL_POSTS * 1
            + SPORTS_POSTS * 1
            + LIFE_UPDATE_POSTS * 1
            + FUN_POSTS * 1
        )
        random.shuffle(all_post_templates)

        now = datetime.now()
        for i in range(100):
            author_id = random.choice(profile_seeds)
            post_text = all_post_templates[i % len(all_post_templates)]

            # Add some variation with emojis and mentions occasionally
            if random.random() > 0.7:
                mentioned_profile = random.choice(profile_seeds)
                mentioned_handle = self.profiles[mentioned_profile].handle
                post_text = f"{post_text} {mentioned_handle}"

            post_id = self._generate_hash_id("post", f"{author_id}_{i}_{post_text[:20]}")
            created_at = (now - timedelta(hours=random.randint(1, 720))).isoformat()

            post = Post(
                id=post_id,
                author_id=author_id,
                text=post_text,
                created_at=created_at,
                like_count=0,
                comment_count=0,
                share_count=0,
            )
            self.posts[post_id] = post
            self.post_ids_ordered.append(post_id)
            self.comments[post_id] = []
            self.likes[post_id] = set()
            self.shares[post_id] = set()

        # Add some comments to posts
        for post_id in list(self.posts.keys())[:50]:  # Add comments to half the posts
            num_comments = random.randint(0, 5)
            for j in range(num_comments):
                commenter_id = random.choice(profile_seeds)
                comment_text = fake.sentence(nb_words=random.randint(5, 15))
                comment_id = self._generate_hash_id(
                    "comment", f"{post_id}_{commenter_id}_{j}"
                )
                comment = Comment(
                    id=comment_id,
                    post_id=post_id,
                    user_id=commenter_id,
                    text=comment_text,
                    created_at=(
                        now - timedelta(hours=random.randint(1, 100))
                    ).isoformat(),
                )
                self.comments[post_id].append(comment)

        # Add some likes and shares
        for post_id in self.posts.keys():
            # Random likes
            num_likes = random.randint(0, 30)
            for _ in range(num_likes):
                liker_id = random.choice(profile_seeds)
                self.likes[post_id].add(liker_id)

            # Random shares
            num_shares = random.randint(0, 10)
            for _ in range(num_shares):
                sharer_id = random.choice(profile_seeds)
                self.shares[post_id].add(sharer_id)

            # Update counts
            self.posts[post_id].like_count = len(self.likes[post_id])
            self.posts[post_id].comment_count = len(self.comments[post_id])
            self.posts[post_id].share_count = len(self.shares[post_id])

        # Keep latest first
        self.post_ids_ordered.sort(
            key=lambda pid: self.posts[pid].created_at, reverse=True
        )

    def get_feed(
        self, cursor: Optional[str], limit: int
    ) -> Tuple[List[Post], Optional[str]]:
        if limit <= 0:
            return [], None
        ordered = self.post_ids_ordered
        start_idx = 0
        if cursor:
            try:
                start_idx = ordered.index(cursor) + 1
            except ValueError:
                return [], None
        end_idx = start_idx + limit
        selected = ordered[start_idx:end_idx]
        next_cursor = selected[-1] if len(selected) == limit and end_idx < len(ordered) else None
        return [self.posts[pid] for pid in selected], next_cursor

    def get_profile(self, profile_id: str) -> Optional[Profile]:
        return self.profiles.get(profile_id)

    def get_profile_posts(self, profile_id: str) -> List[Post]:
        return [p for p in self.posts.values() if p.author_id == profile_id]

    def get_post(self, post_id: str) -> Optional[Post]:
        return self.posts.get(post_id)

    def get_post_comments(self, post_id: str) -> List[Comment]:
        return self.comments.get(post_id, [])

    def add_like(self, post_id: str, user_id: str) -> bool:
        if post_id not in self.posts:
            return False
        self.likes[post_id].add(user_id)
        self.posts[post_id].like_count = len(self.likes[post_id])
        return True

    def add_comment(self, post_id: str, user_id: str, text: str) -> Optional[Comment]:
        if post_id not in self.posts or post_id not in self.comments:
            return None
        comment_id = self._generate_hash_id(
            "comment", f"{post_id}_{user_id}_{len(self.comments[post_id])}"
        )
        comment = Comment(
            id=comment_id,
            post_id=post_id,
            user_id=user_id,
            text=text,
            created_at=datetime.now().isoformat(),
        )
        self.comments[post_id].append(comment)
        self.posts[post_id].comment_count = len(self.comments[post_id])
        return comment

    def add_share(self, post_id: str, user_id: str) -> bool:
        if post_id not in self.posts:
            return False
        self.shares[post_id].add(user_id)
        self.posts[post_id].share_count = len(self.shares[post_id])
        return True

    def is_liked_by(self, post_id: str, user_id: str) -> bool:
        return user_id in self.likes.get(post_id, set())


# Global singleton instance
store = DataStore()
