// Devki Nandan Sharma
// Food Sensor Device, reads delta food values from a file

class FoodSensor : IDevice
{
    // Params
    public FileManager fileManager { get; }
    public DeviceType type { get { return DeviceType.FoodSensor; } }
    public string filePath { get; } = Path.Combine("SensorEmulationFiles", "FoodLevels.dat");
    private float currentFoodLevel { get; set; } = 100.0f;
    private float Max_Food = 100f;
    private float Min_Food = 0f;

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

        if (currentFoodLevel > Max_Food) currentFoodLevel = Max_food;
        if (cureentFoodLevel < Min_Food) currentFoodLevel = Min_food;

        return new DeviceStatus
        {
            type = DeviceType.FoodSensor,
            currentValue = currentFoodLevel
        };
    }

    public void HandleCommand(DeviceCommand command)
    {
        throw new NotImplementedException();
        // Im not sure yet, sprint 2 issue :P
    }
}
