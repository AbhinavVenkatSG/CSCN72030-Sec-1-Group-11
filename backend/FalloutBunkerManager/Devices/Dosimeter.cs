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
        // 1) Read today's radiation level straight from the dataset.
        float readInValue = fileManager.GetNextValue();

        // 2) Persist the reading so other devices can react to radiation.
        bunkerStatuses.RadiationLevel = readInValue;

        // 3) Report the latest reading for the API response.
        return new DeviceStatus
        { 
            type = DeviceType.Dosimeter,
            currentValue = readInValue
        };
    }
}
