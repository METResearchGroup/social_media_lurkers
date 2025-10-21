# 📊 PostHog Verification Guide

**Project**: PostHog AB Testing  
**Dashboard**: https://us.posthog.com/project/236915  
**Organization**: Northwestern University  
**Project ID**: 236915

---

## 🚀 Step-by-Step: How to Check PostHog for Results

### Step 1: Access PostHog Dashboard

1. Navigate to: https://us.posthog.com/project/236915
2. Log in with your PostHog credentials
3. You should see the "Default project" dashboard

**Expected**: Dashboard loads showing overview metrics

---

### Step 2: Verify Feature Flag Configuration

1. Click **"Feature flags"** in the left sidebar
2. Look for: **"Post Detail Variant Test"**
3. Click on the feature flag to view details

**What to Check**:
- ✅ Key: `post_detail_variant_test`
- ✅ Status: Active (should be ON)
- ✅ Rollout: Appears to be multivariate
- ✅ Created: Recent timestamp

**Expected Configuration**:
```
Name: Post Detail Variant Test
Key: post_detail_variant_test
Active: Yes
Variants:
  - control (33%)
  - treatment (33%)
  - comparison (34%)
```

**PostHog MCP Command** (in Cursor):
```javascript
mcp_posthog_feature-flag-get-definition({
  flagKey: "post_detail_variant_test"
})
```

---

### Step 3: Check for Incoming Events

1. Click **"Events"** in the left sidebar (or go to Live events)
2. Look for these custom events:
   - `post_viewed`
   - `post_engagement`
   - `post_dwell_time`
   - `post_scroll_depth`

**Timeline**:
- Events appear within 30-60 seconds of user actions
- PostHog batches events, so slight delay is normal

**What to Check**:
- ✅ Event names match exactly (case-sensitive)
- ✅ Events have recent timestamps
- ✅ Event properties include variant information

**PostHog MCP Command**:
```javascript
// Search for post_viewed events
mcp_posthog_search-events({
  naturalLanguageQuery: "post_viewed events from last hour",
  limit: 10
})
```

---

### Step 4: Inspect Event Properties

1. Click on a `post_viewed` event in the events list
2. View the event details panel on the right
3. Expand "Properties" section

**Expected Properties**:
```json
{
  "post_id": "some-post-id",
  "variant": "control" | "treatment" | "comparison",
  "timestamp": "2025-10-21T17:30:00.123Z"
}
```

4. Repeat for `post_engagement` event

**Expected Properties**:
```json
{
  "post_id": "some-post-id",
  "variant": "control" | "treatment" | "comparison",
  "engagement_type": "like" | "comment" | "share" | "profile_click" | "back_button",
  "is_positive": true | false,
  "timestamp": "2025-10-21T17:30:00.123Z"
}
```

5. Check `post_dwell_time` event

**Expected Properties**:
```json
{
  "post_id": "some-post-id",
  "variant": "control" | "treatment" | "comparison",
  "dwell_time_seconds": 45,
  "was_visible": true,
  "timestamp": "2025-10-21T17:30:00.123Z"
}
```

6. Check `post_scroll_depth` event

**Expected Properties**:
```json
{
  "post_id": "some-post-id",
  "variant": "control" | "treatment" | "comparison",
  "scroll_percentage": 75,
  "max_scroll_reached": 85,
  "timestamp": "2025-10-21T17:30:00.123Z"
}
```

---

### Step 5: Verify Variant Distribution

1. Go to **"Insights"** in the left sidebar
2. Click **"+ New insight"**
3. Select **"Trends"** chart type
4. Configure:
   - **Event**: `post_viewed`
   - **Breakdown by**: `variant` (click "Add breakdown")
   - **Date range**: Last 24 hours

**Expected Result**:
- Bar chart or line chart showing events by variant
- Approximately equal distribution (33% each)
- At least some events in each variant

**What This Tells You**:
- Feature flag is working
- Users are being assigned to variants
- Distribution is approximately correct

---

### Step 6: Analyze Engagement by Variant

1. Create another **New insight**
2. Select **"Trends"**
3. Configure:
   - **Event**: `post_engagement`
   - **Filter by**: `is_positive = true`
   - **Breakdown by**: `variant`
   - **Date range**: Last 24 hours

**Expected Result**:
- Shows positive engagements (like, comment, share, profile_click) by variant
- Compare engagement rates across variants

**Advanced Analysis**:
1. Create separate insights for each engagement_type:
   - Filter `engagement_type = "like"` breakdown by variant
   - Filter `engagement_type = "comment"` breakdown by variant
   - Filter `engagement_type = "share"` breakdown by variant

---

### Step 7: Check Dwell Time Metrics

1. Create **New insight**
2. Select **"Trends"**
3. Configure:
   - **Event**: `post_dwell_time`
   - **Calculation**: **Average** of `dwell_time_seconds`
   - **Breakdown by**: `variant`
   - **Date range**: Last 24 hours

**Expected Result**:
- Average dwell time in seconds for each variant
- Compare which variant keeps users engaged longer

**Key Metric**: Higher dwell time suggests more engaging content

---

### Step 8: Analyze Scroll Depth

1. Create **New insight**
2. Select **"Trends"**
3. Configure:
   - **Event**: `post_scroll_depth`
   - **Calculation**: **Average** of `max_scroll_reached`
   - **Breakdown by**: `variant`
   - **Date range**: Last 24 hours

**Expected Result**:
- Average maximum scroll percentage for each variant
- Higher scroll depth suggests users reading more content

---

### Step 9: Create A/B Test Dashboard

1. Go to **"Dashboards"** in the left sidebar
2. Click **"+ New dashboard"**
3. Name it: "Post Detail AB Test - Variant Performance"
4. Add the insights created in Steps 5-8
5. Arrange them for easy comparison

**Dashboard Structure**:
```
┌─────────────────────────────────────────────┐
│  Post Detail AB Test - Variant Performance  │
├─────────────────────────────────────────────┤
│  Event Distribution by Variant              │
│  [Bar chart showing post_viewed by variant] │
├─────────────────────────────────────────────┤
│  Positive Engagement by Variant             │
│  [Chart showing engagement rate by variant] │
├─────────────────────────────────────────────┤
│  Average Dwell Time by Variant              │
│  [Line chart showing avg dwell time]        │
├─────────────────────────────────────────────┤
│  Average Scroll Depth by Variant            │
│  [Chart showing avg scroll percentage]      │
└─────────────────────────────────────────────┘
```

**PostHog MCP Command**:
```javascript
// List all dashboards
mcp_posthog_dashboards-get-all()

// Create new dashboard
mcp_posthog_dashboard-create({
  data: {
    name: "Post Detail AB Test - Variant Performance",
    description: "A/B test comparing 3 variants of post detail page"
  }
})
```

---

### Step 10: Monitor Real-Time Events (During Testing)

1. Go to **"Live events"** in PostHog
2. Keep this tab open while testing the application
3. Perform actions in the app:
   - Click on a post
   - Like a post
   - Add a comment
   - Scroll down
   - Navigate back

**Expected**:
- Events appear in real-time (30-60 second delay)
- Each action creates corresponding event
- Event properties show correct variant

**Troubleshooting**:
- If no events appear: Check browser console for errors
- If wrong properties: Verify tracking implementation
- If no variant property: Check feature flag loading

---

## 🧪 Testing Workflow

### Before You Start
1. ✅ Backend running: `uvicorn app.main:app --port 8000`
2. ✅ Frontend running: `npm run dev` (port 3000)
3. ✅ PostHog dashboard open in browser
4. ✅ Browser DevTools console open

### Test Sequence

**Test 1: Verify PostHog Loads**
1. Open http://localhost:3000
2. Check browser console for: "PostHog initialized"
3. Check Network tab for: `https://us.i.posthog.com/decide`
4. ✅ **Expected**: PostHog connected successfully

**Test 2: Test Control Variant**
1. Open post detail page: http://localhost:3000/post/[any-id]
2. Use variant toggle (top-right) → Select "control"
3. Verify: Standard post layout, no extra panels
4. Click: Like, Share, add Comment
5. Check PostHog Live Events for: `post_engagement` events

**Test 3: Test Treatment Variant**
1. Use variant toggle → Select "treatment"
2. Verify: Audience Statistics panel appears
3. Check: Political breakdown, attitude breakdown visible
4. Scroll down, interact with page
5. Check PostHog for: `post_scroll_depth` events

**Test 4: Test Comparison Variant**
1. Use variant toggle → Select "comparison"
2. Verify: Representation Comparison panel appears
3. Check: Commenter vs Viewer comparison visible
4. Navigate away (back button)
5. Check PostHog for: `post_dwell_time` event

**Test 5: Feature Flag Assignment**
1. Clear variant override: Click "Clear Override"
2. Refresh page multiple times
3. Note which variant appears (assigned by PostHog)
4. Verify: Same variant appears consistently (sticky assignment)

---

## 📈 Key Metrics to Monitor

### Primary Metrics (Per Specification)

**1. Comment Rate**
- **Formula**: (users who commented / users who viewed) × 100
- **PostHog Query**: Create funnel with `post_viewed` → `post_engagement` (filtered by engagement_type="comment")
- **Compare**: Across all 3 variants
- **Goal**: Treatment or Comparison shows higher rate

**2. Overall Engagement Rate**
- **Formula**: (users who engaged / users who viewed) × 100
- **PostHog Query**: Funnel with `post_viewed` → `post_engagement` (is_positive=true)
- **Compare**: Across variants
- **Goal**: Any increase in engagement

**3. Dwell Time**
- **Formula**: Average of `dwell_time_seconds`
- **PostHog Query**: Trend of `post_dwell_time`, aggregate by AVG(dwell_time_seconds), breakdown by variant
- **Compare**: Across variants
- **Goal**: Higher dwell time indicates more engagement

### Secondary Metrics

**4. Scroll Depth**
- **Formula**: Average of `max_scroll_reached`
- **Goal**: Users scroll further down the page

**5. Positive vs Negative Engagement**
- **Formula**: Count of is_positive=true vs is_positive=false
- **Goal**: More positive engagements

---

## 🔍 PostHog MCP Commands Reference

### View Feature Flags
```javascript
// Get all feature flags
mcp_posthog_feature-flag-get-all()

// Get specific flag details
mcp_posthog_feature-flag-get-definition({
  flagKey: "post_detail_variant_test"
})
```

### Query Events
```javascript
// Search for specific events
mcp_posthog_search-events({
  naturalLanguageQuery: "post_viewed events from last hour",
  limit: 20
})

// Get engagement events
mcp_posthog_search-events({
  naturalLanguageQuery: "post_engagement events with is_positive true",
  limit: 20
})

// Get dwell time metrics
mcp_posthog_search-events({
  naturalLanguageQuery: "average dwell time by variant last 24 hours",
  limit: 50
})
```

### Manage Dashboards
```javascript
// List dashboards
mcp_posthog_dashboards-get-all()

// Get specific dashboard
mcp_posthog_dashboard-get({
  dashboardId: <id>
})

// Create new dashboard
mcp_posthog_dashboard-create({
  data: {
    name: "AB Test Results",
    description: "Post detail page variant performance"
  }
})
```

### Create Insights
```javascript
// Run a query
mcp_posthog_query-run({
  query: {
    kind: "InsightVizNode",
    source: {
      kind: "TrendsQuery",
      series: [{
        kind: "EventsNode",
        event: "post_viewed",
        custom_name: "Post Views"
      }],
      breakdownFilter: {
        breakdown: "variant",
        breakdown_type: "event"
      }
    }
  }
})
```

---

## ✅ Verification Checklist

### PostHog Setup
- [ ] Can access PostHog dashboard
- [ ] Feature flag `post_detail_variant_test` exists and is active
- [ ] Feature flag has 3 variants configured
- [ ] Project ID is 236915

### Event Tracking
- [ ] `post_viewed` events appearing in dashboard
- [ ] `post_engagement` events with correct types
- [ ] `post_dwell_time` events with seconds
- [ ] `post_scroll_depth` events with percentages
- [ ] All events include `variant` property
- [ ] All events include `post_id` property
- [ ] Timestamp format is ISO 8601

### Variant Distribution
- [ ] Events distributed across all 3 variants
- [ ] Approximately 33% distribution per variant
- [ ] Variant assignment is sticky (same user = same variant)
- [ ] Manual override works (variant toggle)

### Data Quality
- [ ] No duplicate events from same user action
- [ ] Dwell time values reasonable (not 0 or extreme)
- [ ] Scroll percentages between 0-100
- [ ] Engagement types correct (like, comment, share, etc.)
- [ ] `is_positive` correctly classified

---

## 🐛 Troubleshooting

### No Events Appearing

**Check**:
1. Browser console for PostHog initialization message
2. Network tab for PostHog API calls (`us.i.posthog.com`)
3. Environment variables set correctly in `.env`
4. No JavaScript errors in console

**Solution**:
- Verify `NEXT_PUBLIC_POSTHOG_KEY` is set
- Check PostHog script loaded: Look for `https://us-assets.i.posthog.com/static/array.js`
- Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Events Missing Properties

**Check**:
1. Event detail panel in PostHog
2. Verify tracking function calls in code
3. Console log tracking calls during testing

**Solution**:
- Check tracking.ts implementation
- Verify property interfaces in events.ts
- Test with console.log before posthog.capture()

### Feature Flag Not Working

**Check**:
1. Feature flag active in dashboard
2. Browser console for "PostHog initialized"
3. usePostVariant hook returning variant

**Solution**:
- Manually test: Use variant toggle to override
- Check localStorage: Look for `posthog_variant_override`
- Verify PostHog loaded: `window.posthog` exists in console

### Variant Always Shows "Control"

**Check**:
1. usePostVariant hook implementation
2. PostHog feature flag returning value
3. localStorage for override

**Debug in Console**:
```javascript
// Check PostHog loaded
window.posthog

// Check feature flag value
window.posthog.getFeatureFlag('post_detail_variant_test')

// Check localStorage
localStorage.getItem('posthog_variant_override')
```

---

## 📊 Expected Results After Testing

### Minimum Viable Verification

After 10-20 minutes of testing across all variants:

**Events Count** (minimum):
- `post_viewed`: 10+ events
- `post_engagement`: 5+ events
- `post_dwell_time`: 5+ events
- `post_scroll_depth`: 10+ events

**Variant Distribution**:
- Each variant has at least 1-2 events
- If using manual override: all events from chosen variant
- If using feature flag: distribution varies per assignment

**Event Quality**:
- All events have required properties
- No events with missing variant
- Timestamps are recent and sequential
- No obvious duplicates

---

## 🎯 Next Steps After Verification

### If Everything Works ✅
1. Document successful verification
2. Share dashboard with team
3. Begin real user testing (remove manual override)
4. Monitor for 1-2 weeks to collect data
5. Analyze results per specification metrics

### If Issues Found ❌
1. Document specific issue in GitHub PR
2. Check browser console for errors
3. Review tracking implementation
4. Verify PostHog configuration
5. Test with PostHog MCP queries to debug

---

## 📞 Support Resources

- **PostHog Docs**: https://posthog.com/docs
- **PostHog Community**: https://posthog.com/questions
- **Our Implementation**: `/projects/2025-10-21_posthog-ab-testing/`
- **PostHog MCP**: Use in Cursor for programmatic access

---

**Ready to Test?** Start your servers and follow Step 1! 🚀

