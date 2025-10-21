# Brain Dump: PostHog A/B Testing for Post Detail Page Variants

**Date**: October 21, 2025  
**Project**: A/B Testing Post Detail Page with PostHog  
**Status**: Initial Brainstorming

---

## 🎯 Project Goal

Implement A/B testing infrastructure using PostHog to test 3 different variants of the post detail page (`/post/{hash_id}`) and measure user engagement to determine which variant performs best.

---

## 📋 Core Requirements

### PostHog Setup
- **MCP Integration**: Set up PostHog Model Context Protocol for AI-assisted analytics
  - Need to install PostHog MCP server in Cursor
  - Requires PostHog personal API key with MCP Server preset
  - Configure via `npx @posthog/wizard mcp add` command
  
- **PostHog Account Setup**
  - Need PostHog account (cloud or self-hosted?)
  - Create project for social media app
  - Get project API key and host URL
  - Configure environment variables in frontend

- **SDK Integration**
  - Install PostHog JavaScript SDK in Next.js frontend
  - Configure PostHog provider at app root
  - Set up feature flags for A/B testing
  - Initialize tracking on page load

### A/B Test Configuration

**3 Variants to Test**:
1. **Variant A (Control)**: Current post detail page design (no intervention)
2. **Variant B (Treatment - With Representational Feedback)**: Show audience statistics including:
   - Political breakdown of viewers (Liberal/Moderate/Conservative percentages with bar graphs)
   - Attitudes on the post topic (Support/Neutral/Oppose percentages with bar graphs)
   - Trust indicators and methodology explanations
   - Warning that comments may not represent all viewers
3. **Variant C (Lurker-Commenter Comparison)**: Show comparison between:
   - Commenters' attitudes vs all viewers' attitudes
   - Highlight when there's divergence between visible comments and overall audience
   - Warning about representational accuracy


**Post View (Control - No Intervention)**:

```
┌─────────────────────────────────────────────┐
│ Post: "Should minimum wage be $20/hour?"   │
│                                             │
│ [Post content]                              │
│                                             │
│ Comments (12)                               │
│ ├─ User123: "That's way too high..."       │
│ ├─ User456: "Actually studies show..."     │
│ └─ [more comments]                          │
└─────────────────────────────────────────────┘
```

**Post View (Treatment - With Representational Feedback)**:

```
┌─────────────────────────────────────────────┐
│ Post: "Should minimum wage be $20/hour?"   │
│                                             │
│ [Post content]                              │
│                                             │
│ 👁️ AUDIENCE STATISTICS (Last 24 hours)     │
│ ┌─────────────────────────────────────────┐ │
│ │ 247 people viewed this post             │ │
│ │                                         │ │
│ │ Political Breakdown:                    │ │
│ │ ████████░░ 45% Liberal                  │ │
│ │ ████░░░░░░ 25% Moderate                 │ │
│ │ ██████░░░░ 30% Conservative             │ │
│ │                                         │ │
│ │ Attitudes on this post:                 │ │
│ │ ████████░░ 62% Support raising min wage │ │
│ │ ██░░░░░░░░ 15% Neutral                  │ │
│ │ ████░░░░░░ 23% Oppose                   │ │
│ │                                         │ │
│ │ ℹ️ These statistics show ALL viewers,   │ │
│ │    not just those who commented.        │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ 💬 Comments (12)                            │
│ ⚠️ Note: Comments may not represent all     │
│    viewers. See audience statistics above.  │
│ ├─ User123: "That's way too high..."       │
│ ├─ User456: "Actually studies show..."     │
│ └─ [more comments]                          │
└─────────────────────────────────────────────┘
```

**Lurker-Commenter Comparison (When They Diverge)**:

```
┌─────────────────────────────────────────────┐
│ 📊 REPRESENTATION COMPARISON                │
│                                             │
│ Among COMMENTERS (12 people):               │
│ ██░░░░░░░░ 15% Support                      │
│ ████████░░ 85% Oppose                       │
│                                             │
│ Among ALL VIEWERS (247 people):             │
│ ████████░░ 62% Support                      │
│ ████░░░░░░ 23% Oppose                       │
│                                             │
│ ⚠️ The visible comments are not             │
│    representative of all viewers.           │
└─────────────────────────────────────────────┘
```

**Variant Details**:
- **Variant A**: Standard post view with comments
- **Variant B**: Post + audience statistics panel + enhanced comments section with warnings
- **Variant C**: Post + representation comparison panel showing commenter vs viewer divergence

**UI Components**:
- Audience statistics panel with bar graphs
- Trust indicators (methodology tooltips, privacy guarantees)
- Representational accuracy framing (descriptive, not normative)
- Testing toggle in top-right corner for manual variant switching

### Metrics to Track

#### Post-Level Metrics (per individual post)
- **Clicks**: Track what users click on within the post detail page
  - **Positive Engagement**: Like button clicks, share button clicks, comment button clicks, author profile clicks
  - **Negative Engagement**: Back button clicks, page exit clicks
- **Comments**: Number of comments submitted on the post
- **Engagement Events**:
  - Likes added
  - Shares performed
  - Comments posted
- **Dwell Time**: Time spent on the post detail page
  - Time from page load to page exit
  - Active vs passive time (user actively interacting vs idle)
  - Scroll depth (how far user scrolled down the page)

#### User-Level Metrics (aggregated per user)
- **Average likes per post viewed**
- **Average comments per post viewed**
- **Average shares per post viewed**
- **Average dwell time across all posts**
- **Total engagement actions** (likes + comments + shares)
- **Engagement rate** (% of posts where user took action)
- **Return visits** to post detail pages
- **Conversion rate** (viewing → engaging)

#### Variant Performance Metrics
- **Primary Metrics**: 
  - Comment rate (% of users who comment on posts)
  - Overall engagement rate (% of users who like, comment, or share)
  - Dwell time (average time spent on post detail pages)
- **Secondary Metrics**: Supporting metrics to understand behavior
- **Statistical Significance**: Minimum sample size and confidence level needed

---

## 🔧 Technical Implementation Questions

### PostHog SDK Integration
- Where to initialize PostHog in Next.js app?
  - App Router: `app/layout.tsx` or separate provider component?
  - Client-side only or server-side tracking too?
- How to handle user identification?
  - Anonymous users vs identified users?
  - Do we need persistent user IDs across sessions?
  - Cookie-based or localStorage?

### Feature Flags for Variants
- How to implement variant assignment?
  - PostHog feature flags with multivariate testing
  - Equal distribution (33.3% each) or weighted?
  - Should assignment be sticky (same user always sees same variant)?
- Where to check feature flag value?
  - In the post detail page component
  - Client-side or server-side?
  - How to prevent flashing of different variants?

### Event Tracking Implementation
- **Click Tracking**:
  - Automatic click tracking or manual event sending?
  - How to identify which element was clicked?
  - Custom event properties (button type, post ID, user ID)?

- **Dwell Time Tracking**:
  - How to measure: `onMount` → `onUnmount`?
  - Handle page visibility API (tab switching)?
  - Send event on page exit or periodically?
  - What if user closes browser/tab?

- **Engagement Tracking**:
  - Capture existing like/comment/share actions
  - Add PostHog event sending to existing handlers
  - Include context: variant, post ID, timestamp

### Data Structure
```javascript
// Example event structure (to be refined)
{
  event: "post_engagement",
  properties: {
    action: "like" | "comment" | "share",
    post_id: "abc123def456",
    variant: "A" | "B" | "C",
    user_id: "user_xyz",
    session_id: "session_abc",
    dwell_time_seconds: 45,
    timestamp: "2025-10-21T10:30:00Z"
  }
}
```

---

## 📊 Analytics & Reporting

### PostHog Dashboards
- Create dashboard for A/B test results
- Visualizations needed:
  - Variant comparison (engagement rates)
  - Funnel analysis (view → engage → convert)
  - Time series (trends over test period)
  - User cohorts (new vs returning)

### Statistical Analysis
- Minimum sample size calculation
- Test duration (how long to run?)
- Significance level (p < 0.05?)
- Multiple testing correction (Bonferroni for 3 variants?)
- Early stopping criteria?

### Success Criteria
- What engagement rate improvement is meaningful?
  - 10% improvement? 20%?
- Which variant wins?
  - Based on primary metric only?
  - Weighted scoring across multiple metrics?
- What happens after test concludes?
  - Roll out winning variant to 100%?
  - Iterate with new variants?

---

## 🚧 Open Questions & Decisions Needed

### PostHog Configuration
1. **Cloud vs Self-Hosted**: Using PostHog Cloud (easier setup, paid after free tier)
2. **Project Setup**: Single project with environment filtering
3. **MCP Integration**: ✅ Enabled - PostHog MCP server installed in Cursor
4. **Personal API Key**: ✅ Obtained with MCP Server preset

### Variant Design
3. **What are the 3 variants?** ✅ DEFINED:
   - Variant A (Control): Current post detail page design
   - Variant B (Treatment): Post + audience statistics panel with political breakdown and attitudes
   - Variant C (Comparison): Post + representation comparison showing commenter vs viewer divergence

4. **Variant Scope**: UI/CSS changes + new components:
   - Visual changes: Bar graphs, statistics panels, trust indicators
   - Layout restructuring: Adding audience statistics section
   - Functional changes: Testing toggle for manual variant switching
   - Copy/text changes: Trust indicators, methodology explanations

### Metrics & Goals
5. **Primary Success Metrics**: ✅ DEFINED (multiple primary metrics):
   - Comment rate (% of users who comment on posts)
   - Overall engagement rate (% of users who like, comment, or share)
   - Dwell time (average time spent on post detail pages)

6. **User Segmentation**: Should we analyze by user type?
   - New vs returning users
   - Mobile vs desktop
   - Different traffic sources
   - User engagement level (power users vs lurkers)

### Implementation Details
7. **Tracking Granularity**: ✅ DEFINED:
   - Track key actions: positive engagement (like, share, comment, profile clicks) vs negative engagement (back button)
   - Track scroll depth and dwell time (active vs passive)
   - Track comment submissions and engagement events

8. **Performance Impact**: How to minimize overhead?
   - Batch events or send immediately?
   - Sample rate for high-volume events?
   - Impact on page load time?

9. **Testing Environment**: Where to run test?
   - Production only or staging first?
   - Subset of users or all users?
   - Geographic limitations?

---

## 🔗 Dependencies & Prerequisites

### External
- **PostHog Account**: ✅ Created and configured
- **PostHog API Key**: ✅ Project API key obtained for SDK initialization
- **PostHog Personal API Key**: ✅ Obtained with MCP Server preset for MCP integration
- **Variant Designs**: ✅ Defined with detailed UI mockups and specifications

### Internal
- **Existing Codebase**: 
  - Current post detail page (`/post/[id]/page.tsx`) - ✅ Already built
  - Existing engagement handlers (like, comment, share) - ✅ Already implemented
  - User identification system - ⚠️ Currently using hardcoded "current-user"

### Technical
- **Node.js Packages**: 
  - `posthog-js` SDK - Need to install
  - React integration package (if needed) - Need to install
- **Environment Variables**:
  - `NEXT_PUBLIC_POSTHOG_KEY` - Need to configure
  - `NEXT_PUBLIC_POSTHOG_HOST` - Need to configure
- **TypeScript Types**: Define types for PostHog events and properties

---

## 💡 Ideas & Considerations

### Variant Ideas (Brainstorming) ✅ DEFINED
- **Variant A (Control)**: Current post detail page design
- **Variant B (Treatment)**: 
  - Audience statistics panel with political breakdown (Liberal/Moderate/Conservative)
  - Attitudes on post topic (Support/Neutral/Oppose) with bar graphs
  - Trust indicators and methodology explanations
  - Enhanced comments section with warnings about representational accuracy
- **Variant C (Comparison)**:
  - Representation comparison panel showing commenter vs viewer divergence
  - Highlight when visible comments don't represent all viewers
  - Warning about representational accuracy

### Testing Strategy
- **Ramp-up Plan**: 
  - Start with 10% of users in test
  - Monitor for issues
  - Ramp to 100% over 1 week?

- **Rollback Plan**:
  - How to quickly disable test if issues occur?
  - Feature flag kill switch
  - Monitoring alerts for errors or performance degradation

### Privacy & Compliance
- **User Consent**: Do we need cookie consent banner?
- **Data Retention**: How long to keep analytics data?
- **PII Handling**: Ensure no personal data in events (just user IDs)
- **GDPR/CCPA**: Compliance requirements?

---

## 📝 Next Steps (Phase 2)

After brain dump approval:
1. **Define the 3 variants** (get user/designer input)
2. **Set up PostHog account and project**
3. **Install PostHog MCP** (for AI-assisted analytics)
4. **Create detailed specification** following `HOW_TO_WRITE_A_SPEC.md`
5. **Define success metrics and test duration**
6. **Create implementation plan and tickets**

---

## ✅ Questions Answered

All critical questions have been answered:

1. **Variant Design**: ✅ DEFINED - Variants B and C test representational feedback and lurker-commenter comparison
2. **Primary Goals**: ✅ DEFINED - Comment rate, overall engagement, and dwell time (multiple primary metrics)
3. **PostHog Setup**: ✅ COMPLETED - PostHog Cloud account created, MCP integration enabled
4. **User Identification**: ⚠️ PENDING - Currently using "current-user" hardcoded, need to decide on approach
5. **Test Scope**: ⚠️ PENDING - Need to decide on rollout strategy
6. **Timeline**: ⚠️ PENDING - Need to determine test duration

**Remaining Decisions Needed**:
- User identification approach (anonymous vs identified)
- Test rollout strategy (subset vs all users)
- Test duration (fixed vs statistical significance)

---

## 🎯 Success Criteria

This project will be successful when:
- [ ] PostHog is integrated and tracking events correctly
- [ ] 3 variants are implemented and assigned via feature flags
- [ ] All key metrics are being tracked (clicks, engagement, dwell time)
- [ ] Analytics dashboard shows clear variant performance comparison
- [ ] Statistical significance is achieved
- [ ] Winning variant is identified and rolled out
- [ ] Insights are documented for future optimization

---

**Status**: Awaiting user feedback on open questions before proceeding to Phase 2 (Specification)

