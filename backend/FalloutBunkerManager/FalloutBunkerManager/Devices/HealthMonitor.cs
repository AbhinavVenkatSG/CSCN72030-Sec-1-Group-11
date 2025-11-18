// Spencer Watkinson
// Health Monitor Device, reads delta health values from a file

namespace FalloutBunkerManager.Devices;

public class HealthMonitor : IDevice
{
    // Params
    public FileManager fileManager { get; }
    public DeviceType type { get { return DeviceType.HealthMonitor; } }
    public string filePath { get; } = Path.Combine("SensorEmulationFiles", "HealthLevels.dat");

    private float currentHealth { get; set; } = 100.0f;
    private const float MAX_HEALTH = 100f;
    private const float MIN_HEALTH = 0f;

    // Constructor
    public HealthMonitor()
    {
        fileManager = new FileManager(filePath);
    }

    // Methods
    public DeviceStatus QueryLatest()
    {
        float readInValue = fileManager.GetNextValue();

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
