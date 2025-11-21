// Ricardo & Spencer
// Dosimeter Device, reads static radiation values from a file

namespace FalloutBunkerManager.Devices;

public class Dosimeter : IDevice
{
    // Params
    public FileManager fileManager { get; }
    public DeviceType type { get { return DeviceType.Dosimeter; } }
    public string filePath { get; } = Path.Combine("SensorEmulationFiles", "RadiationLevels.dat");

    private BunkerStatuses bunkerStatuses;


    // Constructor
    public Dosimeter(BunkerStatuses bunkerStatuses)
    {
        this.bunkerStatuses = bunkerStatuses;
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
}
