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
        // 1) Pull the next temperature reading from file.
        float readInValue = fileManager.GetNextValue();

        // 2) Store the reading for other device calculations.
        bunkerStatuses.Temperature = readInValue;

        // 3) Return the latest temperature snapshot.
        return new DeviceStatus
        {
            type = DeviceType.Thermometer,
            currentValue = readInValue
        };
    }
}
