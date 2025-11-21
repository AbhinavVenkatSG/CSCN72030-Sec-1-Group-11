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
        float readInValue = fileManager.GetNextValue();

        if (bunkerStatuses.isScavenging == true)
        {
            currentHealth *= 0.8f;  // health goes down by 20%
            // scanvenging on now we check the radiation level
            if (bunkerStatuses.raditaionLevel > 20 && bunkerStatuses.raditaionLevel < 60)
            {
                currentHealth *= 0.8f; // additional 20% decrease
            }
            else if (bunkerStatuses.raditaionLevel >= 60)
            {
                currentHealth *= 05f; // additional 50% decrease
            }
        }

        if (bunkerStatuses.rationStatus > 2)
        {
            currentHealth *= 0.8f;
        }

        if (bunkerStatuses.rationStatus < 2)
        {
            currentHealth *= 0.8f;
        }

        if (bunkerStatuses.lightsOn == false)
        {
            currentHealth *= 0.8f;
        }
      
        currentHealth += readInValue;

        // Ensures health stays within bounds
        if (currentHealth > MAX_HEALTH) currentHealth = MAX_HEALTH;
        if (currentHealth < MIN_HEALTH) currentHealth = MIN_HEALTH;

        return new DeviceStatus
        {
            type = DeviceType.HealthMonitor,
            currentValue = currentHealth
        };
    }
}
