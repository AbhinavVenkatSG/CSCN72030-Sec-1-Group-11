// Spencer Watkinson
// Oxygen Scrubber Device, reads delta oxygen values from a file

namespace FalloutBunkerManager.Devices;

public class O2Scrubber : IDevice
{
    // Params
    public FileManager fileManager { get; }
    public DeviceType type { get { return DeviceType.O2Scrubber; } }
    public string filePath { get; } = System.IO.Path.Combine("SensorEmulationFiles", "OxygenLevels.dat");

    private float curO2Level = 100f;
    private const float MAX_O2_LEVEL = 100f;
    private const float MIN_O2_LEVEL = 0f;

    private BunkerStatuses bunkerStatuses;


    // Constructor
    public O2Scrubber(BunkerStatuses bunkerStatuses)
    {
        this.bunkerStatuses = bunkerStatuses;
        fileManager = new FileManager(filePath);
    }

    // Methods
    public DeviceStatus QueryLatest()
    {
        float readInValue = fileManager.GetNextValue();
        if (bunkerStatuses.O2ScrubberPower > 0)
        {
            curO2Level += bunkerStatuses.O2ScrubberPower / 10;
        }

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
}
