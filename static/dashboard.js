 function getEmissionLevel(emissionTons) {
    if (emissionTons >= 100 && emissionTons <= 500) {
        return { label: "Safe", color: "#22c55e", zone: 1 };
    } else if (emissionTons >= 1000 && emissionTons <= 5000) {
        return { label: "Moderate", color: "#f59e0b", zone: 2 };
    } else if (emissionTons > 5000) {
        return { label: "High", color: "#ef4444", zone: 3 };
    } else {
        // fallback for values between 500–1000
        return { label: "Moderate", color: "#f59e0b", zone: 2 };
    }
}

function updateEmissionGauge(zone) {
    const needle = document.getElementById("emissionNeedle");
    if (!needle) return;

    let rotation = 0;

    if (zone === 1) rotation = -60;      // Safe
    else if (zone === 2) rotation = 0;   // Moderate
    else if (zone === 3) rotation = 60;  // High

    needle.style.transform = `rotate(${rotation}deg)`;
}
// MediVolt Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation handling
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    const pages = document.querySelectorAll('.page-content');
    const headerTitle = document.querySelector('.header-left h1');

    const pageTitles = {
        'dashboard': 'Energy Dashboard',
        'realtime': 'Real-time Monitor',
        'department': 'Department Analysis',
        'cost': 'Cost Analysis',
        'alerts': 'Alert System',
        'weather': 'Weather Impact',
        'energy': 'Energy Prediction',
        'hvac': 'HVAC Optimization',
        'carbon': 'Carbon Forecast',
        'reports': 'Reports',
        'settings': 'Settings'
    };

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            const pageName = this.getAttribute('data-page');
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById('page-' + pageName).classList.add('active');
            headerTitle.textContent = pageTitles[pageName] || 'Dashboard';
        });
    });

   

    // Feature card navigation
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('click', function() {
            const feature = this.getAttribute('data-feature');
            navItems.forEach(nav => nav.classList.remove('active'));
            document.querySelector(`.nav-item[data-page="${feature}"]`).classList.add('active');
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById('page-' + feature).classList.add('active');
            headerTitle.textContent = pageTitles[feature];
        });
    });

    // ==================== CALCULATION FUNCTIONS ====================
    
   

    // HVAC Optimization Calculation
    function calculateHVACOptimization(currentTemp, occupancy, timeOfDay, weather) {
        let optimalTemp = 22;
        const occupancyMap = {'Low (0-20%)': 1, 'Medium (20-60%)': 0, 'High (60-100%)': -1};
        optimalTemp += occupancyMap[occupancy];
        const timeMap = {'Morning (6AM-12PM)': 0, 'Afternoon (12PM-6PM)': 1, 'Evening (6PM-10PM)': 0, 'Night (10PM-6AM)': -2};
        optimalTemp += timeMap[timeOfDay];
        const weatherMap = {'Sunny': -1, 'Cloudy': 0, 'Rainy': 1, 'Humid': -1};
        optimalTemp += weatherMap[weather];
        const tempDiff = Math.abs(currentTemp - optimalTemp);
        let savingsPercent = Math.min(tempDiff * 3, 25);
        if (currentTemp > optimalTemp) savingsPercent += 5;
        const monthlySavings = Math.round(50 * savingsPercent / 100 * 30 * 0.12);
        return { optimalTemp, savingsPercent: Math.round(savingsPercent * 10) / 10, monthlySavings };
    }

    // Carbon Emission Calculation
    function calculateCarbonEmissions(energyConsumption, energySource) {
        const emissionFactors = {'Mixed Grid': 0.5, 'Grid + Solar': 0.35, 'Coal-based': 0.9, 'Renewable 100%': 0.05};
        const factor = emissionFactors[energySource];
        const dailyEmissions = (energyConsumption * factor) / 1000;
        return { dailyEmissions: Math.round(dailyEmissions * 100) / 100, targetEmissions: Math.round(dailyEmissions * 0.7 * 100) / 100 };
    }

    // Real-time Update Function
    function updateRealTime() {
        const currentPower = Math.round(120 + Math.random() * 80);
        const todayKwh = Math.round(3000 + Math.random() * 500);
        const peakPower = Math.round(150 + Math.random() * 40);
        const todayCost = Math.round(todayKwh * 0.12);
        
        const currentPowerEl = document.getElementById('currentPower');
        const todayKwhEl = document.getElementById('todayKwh');
        const peakPowerEl = document.getElementById('peakPower');
        const todayCostEl = document.getElementById('todayCost');
        
        if (currentPowerEl) currentPowerEl.textContent = currentPower + ' kW';
        if (todayKwhEl) todayKwhEl.textContent = todayKwh.toLocaleString();
        if (peakPowerEl) peakPowerEl.textContent = peakPower;
        if (todayCostEl) todayCostEl.textContent = '$' + todayCost;
        
        const loadPercent = (currentPower / 200) * 100;
        const loadStatusEl = document.getElementById('loadStatus');
        const loadBarEl = document.getElementById('loadBar');
        const loadDescEl = document.getElementById('loadDesc');
        
        if (loadStatusEl && loadBarEl && loadDescEl) {
            loadBarEl.style.width = Math.min(loadPercent, 100) + '%';
            if (loadPercent > 85) { loadStatusEl.className = 'risk-badge high'; loadStatusEl.textContent = 'HIGH'; loadDescEl.textContent = 'Power consumption exceeds safe limits!'; }
            else if (loadPercent > 65) { loadStatusEl.className = 'risk-badge medium'; loadStatusEl.textContent = 'ELEVATED'; loadDescEl.textContent = 'Power consumption elevated - monitor closely'; }
            else { loadStatusEl.className = 'risk-badge low'; loadStatusEl.textContent = 'NORMAL'; loadDescEl.textContent = 'Power consumption within normal range'; }
        }
        console.log('Real-time data updated');
    }

    // Department Analysis
    function calculateDepartmentAnalysis(dept, units, hours) {
        const deptFactors = {'ICU': 45, 'Operating Rooms': 38, 'Laboratories': 28, 'Patient Wards': 18, 'Cold Storage': 22, 'Pharmacy': 8};
        const baseFactor = deptFactors[dept] || 20;
        const dailyConsumption = Math.round(units * baseFactor * (hours / 24));
        const efficiency = Math.max(50, Math.min(95, 100 - (dailyConsumption / 50)));
        return { consumption: dailyConsumption, efficiency: Math.round(efficiency), monthly: dailyConsumption * 30, cost: Math.round(dailyConsumption * 30 * 0.12) };
    }

    // Cost Analysis
    function calculateCostAnalysis(budget, spend) {
        const usagePercent = (spend / budget) * 100;
        const remaining = budget - spend;
        return { usagePercent: Math.round(usagePercent * 10) / 10, remaining, monthlySavings: Math.round(spend * 0.15) };
    }

    // Weather Impact
    function calculateWeatherImpact(temp, humidity, condition) {
        let impactPercent = 0;
        if (temp > 25) impactPercent += (temp - 25) * 4;
        else if (temp < 18) impactPercent += (18 - temp) * 3;
        if (humidity > 60) impactPercent += (humidity - 60) * 0.3;
        if (condition === 'Sunny') impactPercent += 10;
        if (condition === 'Humid') impactPercent += 15;
        
        let risk = 'low';
        if (impactPercent > 25) risk = 'high';
        else if (impactPercent > 15) risk = 'medium';
        
        return { impact: Math.round(impactPercent), risk, coolingLoad: Math.round(impactPercent * 1.2) };
    }

    // ==================== FORM HANDLERS ====================
    // Energy Prediction (BACKEND ML)

   
    

    // HVAC Optimization
    const hvacForm = document.getElementById('hvacForm');
    if (hvacForm) {
        hvacForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const currentTemp = parseFloat(document.getElementById('currentTemp').value) || 22;
            const occupancy = document.getElementById('occupancy').value;
            const timeOfDay = document.getElementById('timeOfDay').value;
            const weather = document.getElementById('weather').value;
            
            const result = calculateHVACOptimization(currentTemp, occupancy, timeOfDay, weather);
            
            const tempValue = document.querySelector('.hvac-result .temp-value');
            if (tempValue) tempValue.textContent = result.optimalTemp;
            
            const savingsItems = document.querySelectorAll('.savings-item .savings-value');
            if (savingsItems[0]) savingsItems[0].textContent = result.savingsPercent + '%';
            if (savingsItems[1]) savingsItems[1].textContent = '$' + result.monthlySavings;
            
            console.log('HVAC optimization:', result);
        });
    }

   // ================= CARBON FORECAST (BACKEND CONNECTED) =================
const carbonForm = document.getElementById('carbonForm');

if (carbonForm) {
    carbonForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const payload = {
              energy: Number(document.getElementById('energyConsumption').value)
};

        try {
            const response = await fetch("/api/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.prediction !== undefined) {
                const rawValue = Number(data.prediction);

// 🔥 convert to tons scale (thousands)
                const value = rawValue * 100;
                console.log("CARBON VALUE:", value);
                const levelInfo = getEmissionLevel(value);
                updateEmissionGauge(levelInfo.zone);

                // ✅ Update main number
                const emissionValue = document.querySelector('.emission-result .emission-value');
                if (emissionValue) emissionValue.textContent = value;

                // ✅ Update comparison bars
                const currentBar = document.querySelector('.comparison-bar.current .bar-fill');
                const targetBar = document.querySelector('.comparison-bar.target .bar-fill');

                if (currentBar) currentBar.style.width = Math.min(value * 40, 100) + '%';
                if (targetBar) targetBar.style.width = Math.min(value * 28, 100) + '%';

                
                // ✅ Update emission level using your ranges
const riskEl = document.getElementById('carbonRisk')
    ?.querySelector('.risk-badge');


if (riskEl) {
    riskEl.textContent = levelInfo.label.toUpperCase();

    if (levelInfo.zone === 1) {
        riskEl.className = "risk-badge low";
    } else if (levelInfo.zone === 2) {
        riskEl.className = "risk-badge medium";
    } else {
        riskEl.className = "risk-badge high";
    }
}

                console.log("Carbon prediction:", value);
            } else {
                console.error("Invalid response:", data);
                alert("Prediction failed");
            }

        } catch (error) {
    console.error("Carbon API error:", error);
}
    });
}

    // Download buttons
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', function() { alert('Report download started!'); });
    });

    // Save button
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() { alert('Settings saved successfully!'); });
    }

    console.log('MediVolt Dashboard initialized');
});

