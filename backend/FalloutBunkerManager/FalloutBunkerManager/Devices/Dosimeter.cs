// Ricardo & Spencer
// Dosimeter Device, reads static radiation values from a file

class Dosimeter : IDevice
{
    // Params
    public FileManager fileManager { get; }
    public DeviceType type { get { return DeviceType.Dosimeter; } }
    public string filePath { get; } = Path.Combine("SensorEmulationFiles", "RadiationLevels.dat");

    // Constructor
    public Dosimeter()
    {
        fileManager = new FileManager(filePath);
    }

    // Methods
    public DeviceStatus QueryLatest()
    {
        float readInValue = fileManager.GetNextValue();

        return new DeviceStatus
        { 
            type = DeviceType.Dosimeter,
            currentValue = readInValue
        };
    }

    public void HandleCommand(DeviceCommand command)
    {
        throw new NotImplementedException();
        // Im not sure yet, sprint 2 issue :P
    }
}
