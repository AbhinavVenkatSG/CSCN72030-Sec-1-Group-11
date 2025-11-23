// Rami and Devki
// Water Sensor Device, reads delta water values from a file

namespace FalloutBunkerManager.Devices;

public class WaterSensor : IDevice
{
    // Params
    public FileManager fileManager { get; }
    public DeviceType type { get { return DeviceType.WaterSensor; } }
    public string filePath { get; } = Path.Combine("SensorEmulationFiles", "WaterLevels.dat");

    private float currentWaterLevel { get; set; } = 100.0f;
    private const float MAX_WATER = 100f;
    private const float MIN_WATER = 0f;

    private BunkerStatuses bunkerStatuses;

    // Constructor
    public WaterSensor(BunkerStatuses bunkerStatuses)
    {
        this.bunkerStatuses = bunkerStatuses;
        fileManager = new FileManager(filePath);
    }

    // Methods
    public DeviceStatus QueryLatest()
    {
        // 1) Read the base daily delta from the emulation file.
        float readInValue = fileManager.GetNextValue();

        // 2) Scavenging can return extra water (random 15-40).
        if (bunkerStatuses.IsScavenging == true)
        {
            readInValue += Random.Shared.Next(15, 41);
        }

        // 3) Cooling the bunker at night consumes extra water.
        if (bunkerStatuses.CoolDownAtNight == true)
        {
            readInValue -= 15f;
        }

        // 4) Apply the adjusted delta to the running water level.
        currentWaterLevel += readInValue;

        // 5) Clamp water between 0-100 to avoid impossible values.
        if (currentWaterLevel > MAX_WATER) currentWaterLevel = MAX_WATER;
        if (currentWaterLevel < MIN_WATER) currentWaterLevel = MIN_WATER;

        // 6) Persist for other devices that depend on water state.
        bunkerStatuses.WaterLevel = currentWaterLevel;

        // 7) Report the updated water level.
        return new DeviceStatus
        { 
            type = DeviceType.WaterSensor,
            currentValue = currentWaterLevel
        };
    }
}
