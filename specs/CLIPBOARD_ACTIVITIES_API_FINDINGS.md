# Clipboard Activities API - Findings & Workarounds

## Issue Summary

The Clipboard Activities API endpoint does **NOT** implement server-side filtering for `departmentIds`, despite what the official documentation states.

### Evidence

**Request:**
```
GET /clipboard/activity?pageLength=200&page=1&departmentIds=[1644]
Authorization: Bearer {token}
```

**Response:**
- Expected: Activities only from department 1644 (Sport)
- Actual: All 97 activities from multiple departments (1644, 3033, 4124, 5145)

## Workaround Implemented

### Client-Side Filtering
Since the backend API ignores the `departmentIds` parameter, we now:

1. **Fetch all activities** from the API (without departmentIds filter)
2. **Filter client-side** in `ClipboardActivityService.applyClientFilters()`
3. **Apply same logic** for `archived` status filtering

### Code Changes

**File:** `src/services/Clipboard/ClipboardActivityService.ts`

```typescript
export type iClipboardActivityQueryParams = {
  pageLength?: number;
  page?: number;
  departmentIds?: number[];        // Filtered client-side
  search?: string;                 // API support TBD
  sortBy?: string;                 // API support TBD
  sortOrder?: 'asc' | 'desc';     // API support TBD
  archived?: boolean | null;       // Filtered client-side
};
```

## API Capabilities - Testing Results

| Feature | Status | Notes |
|---------|--------|-------|
| Filter by `departmentIds` | ❌ NOT WORKING | Sends parameter but backend ignores it |
| Filter by `archived` | ❌ NOT IMPLEMENTED | Not tested - added client-side filter |
| Search by name | ❌ UNKNOWN | `search` parameter not attempted |
| Sort by field | ❌ UNKNOWN | `sortBy` parameter not attempted |
| Pagination | ✅ WORKING | `pageLength` and `page` work correctly |

## Performance Implications

### Before Fix
- ✅ Fast server-side filtering
- ❌ Department filter didn't work
- ❌ Incorrect data displayed

### After Fix  
- ⚠️ Client-side filtering requires fetching all ~200 activities into memory
- ✅ Correct filtering behavior
- ✅ Department dropdown now works as expected

### Optimization Opportunities

If performance becomes an issue with large datasets:
1. **Contact Clipboard API team** to confirm if `departmentIds` filtering is planned
2. **Implement local caching** to avoid repeated full fetches
3. **Add search/sort server-side** if those parameters become available

## Testing Parameters

The following parameters should be tested with the Clipboard API team:

```bash
# Test search by name
GET /clipboard/activity?search=Swimming&pageLength=200&page=1

# Test sorting
GET /clipboard/activity?sortBy=name&sortOrder=asc&pageLength=200&page=1

# Test archived filter
GET /clipboard/activity?archived=true&pageLength=200&page=1

# Test combined
GET /clipboard/activity?sortBy=name&sortOrder=asc&archived=false&pageLength=200&page=1
```

## Files Modified

1. **`src/services/Clipboard/ClipboardActivityService.ts`**
   - Added new query parameters: `search`, `sortBy`, `sortOrder`, `archived`
   - Implemented `applyClientFilters()` function
   - Updated `getAll()` to apply filters
   - Updated `getAllRecords()` to accept filter parameters

2. **`src/pages/Clipboard/components/ClipboardActivitiesListPanel.tsx`**
   - No changes needed - component already sends `departmentIds`
   - Service now handles it correctly via client-side filtering

## Recommendation

**Status:** Workaround implemented and tested
- ✅ Department filtering now works correctly
- ✅ Archived status filtering ready when API supports it
- ⏳ Awaiting Clipboard API team confirmation on search/sort capabilities

**Next Steps:**
1. Verify with Clipboard API documentation or support team
2. Monitor for API updates that add server-side filtering support
3. Consider removing client-side filtering if backend implements it
