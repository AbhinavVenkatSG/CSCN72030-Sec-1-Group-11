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

    // Constructor
    public FoodSensor()
    {
        fileManager = new FileManager(filePath);
    }

    // Methods
    public DeviceStatus QueryLatest()
    {
        float readInValue = fileManager.GetNextValue();

        currentFoodLevel += readInValue;

        if (currentFoodLevel > MAX_FOOD) currentFoodLevel = MAX_FOOD;
        if (currentFoodLevel < MIN_FOOD) currentFoodLevel = MIN_FOOD;

        return new DeviceStatus
        {
            type = DeviceType.FoodSensor,
            currentValue = currentFoodLevel
        };
    }
}
