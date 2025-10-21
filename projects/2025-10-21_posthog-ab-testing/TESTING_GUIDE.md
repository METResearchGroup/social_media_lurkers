# PostHog AB Testing - Testing Guide

**Date**: October 21, 2025  
**Status**: Ready for Testing  
**Build Status**: ✅ PASSING

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd social_media_app/backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Start the Frontend
```bash
cd social_media_app/frontend
npm run dev
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **PostHog Dashboard**: https://us.posthog.com/project/236915

## 🧪 Manual Testing Checklist

### Basic Functionality
- [ ] Homepage loads successfully
- [ ] Feed displays posts
- [ ] Click on a post to view post detail page
- [ ] Variant toggle appears in top-right corner (development mode only)
- [ ] Page loads without errors

### Variant Testing

#### Variant A (Control)
- [ ] Toggle to "control" variant
- [ ] Standard post layout displays
- [ ] Like, comment, share buttons work
- [ ] Comments section displays normally
- [ ] No audience statistics panels visible

#### Variant B (Treatment - Audience Statistics)
- [ ] Toggle to "treatment" variant
- [ ] Audience Statistics panel displays above comments
- [ ] Political breakdown shows (Liberal/Moderate/Conservative)
- [ ] Attitude breakdown shows (Support/Neutral/Oppose)
- [ ] All percentages add up to 100%
- [ ] Viewer count displays (e.g., "247 people viewed this post")
- [ ] Trust indicators appear (methodology, privacy)
- [ ] Hover over trust indicators to see tooltips
- [ ] Comments warning banner shows above comments
- [ ] Bar graphs are color-coded and animated

#### Variant C (Comparison - Representation)
- [ ] Toggle to "comparison" variant
- [ ] Representation Comparison panel displays
- [ ] Two columns show: "Among COMMENTERS" vs "Among ALL VIEWERS"
- [ ] Commenter count displays
- [ ] Viewer count displays
- [ ] Support/Neutral/Oppose percentages for both groups
- [ ] Divergence level shows (percentage)
- [ ] Warning message adapts to divergence level (high/moderate/low)
- [ ] Color-coded warnings (red for high, amber for moderate, blue for low)
- [ ] Dominant attitudes identified for each group

### Event Tracking Verification

Use browser DevTools Console (F12) to check:
- [ ] Console shows "PostHog initialized" message
- [ ] Check Network tab for PostHog API calls to `us.i.posthog.com`
- [ ] Verify `post_viewed` event fires on page load
- [ ] Click Like button - verify `post_engagement` event
- [ ] Click Share button - verify `post_engagement` event
- [ ] Submit a comment - verify `post_engagement` event
- [ ] Scroll down the page - verify `post_scroll_depth` events
- [ ] Leave page or close tab - verify `post_dwell_time` event

### PostHog Dashboard Verification

1. Go to https://us.posthog.com/project/236915
2. Navigate to "Events" section
3. Check for these events:
   - `post_viewed`
   - `post_engagement`
   - `post_scroll_depth`
   - `post_dwell_time`
4. Verify event properties include:
   - `post_id`
   - `variant` (control/treatment/comparison)
   - `timestamp`
   - Additional properties per event type

### Feature Flag Verification

1. Go to PostHog Dashboard → Feature Flags
2. Find "Post Detail Variant Test" (`post_detail_variant_test`)
3. Verify it shows 3 variants
4. Check rollout percentages (should be approximately 33% each)

### Responsive Design Testing
- [ ] Test on mobile width (< 768px)
- [ ] Test on tablet width (768px - 1024px)
- [ ] Test on desktop width (> 1024px)
- [ ] All panels resize appropriately
- [ ] Bar graphs remain readable
- [ ] Comparison panel switches to vertical on mobile

### Dark Mode Testing
- [ ] Toggle system dark mode
- [ ] All panels display correctly in dark mode
- [ ] Text remains readable
- [ ] Colors adjust appropriately
- [ ] Trust indicator tooltips work in dark mode

## 🐛 Known Behaviors

### Expected Behaviors
- **Variant Toggle**: Only visible in development mode
- **Manual Override**: Persists across page refreshes (localStorage)
- **Mock Data**: Randomized per session but cached per post
- **Divergence**: Commenters vs viewers attitudes may show significant difference
- **Event Timing**: Dwell time sent on page exit, scroll depth sent every 5 seconds

### PostHog Feature Flag
- Feature flags may take a few seconds to load on first page visit
- Variant assignment is sticky once received
- Manual override takes precedence over feature flag

## 📊 Testing with PostHog MCP

You can use the PostHog MCP in Cursor to verify events:

```javascript
// List recent events
mcp_posthog_search-events({
  naturalLanguageQuery: "post viewed events from last hour",
  limit: 10
})

// Check experiment data
mcp_posthog_experiment-get-all()
```

## ✅ Acceptance Criteria

All tickets should meet their individual acceptance criteria:
- ✅ Ticket 001: PostHog SDK loads, no console errors
- ✅ Ticket 002: Feature flag returns correct variant
- ✅ Ticket 003: All events fire correctly
- ✅ Ticket 004: Mock data displays, percentages sum to 100%
- ✅ Ticket 005: Audience panel displays all sections
- ✅ Ticket 006: Comparison panel shows divergence
- ✅ Ticket 007: Toggle works, hidden in production

## 🔧 Troubleshooting

### PostHog Not Loading
- Check browser console for errors
- Verify NEXT_PUBLIC_POSTHOG_KEY is set in .env
- Check Network tab for PostHog script loading
- Refresh page to retry initialization

### Events Not Appearing in PostHog
- Wait 30 seconds for processing
- Check PostHog dashboard "Events" section
- Verify project ID is correct
- Check browser console for capture errors

### Variant Toggle Not Showing
- Ensure you're in development mode (`npm run dev`)
- Check NODE_ENV is "development"
- Look in top-right corner of post detail page

### Build Fails
- Run `npm run build` to see errors
- Check all TypeScript/linting errors
- Verify all imports are correct
- Clear `.next` cache: `rm -rf .next && npm run build`

## 📸 Expected Screenshots

### Variant A (Control)
- Standard post with comments
- No additional panels

### Variant B (Treatment)
- Post
- **Audience Statistics Panel** (blue gradient background)
  - Viewer count
  - Political breakdown (3 bars)
  - Attitude breakdown (3 bars)
  - Trust indicators
  - Info note
- **Warning banner** above comments
- Comments

### Variant C (Comparison)
- Post
- **Representation Comparison Panel** (purple gradient background)
  - Two-column layout
  - Commenters stats (left)
  - Viewers stats (right)
  - Divergence percentage
  - Color-coded warning message
- Comments

## 🎯 Next Steps After Manual Testing

1. ✅ Verify all variants work correctly
2. ✅ Confirm events appear in PostHog
3. ✅ Test responsive design
4. ✅ Validate dark mode
5. ✅ Check performance (no slowdowns)
6. ✅ Review PR #13
7. ✅ Merge when approved

---

**Happy Testing!** 🎉

