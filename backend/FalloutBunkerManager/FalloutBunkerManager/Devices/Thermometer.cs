// Spencer Watkinson
// Thermometer Device, reads static temperature values from a file

namespace FalloutBunkerManager.Devices;

public class Thermometer : IDevice
{
    // Params
    public FileManager fileManager { get; }
    public DeviceType type { get { return DeviceType.Thermometer; } }
    public string filePath { get; } = Path.Combine("SensorEmulationFiles", "Temperature.dat");
    private BunkerStatuses bunkerStatuses;

    // Constructor
    public Thermometer(BunkerStatuses bunkerStatuses)
    {
        this.bunkerStatuses = bunkerStatuses;
        fileManager = new FileManager(filePath);
    }

    // Methods
    public DeviceStatus QueryLatest()
    {
        float readInValue = fileManager.GetNextValue();

        // do math

        return new DeviceStatus
        {
            type = DeviceType.Thermometer,
            currentValue = readInValue
        };
    }
}
