"""
POST /api/irrigation endpoint (Bonus Module B: Smart Irrigation).
Predicts irrigation requirements from soil moisture, weather forecast, and crop stage to optimize water use and arrest foliar blight spores.
"""

from fastapi import APIRouter
from backend.schemas import IrrigationRequest, IrrigationResponse

router = APIRouter()

@router.post("/api/irrigation", response_model=IrrigationResponse, tags=["Bonus Module B: Smart Irrigation"])
def calculate_smart_irrigation(req: IrrigationRequest):
    """
    Evaluates soil moisture, crop water stress, and precipitation forecast.
    Prevents unnecessary overhead watering when high moisture exacerbates fungal leaf spores.
    """
    moisture = req.soil_moisture
    rain_fc = (req.rain_forecast or "Low").capitalize()
    crop = req.crop_type
    stage = req.growth_stage

    # Logic: If rain forecast is High/Moderate or soil moisture > 60%, suspend overhead irrigation to prevent foliar blight proliferation
    if rain_fc in ["High", "Moderate"] and moisture >= 30.0:
        action = "Suspend Irrigation — Precipitation Expected"
        urgency = "Low"
        blight_risk = "High Spore Dispersion Risk (Elevated Humidity)"
        water_needed = 0.0
        status_str = f"Soil moisture at {moisture}% with {rain_fc} rain forecast."
        reasoning = f"Rainfall forecast ({rain_fc}) will supply root zone moisture. Suspending irrigation prevents leaf wetness and arrests fungal spore germination (Alternaria/Phytophthora)."
        zone_recommendation = "Zone 4B Solenoids Disengaged (Rain Lockout)"

    elif moisture < 25.0:
        action = "Irrigate Immediately — Drip Root Zone Only"
        urgency = "Immediate"
        blight_risk = "Low Foliar Risk (Keep Water Off Canopy)"
        water_needed = 4.5 if stage.lower() in ["flowering", "fruiting"] else 3.0
        status_str = f"Critical Moisture Deficit ({moisture}%)."
        reasoning = f"{crop} at {stage} stage exhibits water stress below threshold (25%). Apply root-level drip irrigation for 45 minutes to deliver {water_needed} L/m²."
        zone_recommendation = "Zone 4B Sub-surface Micro-Drip Valve Active (1.8 L/hr delivery)"

    elif 25.0 <= moisture <= 55.0:
        if rain_fc == "High":
            action = "Delay Irrigation — Monitor Rain Radar"
            urgency = "Low"
            blight_risk = "Moderate Risk"
            water_needed = 0.0
            status_str = f"Optimal-to-Moderate Moisture ({moisture}%)."
            reasoning = "Soil moisture is currently stable. High rain probability in next 24h will replenish topsoil."
            zone_recommendation = "Standby (Automated Rain Delay Active)"
        else:
            action = "Maintenance Drip Irrigation"
            urgency = "Normal"
            blight_risk = "Low Risk"
            water_needed = 2.0
            status_str = f"Moisture Adequate ({moisture}%)."
            reasoning = f"Maintain root moisture for {crop} ({stage} stage) via short morning drip cycle."
            zone_recommendation = "Zone 4B Root Drip Active (30 min cycle)"

    else: # moisture > 55%
        action = "Optimal Moisture — No Action Required"
        urgency = "Low"
        blight_risk = "High Humidity Alert if Leaves Wet"
        water_needed = 0.0
        status_str = f"Soil Saturated / Sufficient Moisture ({moisture}%)."
        reasoning = "Soil moisture level is optimal. Avoid additional watering to prevent root asphyxiation and foliar fungal proliferation."
        zone_recommendation = "Solenoids Inactive"

    return IrrigationResponse(
        status="success",
        action=action,
        urgency=urgency,
        foliar_blight_risk=blight_risk,
        recommended_water_liters_per_sqm=water_needed,
        moisture_status=status_str,
        reasoning=reasoning,
        solenoid_zone_recommendation=zone_recommendation
    )
