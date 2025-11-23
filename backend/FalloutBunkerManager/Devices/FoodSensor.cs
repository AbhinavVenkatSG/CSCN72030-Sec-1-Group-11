// Devki Nandan Sharma
// Food Sensor Device, reads delta food values from a file

namespace FalloutBunkerManager.Devices;

public class FoodSensor : IDevice
{
    // Params
    public FileManager fileManager { get; }
    public DeviceType type { get { return DeviceType.FoodSensor; } }
    public string filePath { get; } = Path.Combine("SensorEmulationFiles", "FoodLevels.dat");
    private float currentFoodLevel { get; set; } = 100.0f;
    private float MAX_FOOD = 100f;
    private float MIN_FOOD = 0f;

    private BunkerStatuses bunkerStatuses;

    // Constructor
    public FoodSensor(BunkerStatuses bunkerStatuses)
    {
        this.bunkerStatuses = bunkerStatuses;
        fileManager = new FileManager(filePath);
    }

    // Methods
    public DeviceStatus QueryLatest()
    {
        // 1) Read the base daily delta from the emulation file.
        float readInValue = fileManager.GetNextValue();

        // 2) Scale usage based on ration status (1=low, 2=mid, 3=high).
        if (bunkerStatuses.RationStatus == 1) readInValue *= 0.5f;
        if (bunkerStatuses.RationStatus == 3) readInValue *= 1.5f;

        // 3) Scavenging adds a random food windfall (15-40).
        if (bunkerStatuses.IsScavenging == true)
        {
            readInValue += Random.Shared.Next(15, 41);
        }

        // 4) Apply the adjusted delta to the running food level.
        currentFoodLevel += readInValue;

        // 5) Clamp food between 0-100 to avoid impossible values.
        if (currentFoodLevel > MAX_FOOD) currentFoodLevel = MAX_FOOD;
        if (currentFoodLevel < MIN_FOOD) currentFoodLevel = MIN_FOOD;

        // 6) Persist for other devices that care about food state.
        bunkerStatuses.FoodLevel = currentFoodLevel;

        // 7) Report the updated food level.
        return new DeviceStatus
        {
            type = DeviceType.FoodSensor,
            currentValue = currentFoodLevel
        };
    }
}
