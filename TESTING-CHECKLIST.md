# Testing Checklist - AI Weather

This document provides a comprehensive testing checklist for verifying the application's functionality, security, and error handling.

---

## Prerequisites

- Backend running on `http://localhost:3001`
- Frontend running on `http://localhost:3000`
- Browser developer tools open for error inspection

---

## 1. Core Functionality Tests

### Search Functionality
- [ ] **Valid City Search**
  - Enter "Tokyo" → Should navigate to `/city/Tokyo`
  - Verify weather data displays correctly
  - Check all metrics: temperature, feelsLike, humidity, wind, condition

- [ ] **Autocomplete Dropdown**
  - Type "Ky" → Should show suggestions after 300ms
  - Select suggestion → Should navigate to city page
  - Verify dropdown closes on selection

- [ ] **Location Detection**
  - Grant location permission → Should navigate to detected city
  - Deny location permission → Should allow manual search
  - Check console for no errors

### Navigation
- [ ] **Direct URL Access**
  - Visit `/city/Tokyo` → Should display Tokyo weather
  - Visit `/city/New%20York` → Should handle URL encoding
  - Visit `/city/InvalidCity12345` → Should show 404 page

- [ ] **Link Navigation**
  - Click "AI Weather" link on city page → Should return to home
  - Verify browser back button works correctly

---

## 2. Input Validation Tests

### Valid Inputs
- [ ] **Standard City Names**
  - "Tokyo", "London", "New York", "São Paulo"
  - All should work correctly

- [ ] **Cities with Spaces**
  - "New York", "Buenos Aires", "Kuala Lumpur"
  - Verify URL encoding handles spaces correctly

- [ ] **Cities with Special Characters**
  - "São Paulo", "México City", "Zürich"
  - Verify encoding/decoding works

- [ ] **Non-ASCII Characters**
  - Japanese: "東京", "大阪"
  - Chinese: "北京", "上海"
  - Verify backend handles properly

### Invalid Inputs (Should show errors)
- [ ] **Empty Input**
  - Submit empty form → Should show "Please enter a city name."

- [ ] **Too Long Input**
  - Enter 101+ character string → Should show "City name is too long"
  - Backend should reject (100 char limit)

- [ ] **Invalid Characters**
  - Enter `<script>alert('xss')</script>` → Should show validation error
  - Enter `{}[]\\` → Should show validation error

- [ ] **Nonexistent Cities**
  - Enter "InvalidCity12345" → Should show 404 page
  - Verify error message is user-friendly

---

## 3. Error Handling Tests

### Network Errors
- [ ] **Backend Offline**
  - Stop backend server
  - Try to search → Should show error message
  - Verify error is user-friendly (not raw error)

- [ ] **Slow Network**
  - Throttle network to "Slow 3G"
  - Search for city → Should handle timeout gracefully

- [ ] **Invalid Backend URL**
  - Change `NEXT_PUBLIC_API_BASE_URL` to invalid URL
  - Try to search → Should show error

### Server Errors
- [ ] **Rate Limiting**
  - Make 21+ requests in 1 minute from same IP
  - Should receive 429 (Too Many Requests)
  - Verify error message is clear

- [ ] **Provider Errors**
  - (If possible) Simulate provider API failure
  - Verify backend handles gracefully
  - Check logs are sanitized (no sensitive data)

---

## 4. Security Tests

### Input Sanitization
- [ ] **XSS Prevention**
  - Try inputs with HTML/JS: `<script>`, `onerror=`, etc.
  - Verify input is sanitized
  - Check no scripts execute

- [ ] **SQL Injection** (Backend)
  - Try inputs with SQL patterns: `' OR '1'='1`
  - Verify backend handles safely (no SQL queries, but good practice)

### CORS
- [ ] **CORS Validation**
  - Try accessing API from different origin
  - Should be blocked if not in `FRONTEND_ORIGIN`
  - Verify CORS headers are correct

### Rate Limiting
- [ ] **Rate Limit Enforcement**
  - Make rapid requests (use script or browser)
  - Verify 429 response after limit
  - Verify limit resets after time window

### Logging
- [ ] **Log Sanitization**
  - Check backend logs
  - Verify query parameters are masked (`city=***`)
  - Verify no sensitive data in logs

---

## 5. Edge Cases

### URL Handling
- [ ] **URL Encoding**
  - Cities with spaces: "New York" → `/city/New%20York`
  - Cities with special chars: "São Paulo" → proper encoding
  - Verify decoding works correctly

- [ ] **Malformed URLs**
  - Try `/city/` (empty)
  - Try `/city/%E2%80%8B` (zero-width space)
  - Should handle gracefully

### Edge Case Inputs
- [ ] **Very Long Names**
  - Test with 100 character city name (at limit)
  - Test with 101+ characters (should fail)

- [ ] **Special Characters**
  - Emoji: "New York 🗽"
  - Unicode: Various scripts
  - Verify backend handles or rejects appropriately

- [ ] **Whitespace**
  - "  Tokyo  " (leading/trailing spaces)
  - Should be trimmed correctly

---

## 6. UI/UX Tests

### Loading States
- [ ] **Skeleton Loading**
  - Search for city → Should show skeleton
  - Verify skeleton matches layout
  - Verify smooth transition to content

- [ ] **Location Detection Loading**
  - Grant location → Should show loading state
  - Verify smooth navigation

### Error States
- [ ] **Error Display**
  - Trigger various errors
  - Verify error messages are user-friendly
  - Check error styling is clear

- [ ] **404 Page**
  - Visit invalid city URL
  - Verify custom 404 page displays
  - Verify "Back to Search" link works

### Responsive Design
- [ ] **Mobile (480px)**
  - Test on mobile viewport
  - Verify touch targets are adequate (48px min)
  - Check layout is usable

- [ ] **Tablet (720px)**
  - Test on tablet viewport
  - Verify grid layout adapts
  - Check spacing is appropriate

- [ ] **Desktop (1024px+)**
  - Test on desktop viewport
  - Verify optimal use of space
  - Check animations work smoothly

### Accessibility
- [ ] **Keyboard Navigation**
  - Tab through form elements
  - Verify focus indicators visible
  - Test Escape key closes dropdown

- [ ] **Screen Reader**
  - Use screen reader (if available)
  - Verify ARIA labels are read
  - Check semantic HTML structure

---

## 7. Performance Tests

### Load Times
- [ ] **Initial Load**
  - Check page load time
  - Verify skeleton appears quickly
  - Check no layout shift

- [ ] **API Response Times**
  - Check network tab
  - Verify responses are reasonable (<2s)
  - Check cache is working (second request faster)

### Caching
- [ ] **Cache Functionality**
  - Request same city twice
  - Second request should be faster
  - Check cache stats endpoint shows hits

---

## 8. Integration Tests

### End-to-End Flow
- [ ] **Complete User Journey**
  1. Load homepage
  2. Search for "Tokyo"
  3. View weather data
  4. Navigate back to home
  5. Use autocomplete
  6. Select suggestion
  7. View weather data
  8. Share URL
  9. Open shared URL in new tab
  10. Verify data displays correctly

### Error Recovery
- [ ] **Error Recovery Flow**
  1. Trigger error (invalid city)
  2. Verify error message
  3. Try again with valid city
  4. Verify app recovers gracefully

---

## 9. Browser Compatibility

### Modern Browsers
- [ ] **Chrome/Edge** (Chromium)
- [ ] **Firefox**
- [ ] **Safari**
- [ ] **Mobile Safari** (iOS)
- [ ] **Chrome Mobile** (Android)

Verify core functionality works in each.

---

## 10. Security Checklist

- [ ] **Input Validation**
  - Frontend validates before submission
  - Backend validates all inputs
  - No raw user input in logs

- [ ] **Error Messages**
  - No sensitive information leaked
  - User-friendly error messages
  - No stack traces exposed

- [ ] **CORS Configuration**
  - Restricted to known origins
  - No wildcard CORS

- [ ] **Rate Limiting**
  - Working and enforced
  - Appropriate limits set

- [ ] **Logging**
  - Query parameters sanitized
  - No API keys in logs
  - No sensitive data logged

---

## Quick Test Script (PowerShell)

```powershell
# Test valid cities
$cities = @("Tokyo", "London", "New York", "São Paulo")
foreach ($city in $cities) {
    Write-Host "Testing: $city"
    $encoded = [System.Web.HttpUtility]::UrlEncode($city)
    $url = "http://localhost:3001/weather?city=$encoded"
    Invoke-WebRequest -Uri $url | Select-Object StatusCode
}

# Test invalid city
Write-Host "Testing invalid city..."
Invoke-WebRequest -Uri "http://localhost:3001/weather?city=InvalidCity12345" -ErrorAction SilentlyContinue

# Test rate limiting (make 25 requests)
Write-Host "Testing rate limiting..."
1..25 | ForEach-Object {
    $result = Invoke-WebRequest -Uri "http://localhost:3001/weather?city=Tokyo" -ErrorAction SilentlyContinue
    Write-Host "Request $_ : Status $($result.StatusCode)"
}
```

---

## Notes

- Mark each test as ✅ (Pass) or ❌ (Fail)
- Note any issues or edge cases discovered
- Update this checklist as new test cases are identified
- Regular testing should be done before deployments

