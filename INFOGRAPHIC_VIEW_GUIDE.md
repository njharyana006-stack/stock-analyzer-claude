# Infographic View - User Guide

## Overview
The Deep Analysis page now features two viewing modes:
- **Classic View**: Original detailed analysis layout
- **Infographic View**: Modern, data-dense visual dashboard

## How to Access

1. Navigate to http://localhost:3000/
2. Run an analysis on any stock ticker
3. You'll see the Deep Analysis page with tabs at the top
4. Look for the view toggle button:
   - **Desktop**: Button appears to the left of the tabs (shows "Infographic" or "Classic")
   - **Mobile**: Button appears above the step indicator dots

## Features of Infographic View

### Hero Section (Top)
- **Confidence Score**: Large circular progress showing AI confidence (0-100%)
- **Current Price**: Live price with animated number counter
- **AI Signal**: Bullish/Bearish/Neutral with strength indicator

### Performance Chart
- Dual-series area chart comparing stock vs S&P 500
- Time range selector: 1D, 1W, 1M, 3M, 6M, 1Y
- Interactive tooltips on hover
- Purple gradient = Your stock
- Teal gradient = S&P 500

### Metric Cards
Four cards showing:
- 1 Day Return
- 1 Week Return
- 1 Month Return
- Year to Date (YTD)

Each card includes:
- Percentage change
- Trend arrow (up/down)
- Mini sparkline chart

### Performance Scores
Three circular progress indicators:
- **Technical Score**: Based on technical analysis
- **Sentiment Score**: Market sentiment rating
- **Risk Alignment**: Match with your risk profile

### Technical Indicators
Horizontal bars showing:
- RSI (14)
- MACD Signal
- 50-Day SMA
- 200-Day SMA

### Financial Health
Horizontal bars displaying:
- P/E Ratio
- Market Cap
- Average Volume
- Dividend Yield

### AI Investment Thesis
- Full investment thesis text
- Potential catalysts (bullish factors)
- Key risks (bearish factors)

## Troubleshooting

### Toggle Button Not Appearing
- Make sure you're on the "Overview" tab (first tab)
- The toggle only appears when viewing the Overview section
- Try refreshing the page

### Blank Screen or Error
Check the browser console (F12) for errors:

**Common issues:**
1. **Missing data**: Some stocks may not have historical data
   - Solution: Try a different, more established stock (e.g., AAPL, MSFT)

2. **Chart not rendering**: Historical data may be missing
   - The chart requires at least 30 days of historical data
   - Try stocks with longer trading history

3. **NaN values**: Financial metrics may be missing
   - The app now handles this gracefully
   - Missing metrics show as "N/A" or 0%

### View Preference Not Saving
- Clear browser localStorage:
  ```javascript
  // In browser console (F12):
  localStorage.removeItem('smartstock_view_mode');
  ```
- Refresh the page
- Select your preferred view again

### Chart Data Not Aligned
- This can happen if S&P 500 data is missing
- The app now uses fallback data (stock price with slight offset)
- Try refreshing the analysis

## Technical Details

### Files Created
1. `components/charts/CircularProgressMetric.tsx`
2. `components/charts/MetricCard.tsx`
3. `components/charts/HorizontalBarMetric.tsx`
4. `components/charts/AreaChartGradient.tsx`
5. `components/analysis_tabs/InfographicOverviewTab.tsx`

### Files Modified
1. `components/TabbedAnalysis.tsx` - Added toggle and routing

### Data Requirements
The infographic view uses data from:
- `analysis.overview` - Basic stock info
- `analysis.individual_analysis` - Technical and financial data
- `analysis.historical_data` - Price history for charts
- `analysis.stock_90_day_performance` - Stock performance data
- `analysis.spy_90_day_performance` - S&P 500 comparison

### LocalStorage Key
- Key: `smartstock_view_mode`
- Values: `'classic'` or `'infographic'`

## Browser Compatibility

Tested and working on:
- ✅ Chrome 120+
- ✅ Edge 120+
- ✅ Firefox 120+
- ✅ Safari 17+

## Performance Notes

- Canvas-based chart rendering for smooth performance
- React.memo optimization on all components
- Animations respect `prefers-reduced-motion`
- Lazy calculation of expensive metrics

## Keyboard Shortcuts

When toggle button is focused:
- `Enter` or `Space`: Toggle view mode
- `Tab`: Navigate to next element

## Dark Mode

Both views fully support dark mode:
- Automatic detection of system preference
- Manual toggle via settings
- All charts and metrics adapt colors

## Future Enhancements

Planned features:
- [ ] Export infographic as PNG
- [ ] Customize which metrics to show
- [ ] Compare multiple stocks side-by-side
- [ ] Animation speed control
- [ ] Print-friendly layout

## Getting Help

If you encounter issues:
1. Check browser console (F12) for errors
2. Verify you're using a supported browser
3. Try clearing cache and localStorage
4. Test with a well-known stock (AAPL, MSFT, GOOGL)
5. Restart the dev server: `npm run dev`

## Example Flow

```
1. Navigate to http://localhost:3000/
2. Enter "AAPL" in search
3. Click "Analyze"
4. Wait for analysis to complete
5. You'll see Overview tab (classic view by default)
6. Click "Infographic" button (desktop: left of tabs, mobile: above dots)
7. Enjoy the visual data presentation!
8. Click "Classic" to switch back
```

---

**Last Updated**: 2026-02-05
**Status**: ✅ Live and Ready to Use
