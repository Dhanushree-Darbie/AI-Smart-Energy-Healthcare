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
    
    // Energy Prediction Calculation
    function calculateEnergyPrediction(numBeds, equipHours, outdoorTemp, historicalAvg) {
        const basePerBed = 10;
        const equipFactor = equipHours / 24;
        let tempFactor = 1;
        if (outdoorTemp > 30 || outdoorTemp < 15) tempFactor = 1.3;
        else if (outdoorTemp > 25 || outdoorTemp < 18) tempFactor = 1.15;
        let predicted = (numBeds * basePerBed * equipFactor * tempFactor);
        return Math.round((predicted * 0.7) + (historicalAvg * 0.3));
    }

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
    
    // Energy Prediction
    const energyForm = document.getElementById('energyForm');
    if (energyForm) {
        energyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const numBeds = parseFloat(document.getElementById('numBeds').value) || 200;
            const equipHours = parseFloat(document.getElementById('equipHours').value) || 18;
            const outdoorTemp = parseFloat(document.getElementById('outdoorTemp').value) || 25;
            const historicalAvg = parseFloat(document.getElementById('historicalAvg').value) || 2200;
            
            const predicted = calculateEnergyPrediction(numBeds, equipHours, outdoorTemp, historicalAvg);
            const lowEstimate = Math.round(predicted * 0.75);
            const avgEstimate = Math.round(predicted * 0.9);
            const highEstimate = Math.round(predicted * 1.15);
            
            const riskPercent = (predicted / historicalAvg) * 100;
            let riskLevel = 'low';
            if (riskPercent > 120) riskLevel = 'high';
            else if (riskPercent > 100) riskLevel = 'medium';
            
            const resultNumber = document.querySelector('.result-card .result-number');
            if (resultNumber) resultNumber.textContent = predicted.toLocaleString();
            
            const energyRisk = document.getElementById('energyRisk');
            if (energyRisk) {
                energyRisk.querySelector('.risk-badge').className = 'risk-badge ' + riskLevel;
                energyRisk.querySelector('.risk-badge').textContent = riskLevel.toUpperCase();
                energyRisk.querySelector('.risk-fill').style.width = Math.min(riskPercent, 100) + '%';
            }
            
            if (document.getElementById('energyLow')) document.getElementById('energyLow').textContent = lowEstimate.toLocaleString();
            if (document.getElementById('energyAvg')) document.getElementById('energyAvg').textContent = avgEstimate.toLocaleString();
            if (document.getElementById('energyHigh')) document.getElementById('energyHigh').textContent = highEstimate.toLocaleString();
            if (document.getElementById('weeklyTotal')) document.getElementById('weeklyTotal').textContent = (predicted * 7).toLocaleString();
            
            console.log('Energy prediction:', predicted, 'kWh');
        });
    }

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

    // Carbon Forecast
    const carbonForm = document.getElementById('carbonForm');
    if (carbonForm) {
        carbonForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const energyConsumption = parseFloat(document.getElementById('energyConsumption').value) || 2500;
            const energySource = document.getElementById('energySource').value;
            
            const result = calculateCarbonEmissions(energyConsumption, energySource);
            
            const emissionValue = document.querySelector('.emission-result .emission-value');
            if (emissionValue) emissionValue.textContent = result.dailyEmissions;
            
            const currentBar = document.querySelector('.comparison-bar.current .bar-fill');
            const targetBar = document.querySelector('.comparison-bar.target .bar-fill');
            if (currentBar) currentBar.style.width = Math.min(result.dailyEmissions * 50, 100) + '%';
            if (targetBar) targetBar.style.width = Math.min(result.targetEmissions * 50, 100) + '%';
            
            console.log('Carbon forecast:', result);
        });
    }

    // Department Form
    const deptForm = document.getElementById('deptForm');
    if (deptForm) {
        deptForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const dept = document.getElementById('deptSelect').value;
            const units = parseFloat(document.getElementById('deptUnits').value) || 20;
            
            const result = calculateDepartmentAnalysis(dept, units, 24);
            
            if (document.getElementById('deptConsumption')) document.getElementById('deptConsumption').textContent = result.consumption;
            const ratingEl = document.getElementById('deptRating');
            if (ratingEl) {
                ratingEl.textContent = result.efficiency > 75 ? 'GOOD' : (result.efficiency > 60 ? 'FAIR' : 'POOR');
                ratingEl.className = 'risk-badge ' + (result.efficiency > 75 ? 'low' : (result.efficiency > 60 ? 'medium' : 'high'));
            }
            
            console.log('Department analysis:', result);
        });
    }

    // Cost Form
    const costForm = document.getElementById('costForm');
    if (costForm) {
        costForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const budget = parseFloat(document.getElementById('monthlyBudget').value) || 25000;
            const spend = parseFloat(document.getElementById('currentSpend').value) || 18200;
            
            const result = calculateCostAnalysis(budget, spend);
            
            if (document.getElementById('budgetUsage')) document.getElementById('budgetUsage').textContent = result.usagePercent;
            const statusEl = document.getElementById('budgetStatus');
            if (statusEl) {
                statusEl.textContent = result.usagePercent < 100 ? 'UNDER' : 'OVER';
                statusEl.className = 'risk-badge ' + (result.usagePercent < 80 ? 'low' : (result.usagePercent < 100 ? 'medium' : 'high'));
            }
            
            console.log('Cost analysis:', result);
        });
    }

    // Weather Form
    const weatherForm = document.getElementById('weatherForm');
    if (weatherForm) {
        weatherForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const temp = parseFloat(document.getElementById('weatherTemp').value) || 28;
            const humidity = parseFloat(document.getElementById('weatherHumidity').value) || 65;
            const condition = document.getElementById('weatherCondition').value;
            
            const result = calculateWeatherImpact(temp, humidity, condition);
            
            if (document.getElementById('weatherImpact')) document.getElementById('weatherImpact').textContent = '+' + result.impact;
            const riskEl = document.getElementById('weatherRisk');
            if (riskEl) {
                riskEl.textContent = result.risk.toUpperCase();
                riskEl.className = 'risk-badge ' + result.risk;
            }
            
            console.log('Weather impact:', result);
        });
    }

    // Alert Form
    const alertForm = document.getElementById('alertForm');
    if (alertForm) {
        alertForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Alert thresholds saved successfully!');
        });
    }

    // Search
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function() { console.log('Searching:', this.value); });
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
