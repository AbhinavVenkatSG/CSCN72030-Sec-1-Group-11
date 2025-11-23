namespace FalloutBunkerManager.Devices;

public class BunkerStatuses
{
    // Updated from UI
    public int LightsOnThreshold { get; set; } = 50;
    public bool IsScavenging { get; set; } = false; 
    public int RationStatus { get; set; } = 2;
    public float O2ScrubberPower { get; set; } = 0f;
    public bool CoolDownAtNight { get; set; } = false;

    // Updated from devices
    public bool LightsOn { get; set; } = true;
    public float HealthLevel { get; set; } = 100f;
    public float FoodLevel { get; set; } = 100f;
    public float WaterLevel { get; set; } = 100f;
    public float GasolineLevel { get; set; } = 100f;
    public float OxygenLevel { get; set; } = 100f;
    public float Temperature { get; set; } = 0f;
    public float RadiationLevel { get; set; } = 0f;
}
