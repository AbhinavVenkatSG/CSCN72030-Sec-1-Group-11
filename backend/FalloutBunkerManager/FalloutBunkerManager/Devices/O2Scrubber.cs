// Spencer Watkinson
// Oxygen Scrubber Device, reads delta oxygen values from a file

class O2Scrubber : IDevice
{
    // Params
    public FileManager fileManager { get; }
    public DeviceType type { get { return DeviceType.O2Scrubber; } }
    public string filePath { get; } = System.IO.Path.Combine("SensorEmulationFiles", "OxygenLevels.dat");

    private float curO2Level = 100f;
    private const float MAX_O2_LEVEL = 100f;
    private const float MIN_O2_LEVEL = 0f;

    // Constructor
    public O2Scrubber()
    {
        fileManager = new FileManager(filePath);
    }

    // Methods
    public DeviceStatus QueryLatest()
    {
        float readInValue = fileManager.GetNextValue();

        curO2Level += readInValue;

        // Ensures O2 level stays within bounds
        if (curO2Level > MAX_O2_LEVEL) curO2Level = MAX_O2_LEVEL;
        if (curO2Level < MIN_O2_LEVEL) curO2Level = MIN_O2_LEVEL;

        return new DeviceStatus
        { 
            type = DeviceType.O2Scrubber,
            currentValue = curO2Level
        };
    }

    public void HandleCommand(DeviceCommand command)
    {
        throw new NotImplementedException();
        // Im not sure yet, sprint 2 issue :P
    }
}
