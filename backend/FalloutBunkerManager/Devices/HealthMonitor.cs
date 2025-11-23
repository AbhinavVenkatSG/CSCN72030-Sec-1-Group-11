// Spencer Watkinson
// Health Monitor Device, reads delta health values from a file

namespace FalloutBunkerManager.Devices;

public class HealthMonitor : IDevice
{
    // Params
    public FileManager fileManager { get; }
    public DeviceType type { get { return DeviceType.HealthMonitor; } }
    public string filePath { get; } = Path.Combine("SensorEmulationFiles", "HealthLevels.dat");
    private BunkerStatuses bunkerStatuses;

    private float currentHealth { get; set; } = 100.0f;
    private const float MAX_HEALTH = 100f;
    private const float MIN_HEALTH = 0f;

    // Constructor
    public HealthMonitor(BunkerStatuses bunkerStatuses)
    {
        this.bunkerStatuses = bunkerStatuses;
        fileManager = new FileManager(filePath);
    }

    // Methods
    public DeviceStatus QueryLatest()
    {
        // 1) Read the base daily delta from the emulation file.
        float dailyValue = fileManager.GetNextValue();

        // 2) Scavenging hurts: subtract radiation-weighted penalty from the daily delta.
        if (bunkerStatuses.IsScavenging == true)
        {
            dailyValue -= bunkerStatuses.RadiationLevel * 0.5f;
        }

        // 3) Heat stroke if it is hot and we are not cooling down.
        if (bunkerStatuses.Temperature >= 35 && bunkerStatuses.CoolDownAtNight == false)
        {
            dailyValue -= 20f;
        }

        // 4) Suffocation damage when oxygen is gone.
        if (bunkerStatuses.OxygenLevel == 0)
        {
            dailyValue -= 10f;
        }

        // 5) Dehydration damage at zero water.
        if (bunkerStatuses.WaterLevel == 0)
        {
            dailyValue -= 5f;
        }

        // 6) Starvation damage at zero food (also skip ration bonus).
        var foodDepleted = bunkerStatuses.FoodLevel == 0;
        if (foodDepleted)
        {
            dailyValue -= 5f;
        }

        // 7) Morale bump from rations if food exists.
        if (foodDepleted == false)
        {
            if (bunkerStatuses.RationStatus == 1) dailyValue += 5f;
            else if (bunkerStatuses.RationStatus == 2) dailyValue += 10f;
            else if (bunkerStatuses.RationStatus == 3) dailyValue += 15f;
        }

        // 8) Lights off doubles the daily swing.
        if (bunkerStatuses.LightsOn == false)
        {
            dailyValue *= 2f;
        }

        // 9) Apply the adjusted delta to the running health.
        currentHealth += dailyValue;

        // 10) Clamp health between 0-100 to avoid impossible values.
        if (currentHealth > MAX_HEALTH) currentHealth = MAX_HEALTH;
        if (currentHealth < MIN_HEALTH) currentHealth = MIN_HEALTH;

        // 11) Persist for other devices that might need health.
        bunkerStatuses.HealthLevel = currentHealth;

        // 12) Report the updated health level.
        return new DeviceStatus
        {
            type = DeviceType.HealthMonitor,
            currentValue = currentHealth
        };
    }
}
