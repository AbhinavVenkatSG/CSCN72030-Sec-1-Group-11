using FalloutBunkerManager.Devices;

namespace FalloutBunkerManager;

/// <summary>
/// Creates the bunker device graph once and exposes helper methods to query it.
/// </summary>
public class DeviceNetwork
{
    private readonly IDevice[] devices;
    private readonly BunkerStatuses bunkerStatuses;

    public DeviceNetwork(BunkerStatuses bunkerStatuses)
    {
        this.bunkerStatuses = bunkerStatuses;

        devices = new IDevice[]
        {
            // Order matters: run devices in the sequence defined in README.md.
            new HealthMonitor(bunkerStatuses),
            new FoodSensor(bunkerStatuses),
            new WaterSensor(bunkerStatuses),
            new O2Scrubber(bunkerStatuses),
            new Generator(bunkerStatuses),
            new Thermometer(bunkerStatuses),
            new Dosimeter(bunkerStatuses)
        };
    }

    public IReadOnlyList<IDevice> Devices => devices;
    public BunkerStatuses Statuses => bunkerStatuses;

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
