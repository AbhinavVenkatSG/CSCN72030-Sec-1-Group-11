using FalloutBunkerManager.Devices;

namespace FalloutBunkerManager;

/// <summary>
/// Creates the bunker device graph once and exposes helper methods to query it.
/// </summary>
public class DeviceNetwork
{
    private readonly IDevice[] devices;

    public DeviceNetwork()
    {
        var bunkerStatuses = new BunkerStatuses();

        devices = new IDevice[]
        {
            new Thermometer(bunkerStatuses),
            new WaterSensor(),
            new FoodSensor(),
            new Generator(),
            new O2Scrubber(),
            new HealthMonitor(bunkerStatuses),
            new Dosimeter()
        };
    }

    public IReadOnlyList<IDevice> Devices => devices;

    public DeviceStatus[] QueryDevices()
    {
        var deviceStatuses = new DeviceStatus[devices.Length];

        for (int i = 0; i < devices.Length; i++)
        {
            deviceStatuses[i] = devices[i].QueryLatest();
        }

        return deviceStatuses;
    }
}
