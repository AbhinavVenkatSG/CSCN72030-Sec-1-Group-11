// Spencer Watkinson
// Generator Device, reads delta gasoline usage values from a file

namespace FalloutBunkerManager.Devices;

public class Generator : IDevice
{
    // Params
    public FileManager fileManager { get; }
    public DeviceType type { get { return DeviceType.Generator; } }
    public string filePath { get; } = System.IO.Path.Combine("SensorEmulationFiles", "GasolineLevels.dat");

    private float curGasLevel = 100f;
    private const float MAX_GAS_LEVEL = 100f;
    private const float MIN_GAS_LEVEL = 0f;

    private BunkerStatuses bunkerStatuses;


    // Constructor
    public Generator(BunkerStatuses bunkerStatuses)
    {
        this.bunkerStatuses = bunkerStatuses;
        fileManager = new FileManager(filePath);
    }

    // Methods
    public DeviceStatus QueryLatest()
    {
        // 1) Read the base daily delta from the emulation file.
        float readInValue = fileManager.GetNextValue();

        // 2) Running the scrubber harder reduces the daily fuel delta (62% power => 0.62x).
        var scrubberScale = bunkerStatuses.O2ScrubberPower / 100f;
        if (scrubberScale <= 0f) scrubberScale = 1f;
        readInValue *= scrubberScale;

        // 3) Lights switching off at low gas halves the daily burn.
        if (curGasLevel < bunkerStatuses.LightsOnThreshold)
        {
            readInValue *= 0.5f;
        }

        // 4) Scavenging can return extra gasoline (random 15-40).
        if (bunkerStatuses.IsScavenging == true)
        {
            readInValue += Random.Shared.Next(15, 41);
        }

        // 5) Apply the adjusted delta to the running gas level.
        curGasLevel += readInValue;

        // 6) Clamp gas between 0-100 to avoid impossible values.
        if (curGasLevel > MAX_GAS_LEVEL) curGasLevel = MAX_GAS_LEVEL;
        if (curGasLevel < MIN_GAS_LEVEL) curGasLevel = MIN_GAS_LEVEL;

        // 7) Persist gas and light status for other devices.
        bunkerStatuses.GasolineLevel = curGasLevel;
        bunkerStatuses.LightsOn = curGasLevel > bunkerStatuses.LightsOnThreshold;
        
        // 8) Report the updated gas level.
        return new DeviceStatus
        { 
            type = DeviceType.Generator,
            currentValue = curGasLevel
        };
    }
}
