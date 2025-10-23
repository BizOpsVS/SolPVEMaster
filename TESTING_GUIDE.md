# 🎮 SolPVE Testing Guide

## 🚀 **How to Test the Application**

### **1. Start the Application**
```bash
# Make sure you're in the project directory
cd /Users/lancedurand/Documents/GitHub/SolPVEMaster

# Set up PATH if needed
export PATH="/usr/local/bin:$PATH"

# Start the development server
npm run dev
```

The application will be available at: **http://localhost:5001/**

---

## 🎯 **Testing Scenarios**

### **A. New User Onboarding**
1. **Open the application** - You should see the modern neon-dark design
2. **Click "How to Play"** button in the header
3. **Go through the tutorial** - 5 interactive steps explaining:
   - What SolPVE is
   - How to play (3-step process)
   - Pool timing (enrollment → lock → resolve)
   - How payouts work (with examples)
   - Understanding AI confidence

### **B. Pool Interaction**
1. **View Available Pools** - You should see pools in different states:
   - **OPEN** pools (green badge) - Available for staking
   - **LOCKED** pools (yellow badge) - In progress
   - **RESOLVED** pools (gray badge) - Completed

2. **Test Stake Placement**:
   - Click "Over" or "Under" button on any OPEN pool
   - Stake modal should open
   - Select a side (Over/Under)
   - Enter amount (minimum 1 SOL)
   - Click "Place Stake"
   - Should see success message

3. **Pool States**:
   - **OPEN**: Buttons enabled, can place stakes
   - **LOCKED**: Buttons disabled, shows "LOCKED" status
   - **RESOLVED**: Buttons disabled, shows "RESOLVED" status

### **C. Real-time Updates**
1. **Pool Lifecycle**: Pools automatically transition from OPEN → LOCKED → RESOLVED
2. **Timer Updates**: Countdown timers update in real-time
3. **Pool Data**: Pool pots update when stakes are placed

### **D. UI/UX Features**
1. **Responsive Design**: Test on different screen sizes
2. **Loading States**: Skeleton loading for pools
3. **Empty States**: When no pools are available
4. **Error Handling**: Try invalid inputs in stake modal
5. **Visual Feedback**: Hover effects, transitions, animations

---

## 🔧 **Technical Testing**

### **Pool Service Testing**
The `poolService` provides these methods:
```typescript
// Get all pools
await poolService.getPools()

// Get pools by status
await poolService.getPoolsByStatus("OPEN")

// Place a stake
await poolService.placeStake(poolId, userId, "OVER", 5.0)

// Cancel a stake
await poolService.cancelStake(stakeId, userId)

// Get user stakes
await poolService.getUserStakes(userId)
```

### **Business Logic Validation**
1. **Enrollment Window**: 40% of duration, capped at 10 minutes
2. **Stake Limits**: Min 1 SOL, Max 20% of pot per user per side
3. **Pool Status Transitions**: OPEN → LOCKED → RESOLVED
4. **Payout Calculations**: Proportional distribution among winners

---

## 🎨 **Design Testing**

### **Visual Elements**
- ✅ **Neon-dark theme** with purple/cyan gradients
- ✅ **Rounded cards** with soft shadows
- ✅ **Status badges** with appropriate colors
- ✅ **Progress bars** for Over/Under distribution
- ✅ **Timer displays** with real-time updates
- ✅ **Interactive buttons** with hover effects

### **Accessibility**
- ✅ **Clear typography** with good contrast
- ✅ **Intuitive icons** and visual cues
- ✅ **Responsive layout** for all devices
- ✅ **Loading states** and error messages

---

## 🚨 **Common Issues & Solutions**

### **Issue: White Screen**
- **Cause**: JavaScript errors preventing React from rendering
- **Solution**: Check browser console for errors, ensure all imports are correct

### **Issue: Pools Not Loading**
- **Cause**: Pool service not initialized properly
- **Solution**: Check that `poolService` is imported and called correctly

### **Issue: Stake Modal Not Opening**
- **Cause**: Event propagation or state management issues
- **Solution**: Check that `onClick` handlers are properly set up

### **Issue: Timer Not Updating**
- **Cause**: Timer component not receiving correct props
- **Solution**: Verify `lockTs`, `endTs`, and `status` props are correct

---

## 📊 **Performance Testing**

### **Load Testing**
1. **Multiple Pools**: Test with 10+ pools simultaneously
2. **Rapid Interactions**: Click buttons quickly
3. **Memory Usage**: Monitor browser memory during extended use
4. **Network Requests**: Check for unnecessary API calls

### **Real-time Updates**
1. **Pool Transitions**: Watch pools change from OPEN → LOCKED → RESOLVED
2. **Timer Accuracy**: Verify countdown timers are accurate
3. **State Synchronization**: Ensure UI reflects actual pool states

---

## 🎯 **Success Criteria**

### **✅ Application Should:**
1. **Load quickly** and display the modern design
2. **Show interactive tutorial** that explains the game clearly
3. **Display pools** in different states with proper visual indicators
4. **Allow stake placement** with proper validation
5. **Update in real-time** as pools transition through states
6. **Handle errors gracefully** with user-friendly messages
7. **Work responsively** on different screen sizes

### **✅ User Experience Should:**
1. **Be intuitive** - new users understand the game quickly
2. **Provide feedback** - clear success/error messages
3. **Feel responsive** - smooth animations and transitions
4. **Be accessible** - good contrast, readable text, clear icons

---

## 🔄 **Continuous Testing**

### **During Development**
1. **Hot Reload**: Changes should appear instantly
2. **State Persistence**: Pool data should persist across reloads
3. **Error Recovery**: App should recover from errors gracefully

### **Before Production**
1. **Cross-browser Testing**: Chrome, Firefox, Safari, Edge
2. **Mobile Testing**: iOS Safari, Android Chrome
3. **Performance Testing**: Load times, memory usage
4. **Security Testing**: Input validation, XSS prevention

---

## 🎊 **Ready for Colosseum Hackathon!**

Your SolPVE application now features:
- ✅ **Complete business logic implementation**
- ✅ **Interactive tutorial system**
- ✅ **Real-time pool management**
- ✅ **Modern neon-dark UI/UX**
- ✅ **Comprehensive error handling**
- ✅ **Responsive design**
- ✅ **Live stake placement**

**Test everything thoroughly and you're ready to showcase at the hackathon!** 🚀
