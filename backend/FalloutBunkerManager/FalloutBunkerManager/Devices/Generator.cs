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

        if (bunkerStatuses.isScavenging == true)
        {
            curGasLevel *= 1.2f;
        }


        float readInValue = fileManager.GetNextValue();

        if (bunkerStatuses.lightsOn == false)
        {
            readInValue = readInValue / 2;
        }
        else
        {
            readInValue *= 2;
        }
        
        if (bunkerStatuses.O2ScrubberPower > 0)
        {
            readInValue += bunkerStatuses.O2ScrubberPower / 10;
        }


        

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
}
