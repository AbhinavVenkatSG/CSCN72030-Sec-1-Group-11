// Spencer Watkinson
// Generator Device, reads delta gasoline usage values from a file

class Generator : IDevice
{
    // Params
    public FileManager fileManager { get; }
    public DeviceType type { get { return DeviceType.Generator; } }
    public string filePath { get; } = System.IO.Path.Combine("SensorEmulationFiles", "GasolineLevels.dat");

    private float curGasLevel = 100f;
    private const float MAX_GAS_LEVEL = 100f;
    private const float MIN_GAS_LEVEL = 0f;

    // Constructor
    public Generator()
    {
        fileManager = new FileManager(filePath);
    }

    // Methods
    public DeviceStatus QueryLatest()
    {
        float readInValue = fileManager.GetNextValue();

        curGasLevel += readInValue;

        // Ensures gas level stays within bounds
        if (curGasLevel > MAX_GAS_LEVEL) curGasLevel = MAX_GAS_LEVEL;
        if (curGasLevel < MIN_GAS_LEVEL) curGasLevel = MIN_GAS_LEVEL;

        return new DeviceStatus
        { 
            type = DeviceType.Generator,
            currentValue = curGasLevel
        };
    }

    public void HandleCommand(DeviceCommand command)
    {
        throw new NotImplementedException();
        // Im not sure yet, sprint 2 issue :P
    }
}
