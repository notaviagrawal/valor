# Scroll Functionality - Debug Guide

## What Should Happen

1. **Scroll down** → Model rotation speeds up gradually
2. **After 3-4 full scrolls** → Threshold reached (300 units)
3. **Auto-transition** → White text section appears
4. **Scroll up** from text → Return to 3D scene

## Debug Steps

### 1. Refresh the page at http://localhost:8001

### 2. Open Browser Console (F12 or Cmd+Option+I)

### 3. Look for these messages:

- ✅ `Event listeners registered. Waiting for scroll...`
- ✅ `✅ Scroll enabled! You can now scroll to speed up rotation.`
- ✅ `Scroll event fired:` (when you scroll)
- ✅ `Rotation speed:` and `Accumulator:` values
- ✅ `Current rotation speed:` (every second)

### 4. When scrolling, you should see:

```
Scroll event fired: {scrollEnabled: true, isTransitioning: false, delta: 100, accumulator: 0}
Rotation speed: 0.025 Accumulator: 100
```

The accumulator should increase with each scroll until it reaches 300, then:
```
Threshold reached! Showing text section
```

## Troubleshooting

### If you don't see "Scroll event fired":
- Your browser may be blocking the wheel event
- Try scrolling with different methods (trackpad, mouse wheel)
- Check if any browser extensions are interfering

### If scrollEnabled is false:
- Wait for loading to complete
- Check if loading screen removed successfully

### If rotation doesn't speed up:
- Check console for rotation speed logs
- Verify `params.autoRotate` is true (check GUI panel)
- Make sure pivotGroup exists

## Current Settings

- Base rotation speed: `0.005`
- Speed multiplier: `scrollAccumulator / 5000`
- Threshold: `300` units (≈ 3-4 scrolls)
- Decay rate: `0.95` (when you stop scrolling)
- Decay delay: `150ms` after last scroll

## Quick Fix

If nothing works, try:
1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Clear browser cache
3. Check if auto-rotate is ON in the GUI panel (top right)
