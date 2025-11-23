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
        // 1) Read the base daily delta from the emulation file.
        float readInValue = fileManager.GetNextValue();

        // 2) If we still have gas, power setting boosts O2 output (25 * power%).
        if (bunkerStatuses.GasolineLevel > 0)
        {
            readInValue += 20f * (bunkerStatuses.O2ScrubberPower / 100f);
        }

        // 3) Apply the adjusted delta to the running oxygen level.
        curO2Level += readInValue;

        // 4) Clamp O2 between 0-100 to avoid impossible values.
        if (curO2Level > MAX_O2_LEVEL) curO2Level = MAX_O2_LEVEL;
        if (curO2Level < MIN_O2_LEVEL) curO2Level = MIN_O2_LEVEL;

        // 5) Persist for other devices that depend on oxygen level.
        bunkerStatuses.OxygenLevel = curO2Level;

        // 6) Report the updated oxygen level.
        return new DeviceStatus
        { 
            type = DeviceType.O2Scrubber,
            currentValue = curO2Level
        };
    }
}
